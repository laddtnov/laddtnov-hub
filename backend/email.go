package main

import (
	"encoding/base64"
	"fmt"
	"net/smtp"
	"strings"
)

const base64LineWidth = 76

// sendEmail relays a contact-form submission to cfg.ToEmail via SMTP.
// smtp.SendMail negotiates STARTTLS automatically when the server
// advertises it (true for Gmail, Proton Mail Bridge, SendGrid, etc. on
// port 587), so no manual TLS setup is needed here.
func sendEmail(cfg Config, msg ContactRequest) error {
	auth := smtp.PlainAuth("", cfg.SMTPUser, cfg.SMTPPass, cfg.SMTPHost)

	// The body is base64-encoded so that nothing in msg.Message can be
	// interpreted as SMTP control sequences (e.g. a line consisting of
	// just "." would otherwise end the DATA command early).
	plainBody := fmt.Sprintf("Name: %s\r\nEmail: %s\r\n\r\n%s\r\n", msg.Name, msg.Email, msg.Message)
	encodedBody := wrapBase64(base64.StdEncoding.EncodeToString([]byte(plainBody)))

	headers := fmt.Sprintf(
		"Subject: New portfolio contact from %s\r\n"+
			"From: %s\r\n"+
			"To: %s\r\n"+
			"Reply-To: %s\r\n"+
			"Content-Type: text/plain; charset=UTF-8\r\n"+
			"Content-Transfer-Encoding: base64\r\n"+
			"\r\n",
		msg.Name, cfg.SMTPUser, cfg.ToEmail, msg.Email,
	)

	to := []string{cfg.ToEmail}
	addr := fmt.Sprintf("%s:%s", cfg.SMTPHost, cfg.SMTPPort)
	return smtp.SendMail(addr, auth, cfg.SMTPUser, to, []byte(headers+encodedBody+"\r\n"))
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
