GOTEST = go test

benchmarks:
	go mod download
	$(GOTEST) -benchmem -run=^$ -bench ^BenchmarkUploadFile$ github.com/PoorMercymain/photo-storage/internal/photo-storage/handlers -benchtime=5s -count=5
	$(GOTEST) -benchmem -run=^$ -bench ^BenchmarkGetFile$ github.com/PoorMercymain/photo-storage/internal/photo-storage/handlers -benchtime=5s -count=5

benchmark-upload:
	go mod download
	$(GOTEST) -benchmem -run=^$ -bench ^BenchmarkUploadFile$ github.com/PoorMercymain/photo-storage/internal/photo-storage/handlers -benchtime=5s -count=5

benchmark-get:
	go mod download
	$(GOTEST) -benchmem -run=^$ -bench ^BenchmarkGetFile$ github.com/PoorMercymain/photo-storage/internal/photo-storage/handlers -benchtime=5s -count=5