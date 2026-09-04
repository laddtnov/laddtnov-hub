package main

import (
	"net/http"
	"testing"
	"time"
)

func TestRateLimiterBlocksRepeatWithinInterval(t *testing.T) {
	rl := newRateLimiter(30 * time.Second)
	now := time.Now()

	if !rl.allow("1.2.3.4", now) {
		t.Fatal("first submission should be allowed")
	}
	if rl.allow("1.2.3.4", now.Add(29*time.Second)) {
		t.Error("second submission inside the interval should be blocked")
	}
	if !rl.allow("1.2.3.4", now.Add(31*time.Second)) {
		t.Error("submission after the interval should be allowed again")
	}
}

func TestRateLimiterIsPerIP(t *testing.T) {
	rl := newRateLimiter(30 * time.Second)
	now := time.Now()

	rl.allow("1.2.3.4", now)
	if !rl.allow("5.6.7.8", now) {
		t.Error("a different IP must not be blocked by another IP's submission")
	}
}

// The map must not grow without bound when many distinct IPs submit once each.
func TestRateLimiterEvictsExpiredEntries(t *testing.T) {
	rl := newRateLimiter(time.Second)
	start := time.Now()

	for i := 0; i < 500; i++ {
		rl.allow(string(rune(i)), start)
	}
	if got := len(rl.seen); got != 500 {
		t.Fatalf("expected 500 tracked IPs, got %d", got)
	}

	rl.allow("later", start.Add(2*time.Second))
	if got := len(rl.seen); got != 1 {
		t.Errorf("expired entries should be swept; expected 1 remaining, got %d", got)
	}
}

func TestClientIPPrefersFlyHeaderAndIgnoresForwardedFor(t *testing.T) {
	r, _ := http.NewRequest(http.MethodPost, "/api/contact", nil)
	r.RemoteAddr = "10.0.0.1:54321"
	r.Header.Set("X-Forwarded-For", "9.9.9.9")

	// X-Forwarded-For is caller-controlled: trusting it would let anyone
	// bypass the limit by varying the header.
	if got := clientIP(r); got != "10.0.0.1" {
		t.Errorf("expected RemoteAddr host when no Fly header, got %q", got)
	}

	r.Header.Set("Fly-Client-IP", "203.0.113.7")
	if got := clientIP(r); got != "203.0.113.7" {
		t.Errorf("expected the Fly header to win, got %q", got)
	}
}
