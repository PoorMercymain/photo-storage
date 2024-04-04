GOTEST = go test
BROWSER_PATH = '/mnt/c/Program Files/Mozilla Firefox/firefox.exe'

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

take-profile:
	curl -s http://localhost:8080/pprof/profile?seconds=20 > profiles/profile.pprof

visualize-profile:
	BROWSER=$(BROWSER_PATH) go tool pprof -http :8081 profiles/profile.pprof

build-pgo:
	go build -pgo 'profiles/profile.pprof' cmd/photo-storage/main.go