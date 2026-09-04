package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// post sends one contact submission and returns the recorder.
// cfg has no SMTP configured, so a submission that gets as far as sending
// fails at that point — which is exactly what lets these tests distinguish
// "rejected early" (400/429/200-honeypot) from "would have emailed" (500).
func post(t *testing.T, h http.HandlerFunc, body string, ip string) *httptest.ResponseRecorder {
	t.Helper()
	r := httptest.NewRequest(http.MethodPost, "/api/contact", strings.NewReader(body))
	r.Header.Set("Fly-Client-IP", ip)
	w := httptest.NewRecorder()
	h(w, r)
	return w
}

const validBody = `{"name":"Ada","email":"ada@example.com","message":"Hello, this is a long enough message."}`

func TestHoneypotIsAcceptedButNotSent(t *testing.T) {
	h := handleContact(Config{})
	body := `{"name":"Bot","email":"bot@example.com","message":"buy cheap things right now","website":"http://spam.example"}`

	w := post(t, h, body, "203.0.113.1")

	// 200 so the bot cannot detect the trap and retry with the field cleared.
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 for a honeypot hit, got %d", w.Code)
	}
	var resp contactResponse
	json.Unmarshal(w.Body.Bytes(), &resp)
	if !resp.OK {
		t.Error("honeypot response should look like success to the caller")
	}
	// A 500 here would mean it reached sendEmail with no SMTP configured.
	if w.Code == http.StatusInternalServerError {
		t.Error("honeypot submission must not reach sendEmail")
	}
}

func TestSecondSubmissionFromSameIPIsRateLimited(t *testing.T) {
	h := handleContact(Config{})

	first := post(t, h, validBody, "203.0.113.2")
	if first.Code == http.StatusTooManyRequests {
		t.Fatal("the first submission must not be rate limited")
	}

	second := post(t, h, validBody, "203.0.113.2")
	if second.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429 on the second submission, got %d", second.Code)
	}
	var resp contactResponse
	json.Unmarshal(second.Body.Bytes(), &resp)
	if resp.Errors["_"] == "" {
		t.Error("a rate-limited response should carry a message the form can show")
	}
}

func TestRateLimitDoesNotAffectOtherClients(t *testing.T) {
	h := handleContact(Config{})

	post(t, h, validBody, "203.0.113.3")
	other := post(t, h, validBody, "203.0.113.4")

	if other.Code == http.StatusTooManyRequests {
		t.Error("one client's submission must not rate limit a different client")
	}
}

func TestValidationErrorsAreReturnedPerField(t *testing.T) {
	h := handleContact(Config{})
	body := `{"name":"Ada","email":"not-an-email","message":"short"}`

	w := post(t, h, body, "203.0.113.5")

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", w.Code)
	}
	var resp contactResponse
	json.Unmarshal(w.Body.Bytes(), &resp)
	if resp.Errors["email"] == "" || resp.Errors["message"] == "" {
		t.Errorf("expected per-field errors for email and message, got %v", resp.Errors)
	}
}
