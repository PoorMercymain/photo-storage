GOTEST = go test

benchmarks:
	go mod download
	$(GOTEST) ./internal/photo-storage/handlers -benchmem -run=^$ -benchtime=5s -count=5 -bench ^BenchmarkUploadFile$
	$(GOTEST) ./internal/photo-storage/handlers -benchmem -run=^$ -benchtime=5s -count=5 -bench ^BenchmarkGetFile$

benchmark-upload:
	go mod download
	$(GOTEST) ./internal/photo-storage/handlers -benchmem -run=^$ -benchtime=5s -count=5 -bench ^BenchmarkUploadFile$

benchmark-get:
	go mod download
	$(GOTEST) ./internal/photo-storage/handlers -benchmem -run=^$ -benchtime=5s -count=5 -bench ^BenchmarkGetFile$