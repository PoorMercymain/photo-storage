package service

import "github.com/PoorMercymain/photo-storage/internal/photo-storage/domain"

type photoStorage struct {
	repo domain.PhotoStorageRepository
}

func New(repo domain.PhotoStorageRepository) *photoStorage {
	return &photoStorage{repo: repo}
}

func (s *photoStorage) UploadPhoto(fileBytes []byte, fileType string) (int, error) {
	return s.repo.UploadPhoto(fileBytes, fileType)
}

func (s *photoStorage) GetPhoto(id int) ([]byte, string, error)  {
	return s.repo.GetPhoto(id)
}