package repository

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"strconv"
	"sync"
)

type photoStorage struct {
	id int
	*sync.Mutex
}

func New() *photoStorage {
	var number int

	file, err := os.Open("lastID.txt")
    if err != nil {
        if !errors.Is(err, fs.ErrNotExist) {
			panic(err)
        }
	} else {
		defer file.Close()

		_, err := fmt.Fscanf(file, "%d", &number)
		if err != nil {
			number = 0
		}
	}

	return &photoStorage{id: number, Mutex: &sync.Mutex{}}
}

func (r *photoStorage) saveID() error {
	file, err := os.OpenFile("lastID.txt", os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
    if err != nil {
        return err
    }
    defer file.Close()

    _, err = fmt.Fprintf(file, "%d", r.id)
    if err != nil {
        return err
    }

	return nil
}

func (r *photoStorage) UploadPhoto(fileBytes []byte, fileType string) (int, error) {
	r.Lock()
	defer r.Unlock()

	r.id++

	path := "photos/"

	if _, err := os.Stat(path); errors.Is(err, fs.ErrNotExist) {
        err := os.Mkdir(path, 0755)
        if err != nil {
            return 0, err
        }
	} else if err != nil {
		return 0, err
	}

	path += "photo_" + strconv.Itoa(r.id) + "." + fileType

	err := os.WriteFile(path, fileBytes, 0644)
	if err != nil {
		return 0, err
	}

	err = r.saveID()
	if err != nil {
		return 0, err
	}

	return r.id, nil
}

func (r *photoStorage) GetPhoto(id int) ([]byte, error) {
	return nil, nil
}