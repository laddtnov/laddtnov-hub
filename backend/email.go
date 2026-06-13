package main

import (
	"fmt"
	"net/smtp"
)

// sendEmail relays a contact-form submission to cfg.ToEmail via SMTP.
// smtp.SendMail negotiates STARTTLS automatically when the server
// advertises it (true for Gmail, Proton Mail Bridge, SendGrid, etc. on
// port 587), so no manual TLS setup is needed here.
func sendEmail(cfg Config, msg ContactRequest) error {
	auth := smtp.PlainAuth("", cfg.SMTPUser, cfg.SMTPPass, cfg.SMTPHost)

	to := []string{cfg.ToEmail}
	body := fmt.Sprintf(
		"Subject: New portfolio contact from %s\r\n"+
			"From: %s\r\n"+
			"To: %s\r\n"+
			"Reply-To: %s\r\n"+
			"Content-Type: text/plain; charset=UTF-8\r\n"+
			"\r\n"+
			"Name: %s\r\nEmail: %s\r\n\r\n%s\r\n",
		msg.Name, cfg.SMTPUser, cfg.ToEmail, msg.Email,
		msg.Name, msg.Email, msg.Message,
	)

	addr := fmt.Sprintf("%s:%s", cfg.SMTPHost, cfg.SMTPPort)
	return smtp.SendMail(addr, auth, cfg.SMTPUser, to, []byte(body))
}
