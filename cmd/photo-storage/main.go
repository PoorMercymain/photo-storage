package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/PoorMercymain/photo-storage/internal/photo-storage/handlers"
	"github.com/PoorMercymain/photo-storage/internal/photo-storage/repository"
	"github.com/PoorMercymain/photo-storage/internal/photo-storage/service"
	"github.com/PoorMercymain/photo-storage/pkg/logger"
	"go.uber.org/zap"
)

func main() {
	r := repository.New()
	s := service.New(r)

	allowedMIME := map[string]struct{}{
		"image/jpeg": {},
		"image/png": {},
		"image/webp": {},
	}

	h := handlers.New(s, allowedMIME)

	mux := http.NewServeMux()

	mux.Handle("POST /upload", http.HandlerFunc(h.UploadPhoto))
	mux.Handle("GET /get/{id}", http.HandlerFunc(h. GetPhoto))

	server := &http.Server{
		Addr:     "localhost" + ":" + strconv.Itoa(8080),
		ErrorLog: log.New(logger.Logger(), "", 0),
		Handler:  mux,
	}

	go func() {
		logger.Logger().Infoln("Server started, listening on port", 8080)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Logger().Fatalln("ListenAndServe failed", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)

	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	<-quit

	logger.Logger().Infoln("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		logger.Logger().Fatalln("Server was forced to shutdown:", zap.Error(err))
	}

	logger.Logger().Infoln("Server was shut down")
}