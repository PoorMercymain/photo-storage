package main

import (
	"context"
	"expvar"
	"log"
	"net/http"
	"net/http/pprof"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"go.uber.org/zap"

	"github.com/PoorMercymain/photo-storage/internal/photo-storage/handlers"
	"github.com/PoorMercymain/photo-storage/internal/photo-storage/repository"
	"github.com/PoorMercymain/photo-storage/internal/photo-storage/service"
	"github.com/PoorMercymain/photo-storage/pkg/logger"
)

func main() {
	r := repository.New()
	s := service.New(r)

	allowedMIME := map[string]struct{}{
		"image/jpeg": {},
		"image/png":  {},
		"image/webp": {},
	}

	h := handlers.New(s, allowedMIME)

	mux := http.NewServeMux()

	mux.Handle("/upload", enableCORS(http.HandlerFunc(h.UploadPhoto))) // обработчик CORS для /upload
	mux.Handle("/get/{id}", enableCORS(http.HandlerFunc(h.GetPhoto)))  // обработчик CORS для /get/{id}

	mux.HandleFunc("/pprof/*", pprof.Index)
	mux.HandleFunc("/pprof/cmdline", pprof.Cmdline)
	mux.HandleFunc("/pprof/profile", pprof.Profile)
	mux.HandleFunc("/pprof/symbol", pprof.Symbol)
	mux.HandleFunc("/pprof/trace", pprof.Trace)
	mux.Handle("/vars", expvar.Handler())

	mux.Handle("/pprof/goroutine", pprof.Handler("goroutine"))
	mux.Handle("/pprof/threadcreate", pprof.Handler("threadcreate"))
	mux.Handle("/pprof/mutex", pprof.Handler("mutex"))
	mux.Handle("/pprof/heap", pprof.Handler("heap"))
	mux.Handle("/pprof/block", pprof.Handler("block"))
	mux.Handle("/pprof/allocs", pprof.Handler("allocs"))

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

// Функция для включения CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Разрешаем доступ с любых источников
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
