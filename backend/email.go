package main

import (
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"mime"
	"net/smtp"
	"strings"
	"unicode"
)

const base64LineWidth = 76

// sendEmail relays a contact-form submission to cfg.ToEmail via SMTP.
// It uses the low-level smtp.Client API (rather than smtp.SendMail) so the
// message is written via Data().Write, negotiating STARTTLS and AUTH only
// when the server advertises support for them.
func sendEmail(cfg Config, msg ContactRequest) error {
	safeName := sanitizeEmailHeaderText(msg.Name, 120)
	safeReplyTo := sanitizeEmailHeaderText(msg.Email, 254)
	safeMessage := sanitizeEmailBodyText(msg.Message, 8000)

	// The body is base64-encoded so that nothing in msg.Message can be
	// interpreted as SMTP control sequences (e.g. a line consisting of
	// just "." would otherwise end the DATA command early).
	plainBody := fmt.Sprintf("Name: %s\r\nEmail: %s\r\n\r\n%s\r\n", safeName, safeReplyTo, safeMessage)
	encodedBody := wrapBase64(base64.StdEncoding.EncodeToString([]byte(plainBody)))

	// RFC 2047 encoded-words restrict their content to a safe ASCII subset,
	// so the encoded values can't contain raw CRLF and can't be used for
	// header injection regardless of the original input.
	encodedName := mime.QEncoding.Encode("UTF-8", safeName)
	encodedReplyTo := mime.QEncoding.Encode("UTF-8", safeReplyTo)

	headers := fmt.Sprintf(
		"Subject: New portfolio contact from %s\r\n"+
			"From: %s\r\n"+
			"To: %s\r\n"+
			"Reply-To: %s\r\n"+
			"Content-Type: text/plain; charset=UTF-8\r\n"+
			"Content-Transfer-Encoding: base64\r\n"+
			"\r\n",
		encodedName, cfg.SMTPUser, cfg.ToEmail, encodedReplyTo,
	)
	message := []byte(headers + encodedBody + "\r\n")

	addr := fmt.Sprintf("%s:%s", cfg.SMTPHost, cfg.SMTPPort)
	client, err := smtp.Dial(addr)
	if err != nil {
		return fmt.Errorf("dial: %w", err)
	}
	defer client.Close()

	if ok, _ := client.Extension("STARTTLS"); ok {
		if err := client.StartTLS(&tls.Config{ServerName: cfg.SMTPHost}); err != nil {
			return fmt.Errorf("starttls: %w", err)
		}
	}

	if ok, _ := client.Extension("AUTH"); ok {
		auth := smtp.PlainAuth("", cfg.SMTPUser, cfg.SMTPPass, cfg.SMTPHost)
		if err := client.Auth(auth); err != nil {
			return fmt.Errorf("auth: %w", err)
		}
	}

	if err := client.Mail(cfg.SMTPUser); err != nil {
		return fmt.Errorf("mail: %w", err)
	}
	if err := client.Rcpt(cfg.ToEmail); err != nil {
		return fmt.Errorf("rcpt: %w", err)
	}

	wc, err := client.Data()
	if err != nil {
		return fmt.Errorf("data: %w", err)
	}
	if _, err := wc.Write(message); err != nil {
		return fmt.Errorf("write: %w", err)
	}
	if err := wc.Close(); err != nil {
		return fmt.Errorf("close: %w", err)
	}

	return client.Quit()
}

// sanitizeHeaderValue removes CR/LF and other control chars to prevent
// SMTP/MIME header injection.
func sanitizeHeaderValue(v string) string {
	return strings.Map(func(r rune) rune {
		if r == '\r' || r == '\n' || (unicode.IsControl(r) && r != '\t') {
			return -1
		}
		return r
	}, v)
}

// sanitizeEmailHeaderText sanitizes untrusted text for use in mail headers
// (e.g. Subject display text and Reply-To value) and bounds its length.
func sanitizeEmailHeaderText(v string, maxLen int) string {
	v = sanitizeHeaderValue(strings.TrimSpace(v))
	v = strings.Map(func(r rune) rune {
		if r < 32 || r > 126 {
			return -1
		}
		return r
	}, v)
	if maxLen > 0 && len(v) > maxLen {
		v = v[:maxLen]
	}
	return v
}

// sanitizeEmailBodyText sanitizes untrusted plain-text body content by
// normalizing line endings, removing unsafe control chars, and bounding size.
func sanitizeEmailBodyText(v string, maxLen int) string {
	v = strings.ReplaceAll(v, "\r\n", "\n")
	v = strings.ReplaceAll(v, "\r", "\n")
	v = strings.Map(func(r rune) rune {
		if r == '\n' || r == '\t' {
			return r
		}
		if unicode.IsControl(r) {
			return -1
		}
		return r
	}, v)
	if maxLen > 0 && len(v) > maxLen {
		v = v[:maxLen]
	}
	return v
}

// wrapBase64 splits a base64 string into RFC 2045 compliant lines (max 76
// chars) separated by \r\n.
func wrapBase64(s string) string {
	var b strings.Builder
	for i := 0; i < len(s); i += base64LineWidth {
		end := i + base64LineWidth
		if end > len(s) {
			end = len(s)
		}
		b.WriteString(s[i:end])
		b.WriteString("\r\n")
	}
	return b.String()
}
