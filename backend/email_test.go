package main

import (
	"encoding/base64"
	"strings"
	"testing"
	"unicode/utf8"
)

func testCfg() Config {
	return Config{
		SMTPHost: "smtp.example.com",
		SMTPPort: "587",
		SMTPUser: "bot@example.com",
		SMTPPass: "secret",
		ToEmail:  "owner@example.com",
	}
}

// headerBlock returns everything before the first blank line — the region where
// an injected header would have to land to be interpreted as one.
func headerBlock(message string) string {
	if i := strings.Index(message, "\r\n\r\n"); i >= 0 {
		return message[:i]
	}
	return message
}

// TestBuildMessage_HeaderInjectionAttempts is the direct answer to the CodeQL
// "email content injection" alert: hostile input must never introduce a new
// header, recipient, or MIME part.
func TestBuildMessage_HeaderInjectionAttempts(t *testing.T) {
	attacks := []struct {
		name  string
		input ContactRequest
	}{
		{"CRLF in name", ContactRequest{
			Name:    "Bob\r\nBcc: victim@evil.com",
			Email:   "bob@example.com",
			Message: "hello there",
		}},
		{"bare LF in name", ContactRequest{
			Name:    "Bob\nBcc: victim@evil.com",
			Email:   "bob@example.com",
			Message: "hello there",
		}},
		{"CRLF in email", ContactRequest{
			Name:    "Bob",
			Email:   "bob@example.com\r\nBcc: victim@evil.com",
			Message: "hello there",
		}},
		{"CRLF and fake headers in body", ContactRequest{
			Name:    "Bob",
			Email:   "bob@example.com",
			Message: "hi\r\nBcc: victim@evil.com\r\nSubject: spoofed",
		}},
		{"MIME boundary forgery in body", ContactRequest{
			Name:    "Bob",
			Email:   "bob@example.com",
			Message: "--" + mimeBoundary + "\r\nContent-Type: text/html\r\n\r\n<b>spoof</b>",
		}},
		{"boundary forgery in name", ContactRequest{
			Name:    "--" + mimeBoundary,
			Email:   "bob@example.com",
			Message: "hello there",
		}},
	}

	for _, tc := range attacks {
		t.Run(tc.name, func(t *testing.T) {
			message, err := buildMessage(testCfg(), tc.input)
			if err != nil {
				// Failing closed is an acceptable outcome; nothing got sent.
				return
			}

			// Injection only succeeds if attacker text lands at the START of a
			// line: that is the only position a parser reads as a header or a
			// MIME delimiter. Hostile text appearing mid-line inside a Subject
			// or a quoted display name is inert.
			hdrLines := strings.Split(headerBlock(message), "\r\n")

			for _, line := range hdrLines {
				lower := strings.ToLower(line)
				for _, forbidden := range []string{"bcc:", "cc:", "x-", "content-transfer-encoding:"} {
					if strings.HasPrefix(lower, forbidden) {
						t.Errorf("injected header at line start: %q", line)
					}
				}
			}

			// Exactly one of each legitimate header, matched at line start so
			// "Reply-To:" is not mistaken for "To:".
			counts := map[string]int{}
			for _, line := range hdrLines {
				for _, h := range []string{"Subject:", "From:", "To:", "Reply-To:", "MIME-Version:", "Content-Type:"} {
					if strings.HasPrefix(line, h) {
						counts[h]++
					}
				}
			}
			for _, h := range []string{"Subject:", "From:", "To:", "Reply-To:", "MIME-Version:", "Content-Type:"} {
				if counts[h] != 1 {
					t.Errorf("expected exactly 1 %q header, got %d", h, counts[h])
				}
			}

			// No attacker-controlled address may appear as an actual recipient.
			for _, line := range hdrLines {
				if strings.HasPrefix(line, "To:") || strings.HasPrefix(line, "Bcc:") || strings.HasPrefix(line, "Cc:") {
					if strings.Contains(line, "victim@evil.com") {
						t.Errorf("attacker address became a recipient: %q", line)
					}
				}
			}

			// MIME structure intact: boundary markers only ever at line start —
			// 2 part delimiters plus 1 terminator.
			delims := 0
			for _, line := range strings.Split(message, "\r\n") {
				if strings.HasPrefix(line, "--"+mimeBoundary) {
					delims++
				}
			}
			if delims != 3 {
				t.Errorf("expected 3 line-start boundary markers, got %d — MIME structure altered", delims)
			}
		})
	}
}

// TestBuildMessage_BodiesAreBase64 documents the structural defence: because
// both parts are base64, body bytes can never be read as headers or boundaries.
func TestBuildMessage_BodiesAreBase64(t *testing.T) {
	message, err := buildMessage(testCfg(), ContactRequest{
		Name:    "Bob",
		Email:   "bob@example.com",
		Message: "Bcc: victim@evil.com\r\n--" + mimeBoundary,
	})
	if err != nil {
		t.Fatalf("buildMessage: %v", err)
	}

	parts := strings.Split(message, "--"+mimeBoundary)
	if len(parts) < 3 {
		t.Fatalf("expected at least 3 segments, got %d", len(parts))
	}

	for i, part := range parts[1:3] {
		idx := strings.Index(part, "\r\n\r\n")
		if idx < 0 {
			t.Fatalf("part %d has no body", i)
		}
		body := strings.TrimSpace(part[idx+4:])
		if body == "" {
			t.Fatalf("part %d body is empty", i)
		}
		for _, line := range strings.Split(body, "\r\n") {
			if line == "" {
				continue
			}
			if _, err := base64.StdEncoding.DecodeString(line); err != nil {
				t.Errorf("part %d line is not valid base64 (%q): %v", i, line, err)
			}
			if len(line) > base64LineWidth {
				t.Errorf("part %d line exceeds RFC 2045 width: %d chars", i, len(line))
			}
		}
	}
}

// TestSanitizeHeaderDisplayText_PreservesUnicode guards the regression this
// change fixed: the old ASCII-only filter silently erased non-Latin names.
func TestSanitizeHeaderDisplayText_PreservesUnicode(t *testing.T) {
	cases := []struct{ in, want string }{
		{"Владислав Новицький", "Владислав Новицький"},
		{"José Álvarez", "José Álvarez"},
		{"日本語の名前", "日本語の名前"},
		{"  Bob  ", "Bob"},
		// Line breaks vanish; the remaining text is harmless once it is a single line.
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
	cyrillic := strings.Repeat("щ", 200) // 2 bytes per rune

	name := sanitizeHeaderDisplayText(cyrillic, 120)
	if !utf8.ValidString(name) {
		t.Error("sanitizeHeaderDisplayText produced invalid UTF-8")
	}
	if n := utf8.RuneCountInString(name); n != 120 {
		t.Errorf("expected 120 runes, got %d", n)
	}

	body := sanitizeEmailBodyText(strings.Repeat("щ", 9000), 8000)
	if !utf8.ValidString(body) {
		t.Error("sanitizeEmailBodyText produced invalid UTF-8")
	}
	if n := utf8.RuneCountInString(body); n != 8000 {
		t.Errorf("expected 8000 runes, got %d", n)
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

	hdrs := headerBlock(message)
	for _, r := range hdrs {
		if r > 127 {
			t.Fatalf("non-ASCII rune %q reached the header block raw", r)
		}
	}
	if !strings.Contains(hdrs, "=?utf-8?q?") && !strings.Contains(hdrs, "=?UTF-8?q?") {
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
