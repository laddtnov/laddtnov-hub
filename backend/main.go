package main

import (
	"log"
	"net/http"
	"os"
	"time"
)

// Config holds everything the server needs, loaded once from environment
// variables at startup. Keeping it as a plain struct (instead of globals)
// makes handlers easy to test — pass a Config in, get a handler out.
type Config struct {
	Port          string
	AllowedOrigin string
	SMTPHost      string
	SMTPPort      string
	SMTPUser      string
	SMTPPass      string
	ToEmail       string
}

func loadConfig() Config {
	return Config{
		Port:          getEnv("PORT", "8080"),
		AllowedOrigin: getEnv("ALLOWED_ORIGIN", "https://laddtnov.xyz"),
		SMTPHost:      os.Getenv("SMTP_HOST"),
		SMTPPort:      getEnv("SMTP_PORT", "587"),
		SMTPUser:      os.Getenv("SMTP_USER"),
		SMTPPass:      os.Getenv("SMTP_PASS"),
		ToEmail:       os.Getenv("TO_EMAIL"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	cfg := loadConfig()

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", handleHealth)
	mux.HandleFunc("/api/contact", handleContact(cfg))

	// Explicit timeouts. http.ListenAndServe leaves all of these at zero,
	// meaning a client can open a connection and hold it open indefinitely
	// without ever completing a request.
	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           withCORS(cfg.AllowedOrigin, mux),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second, // covers the outbound SMTP send
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("listening on :%s (allowed origin: %s)", cfg.Port, cfg.AllowedOrigin)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}

// withCORS allows the portfolio frontend (and only that origin) to call
// this API from the browser. Preflight (OPTIONS) requests are answered
// directly without reaching the underlying mux.
func withCORS(allowedOrigin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
