package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

// ContactRequest mirrors the fields sent by the contact form in index.html
// (Name / Email / Message). JSON is the only format exchanged with the
// frontend, per the project's frontend/backend separation rule.
type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type contactResponse struct {
	OK     bool              `json:"ok"`
	Errors map[string]string `json:"errors,omitempty"`
}

const maxBodyBytes = 1 << 16 // 64KB — plenty for a contact form, blocks oversized payloads

func handleContact(cfg Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
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
