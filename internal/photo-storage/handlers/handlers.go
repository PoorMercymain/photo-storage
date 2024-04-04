package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"

	appErrors "github.com/PoorMercymain/photo-storage/errors"
	"github.com/PoorMercymain/photo-storage/internal/photo-storage/domain"
)

type photoStorage struct {
	srv         domain.PhotoStorageService
	allowedMIME map[string]struct{}
}

func New(srv domain.PhotoStorageService, allowedMIME map[string]struct{}) *photoStorage {
	return &photoStorage{srv: srv, allowedMIME: allowedMIME}
}

func (h *photoStorage) UploadPhoto(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	if r.ContentLength > 1024*1024*10 {
		http.Error(w, "10 MB is the maximum size of file to upload", http.StatusBadRequest)
		return
	}

	if _, ok := h.allowedMIME[r.Header.Get("Content-Type")]; !ok {
		http.Error(w, "allowed types are only: jpeg, png and webp", http.StatusBadRequest)
		return
	}

	fileBytes, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	idNum, err := h.srv.UploadPhoto(fileBytes, strings.TrimPrefix(r.Header.Get("Content-Type"), "image/"))
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

func (h *photoStorage) GetPhoto(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	idStr := r.PathValue("id")
	if idStr == "" {
		http.Error(w, "id was not provided", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "provided id is not a number", http.StatusBadRequest)
		return
	}

	photoBytes, photoType, err := h.srv.GetPhoto(id)
	if err != nil {
		if errors.Is(err, appErrors.ErrFileNotFound) {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "image/"+photoType)

	_, err = w.Write(photoBytes)
	if err != nil {
		http.Error(w, "failed to send multipart data", http.StatusInternalServerError)
	}
}
