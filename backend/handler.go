package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

// ContactRequest mirrors the fields sent by the contact form in index.html
// (Name / Email / Message). JSON is the only format exchanged with the
// frontend, per the project's frontend/backend separation rule.
type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`

	// Website is a honeypot. The form renders it hidden and off-screen, so a
	// human never fills it in and a bot that fills every input does. It is
	// named plausibly on purpose — "honeypot" would be a giveaway.
	Website string `json:"website"`
}

type contactResponse struct {
	OK     bool              `json:"ok"`
	Errors map[string]string `json:"errors,omitempty"`
}

const maxBodyBytes = 1 << 16 // 64KB — plenty for a contact form, blocks oversized payloads

// submitInterval is the minimum gap between submissions from one IP.
const submitInterval = 30 * time.Second

func handleContact(cfg Config) http.HandlerFunc {
	limiter := newRateLimiter(submitInterval)

	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		if !limiter.allow(clientIP(r), time.Now()) {
			writeJSON(w, http.StatusTooManyRequests, contactResponse{
				Errors: map[string]string{"_": "please wait a moment before sending another message"},
			})
			return
		}

		r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)

		var req ContactRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, contactResponse{Errors: map[string]string{"_": "invalid JSON body"}})
			return
		}

		req.Name = strings.TrimSpace(req.Name)
		req.Email = strings.TrimSpace(req.Email)
		req.Message = strings.TrimSpace(req.Message)

		// Honeypot filled means a bot. Answer 200 so it cannot tell it was
		// caught and retry with the field cleared, but send nothing.
		if strings.TrimSpace(req.Website) != "" {
			log.Printf("contact: honeypot triggered from %s", clientIP(r))
			writeJSON(w, http.StatusOK, contactResponse{OK: true})
			return
		}

		if errs := validateContact(req); len(errs) > 0 {
			writeJSON(w, http.StatusBadRequest, contactResponse{Errors: errs})
			return
		}

		if err := sendEmail(cfg, req); err != nil {
			log.Printf("sendEmail: %v", err)
			writeJSON(w, http.StatusInternalServerError, contactResponse{Errors: map[string]string{"_": "failed to send message"}})
			return
		}

		writeJSON(w, http.StatusOK, contactResponse{OK: true})
	}
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}
