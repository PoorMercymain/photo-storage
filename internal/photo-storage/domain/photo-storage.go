package domain

type PhotoStorageService interface {
	UploadPhoto(fileBytes []byte, fileType string) (int, error)
	GetPhoto(id int) ([]byte, string, error)
}

type PhotoStorageRepository interface {
	UploadPhoto(fileBytes []byte, fileType string) (int, error)
	GetPhoto(id int) ([]byte, string, error)
}