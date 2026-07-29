package main

import (
	"encoding/base64"
	"strings"
	"testing"
	"unicode/utf8"
)

const attackerAddr = "victim@evil.com"

// requiredHeaders must each appear exactly once, matched at line start so
// "Reply-To:" is never mistaken for "To:".
var requiredHeaders = []string{
	"Subject:", "From:", "To:", "Reply-To:", "MIME-Version:", "Content-Type:",
}

// forbiddenHeaderPrefixes are headers an attacker would try to smuggle in.
var forbiddenHeaderPrefixes = []string{
	"bcc:", "cc:", "x-", "content-transfer-encoding:",
}

func testCfg() Config {
	return Config{
		SMTPHost: "smtp.example.com",
		SMTPPort: "587",
		SMTPUser: "bot@example.com",
		SMTPPass: "secret",
		ToEmail:  "owner@example.com",
	}
}

// ── helpers ────────────────────────────────────────────────────────────────
//
// Injection only succeeds when attacker text lands at the START of a line:
// that is the only position a parser reads as a header or MIME delimiter.
// Hostile text mid-Subject, or inside a quoted display name, is inert. Every
// assertion below is therefore position-aware.

// headerLines returns the lines before the first blank line — the only region
// where an injected header could be interpreted as one.
func headerLines(message string) []string {
	block := message
	if i := strings.Index(message, "\r\n\r\n"); i >= 0 {
		block = message[:i]
	}
	return strings.Split(block, "\r\n")
}

func assertNoForbiddenHeaders(t *testing.T, lines []string) {
	t.Helper()
	for _, line := range lines {
		lower := strings.ToLower(line)
		for _, prefix := range forbiddenHeaderPrefixes {
			if strings.HasPrefix(lower, prefix) {
				t.Errorf("injected header at line start: %q", line)
			}
		}
	}
}

func assertHeaderAppearsOnce(t *testing.T, lines []string) {
	t.Helper()
	counts := map[string]int{}
	for _, line := range lines {
		for _, h := range requiredHeaders {
			if strings.HasPrefix(line, h) {
				counts[h]++
			}
		}
	}
	for _, h := range requiredHeaders {
		if counts[h] != 1 {
			t.Errorf("expected exactly 1 %q header, got %d", h, counts[h])
		}
	}
}

func assertNotARecipient(t *testing.T, lines []string, addr string) {
	t.Helper()
	for _, line := range lines {
		isRecipient := strings.HasPrefix(line, "To:") ||
			strings.HasPrefix(line, "Cc:") ||
			strings.HasPrefix(line, "Bcc:")
		if isRecipient && strings.Contains(line, addr) {
			t.Errorf("attacker address became a recipient: %q", line)
		}
	}
}

// boundaryDelimiters counts line-start boundary markers. A valid
// multipart/alternative message has 2 part delimiters plus 1 terminator.
func boundaryDelimiters(message string) int {
	n := 0
	for _, line := range strings.Split(message, "\r\n") {
		if strings.HasPrefix(line, "--"+mimeBoundary) {
			n++
		}
	}
	return n
}

// partBody returns the body of one MIME part (everything after its headers).
func partBody(part string) string {
	i := strings.Index(part, "\r\n\r\n")
	if i < 0 {
		return ""
	}
	return strings.TrimSpace(part[i+4:])
}

func assertBase64Body(t *testing.T, label, body string) {
	t.Helper()
	if body == "" {
		t.Errorf("%s: body is empty", label)
		return
	}
	for _, line := range strings.Split(body, "\r\n") {
		if line == "" {
			continue
		}
		if _, err := base64.StdEncoding.DecodeString(line); err != nil {
			t.Errorf("%s: line is not valid base64 (%q): %v", label, line, err)
		}
		if len(line) > base64LineWidth {
			t.Errorf("%s: line exceeds RFC 2045 width: %d chars", label, len(line))
		}
	}
}

// ── tests ──────────────────────────────────────────────────────────────────

// The direct answer to the CodeQL "email content injection" alert: hostile
// input must never introduce a header, recipient, or MIME part.
func TestBuildMessage_HeaderInjectionAttempts(t *testing.T) {
	cases := []struct {
		name  string
		input ContactRequest
	}{
		{"CRLF in name", ContactRequest{
			Name: "Bob\r\nBcc: " + attackerAddr, Email: "bob@example.com", Message: "hello there",
		}},
		{"bare LF in name", ContactRequest{
			Name: "Bob\nBcc: " + attackerAddr, Email: "bob@example.com", Message: "hello there",
		}},
		{"CRLF in email", ContactRequest{
			Name: "Bob", Email: "bob@example.com\r\nBcc: " + attackerAddr, Message: "hello there",
		}},
		{"fake headers in body", ContactRequest{
			Name: "Bob", Email: "bob@example.com", Message: "hi\r\nBcc: " + attackerAddr + "\r\nSubject: spoofed",
		}},
		{"boundary forgery in body", ContactRequest{
			Name: "Bob", Email: "bob@example.com",
			Message: "--" + mimeBoundary + "\r\nContent-Type: text/html\r\n\r\n<b>spoof</b>",
		}},
		{"boundary forgery in name", ContactRequest{
			Name: "--" + mimeBoundary, Email: "bob@example.com", Message: "hello there",
		}},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			message, err := buildMessage(testCfg(), tc.input)
			if err != nil {
				return // failing closed is acceptable: nothing was sent
			}

			lines := headerLines(message)
			assertNoForbiddenHeaders(t, lines)
			assertHeaderAppearsOnce(t, lines)
			assertNotARecipient(t, lines, attackerAddr)

			if got := boundaryDelimiters(message); got != 3 {
				t.Errorf("expected 3 boundary markers, got %d — MIME structure altered", got)
			}
		})
	}
}

