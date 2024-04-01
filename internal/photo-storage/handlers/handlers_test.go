package handlers

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"math/rand"
	"net/http"
	"testing"
	"time"
)

func generateRandomImage(rng *rand.Rand) (*bytes.Buffer, error) {
	width, height := 100, 100
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			img.Set(x, y, color.RGBA{
				R: uint8(rng.Intn(256)),
				G: uint8(rng.Intn(256)),
				B: uint8(rng.Intn(256)),
				A: 255,
			})
		}
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, err
	}

	return &buf, nil
}

type ListNode struct {
	ImageBuffer *bytes.Buffer
	Next        *ListNode
}

type ImageList struct {
	head *ListNode
	curr *ListNode
}

func (l *ImageList) Add(buffer *bytes.Buffer) {
	node := &ListNode{ImageBuffer: buffer}
	if l.head == nil {
		l.head = node
		l.curr = node
	} else {
		l.curr.Next = node
		l.curr = node
	}
	l.curr.Next = l.head
}

func (l *ImageList) Next() *bytes.Buffer {
	if l.curr == nil || l.curr.Next == nil {
		return nil
	}
	buffer := l.curr.ImageBuffer
	l.curr = l.curr.Next
	return buffer
}

func NewImageList(n int) (*ImageList, error) {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	list := &ImageList{}
	for i := 0; i < n; i++ {
		imageBuffer, err := generateRandomImage(rng)
		if err != nil {
			return nil, err
		}
		list.Add(imageBuffer)
	}
	return list, nil
}

func BenchmarkUploadFile(b *testing.B) {
	numImages := 5
	imageList, err := NewImageList(numImages)
	if err != nil {
		b.Fatalf("Ошибка при создании списка изображений: %v", err)
	}

	client := &http.Client{}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		for j := 0; j < numImages; j++ {
			buffer := imageList.Next()
			req, err := http.NewRequest("POST", "http://localhost:8080/upload", buffer)
			if err != nil {
				b.Fatalf("Не удалось создать запрос: %v", err)
			}
			req.Header.Set("Content-Type", "image/png")

			resp, err := client.Do(req)
			if err != nil {
				b.Fatalf("Ошибка при выполнении запроса: %v", err)
			}
			resp.Body.Close()
		}
	}
}

func BenchmarkGetFile(b *testing.B) {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	totalFiles := 700

	client := &http.Client{}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		fileID := rng.Intn(totalFiles) + 1

		url := fmt.Sprintf("http://localhost:8080/get/%d", fileID)

		resp, err := client.Get(url)
		if err != nil {
			b.Fatalf("Ошибка при выполнении запроса: %v", err)
		}

		resp.Body.Close()
	}
}
