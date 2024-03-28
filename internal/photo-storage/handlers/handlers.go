package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/PoorMercymain/photo-storage/internal/photo-storage/domain"
)

type photoStorage struct {
	srv domain.PhotoStorageService
	allowedMIME map[string]struct{}
}

func New(srv domain.PhotoStorageService, allowedMIME map[string]struct{}) *photoStorage {
	return &photoStorage{srv: srv, allowedMIME: allowedMIME}
}

func (h *photoStorage) UploadPhoto(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	file, fileHeader, err := r.FormFile("photo")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	if _, ok := h.allowedMIME[fileHeader.Header.Get("Content-Type")]; !ok {
		http.Error(w, "allowed types are only: jpeg, png and webp" , http.StatusBadRequest)
		return
	}

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	idNum, err := h.srv.UploadPhoto(fileBytes, strings.TrimPrefix(fileHeader.Header.Get("Content-Type"), "image/"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id := domain.ID{ID: idNum}

	w.WriteHeader(http.StatusCreated)
	w.Header().Add("Content-Type", "application/json")

	e := json.NewEncoder(w)

	err = e.Encode(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *photoStorage) GetPhoto(w http.ResponseWriter, r *http.Request)  {
	return
}