// Documents the structural defence: because both parts are base64, body bytes
// can never be read as headers or boundaries.
func TestBuildMessage_BodiesAreBase64(t *testing.T) {
	message, err := buildMessage(testCfg(), ContactRequest{
		Name:    "Bob",
		Email:   "bob@example.com",
		Message: "Bcc: " + attackerAddr + "\r\n--" + mimeBoundary,
	})
	if err != nil {
		t.Fatalf("buildMessage: %v", err)
	}

	parts := strings.Split(message, "--"+mimeBoundary)
	if len(parts) < 3 {
		t.Fatalf("expected at least 3 segments, got %d", len(parts))
	}

	assertBase64Body(t, "text/plain part", partBody(parts[1]))
	assertBase64Body(t, "text/html part", partBody(parts[2]))
}

// Guards the regression this change fixed: the old ASCII-only filter silently
// erased non-Latin names.
func TestSanitizeHeaderDisplayText_PreservesUnicode(t *testing.T) {
	cases := []struct{ in, want string }{
		{"Владислав Новицький", "Владислав Новицький"},
		{"José Álvarez", "José Álvarez"},
		{"日本語の名前", "日本語の名前"},
		{"  Bob  ", "Bob"},
		// Line breaks vanish; what remains is inert on a single line.
		{"Bob\r\nBcc: x@y.com", "BobBcc: x@y.com"},
	}
	for _, tc := range cases {
		if got := sanitizeHeaderDisplayText(tc.in, 120); got != tc.want {
			t.Errorf("sanitizeHeaderDisplayText(%q) = %q, want %q", tc.in, got, tc.want)
		}
	}
}

func TestSanitizeHeaderDisplayText_StripsLineBreaksAndControls(t *testing.T) {
	got := sanitizeHeaderDisplayText("a\rb\nc\x00d\x1bе", 120)
	if strings.ContainsAny(got, "\r\n") {
		t.Errorf("line breaks survived: %q", got)
	}
	for _, r := range got {
		if r < 32 && r != '\t' {
			t.Errorf("control char survived: %q in %q", r, got)
		}
	}
}

// Truncation must never split a multi-byte character into invalid UTF-8.
func TestTruncationIsRuneSafe(t *testing.T) {
	cases := []struct {
		label string
		got   string
		want  int
	}{
		{"header display text", sanitizeHeaderDisplayText(strings.Repeat("щ", 200), 120), 120},
		{"body text", sanitizeEmailBodyText(strings.Repeat("щ", 9000), 8000), 8000},
	}
	for _, tc := range cases {
		if !utf8.ValidString(tc.got) {
			t.Errorf("%s: produced invalid UTF-8", tc.label)
		}
		if n := utf8.RuneCountInString(tc.got); n != tc.want {
			t.Errorf("%s: expected %d runes, got %d", tc.label, tc.want, n)
		}
	}
}

// A Unicode name must reach the wire as ASCII encoded words, never raw.
func TestBuildMessage_UnicodeNameIsEncoded(t *testing.T) {
	message, err := buildMessage(testCfg(), ContactRequest{
		Name:    "Владислав",
		Email:   "vlad@example.com",
		Message: "привіт, this is a test message",
	})
	if err != nil {
		t.Fatalf("buildMessage: %v", err)
	}

	hdrs := strings.Join(headerLines(message), "\r\n")
	for _, r := range hdrs {
		if r > 127 {
			t.Fatalf("non-ASCII rune %q reached the header block raw", r)
		}
	}
	if !strings.Contains(strings.ToLower(hdrs), "=?utf-8?q?") {
		t.Errorf("expected a Q-encoded word in headers, got:\n%s", hdrs)
	}
}

// An unparseable address must not produce a Reply-To value at all.
func TestBuildMessage_InvalidEmailYieldsNoReplyToAddress(t *testing.T) {
	message, err := buildMessage(testCfg(), ContactRequest{
		Name:    "Bob",
		Email:   "not-an-address",
		Message: "hello there",
	})
	if err != nil {
		t.Fatalf("buildMessage: %v", err)
	}
	if strings.Contains(message, "not-an-address") {
		t.Error("unparseable address leaked into the message")
	}
}
