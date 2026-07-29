package main

import (
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"html"
	"mime"
	"net/mail"
	"net/smtp"
	"strings"
	"unicode"
)

const (
	base64LineWidth = 76
	mimeBoundary    = "laddtnov-portfolio-boundary-7qZ3xK"
)

func sendEmail(cfg Config, msg ContactRequest) error {
	message, err := buildMessage(cfg, msg)
	if err != nil {
		return err
	}
	return deliver(cfg, message)
}

// buildMessage assembles the full RFC 5322 message from an untrusted contact
// submission. It is the single place where user input reaches the wire format,
// which makes it the one function to audit for header/content injection:
//
//   - header values are stripped of CR/LF, then Q-encoded to ASCII
//   - the Reply-To address is whatever mail.ParseAddress validated, nothing else
//   - both bodies are base64-encoded, so no body content can introduce a header
//     or forge the MIME boundary
//   - a final check rejects the message outright if any header still holds a
//     line break
//
// It performs no I/O, so these guarantees are directly unit-testable.
func buildMessage(cfg Config, msg ContactRequest) (string, error) {
	// Display text keeps Unicode (names like "Владислав" or "José" must survive);
	// only CR/LF and control chars are removed, and the result is Q-encoded to
	// pure ASCII before it ever reaches a header.
	safeName := sanitizeHeaderDisplayText(msg.Name, 120)

	// Addresses stay strictly ASCII — mail.ParseAddress is the authority on
	// what is a valid addr-spec, and we only ever use its parsed .Address.
	rawReplyTo := sanitizeEmailHeaderText(msg.Email, 254)
	safeReplyTo := ""
	if addr, err := mail.ParseAddress(rawReplyTo); err == nil {
		safeReplyTo = addr.Address
	}

	safeMessage := sanitizeEmailBodyText(msg.Message, 8000)

	encodedName := mime.QEncoding.Encode("UTF-8", safeName)

	replyToHeader := ""
	if safeReplyTo != "" {
		replyToHeader = (&mail.Address{
			Name:    safeName, // mail.Address.String() applies its own encoding/quoting
			Address: safeReplyTo,
		}).String()
	}

	// Last-line assertion: every value interpolated into a header must be free
	// of line breaks. The sanitizers above already guarantee this, so a failure
	// here means a future refactor broke an invariant — fail closed rather than
	// emit a header-injected message.
	for name, value := range map[string]string{
		"Subject":  encodedName,
		"From":     cfg.SMTPUser,
		"To":       cfg.ToEmail,
		"Reply-To": replyToHeader,
	} {
		if strings.ContainsAny(value, "\r\n") {
			return "", fmt.Errorf("refusing to send: %s header contains a line break", name)
		}
	}

	plainBody := fmt.Sprintf("Name: %s\r\nEmail: %s\r\n\r\n%s\r\n", safeName, safeReplyTo, safeMessage)
	htmlBody := buildHTMLEmail(safeName, safeReplyTo, safeMessage)

	encodedPlain := wrapBase64(base64.StdEncoding.EncodeToString([]byte(plainBody)))
	encodedHTML := wrapBase64(base64.StdEncoding.EncodeToString([]byte(htmlBody)))

	message := fmt.Sprintf(
		"MIME-Version: 1.0\r\n"+
			"Subject: New portfolio contact from %s\r\n"+
			"From: %s\r\n"+
			"To: %s\r\n"+
			"Reply-To: %s\r\n"+
			"Content-Type: multipart/alternative; boundary=\"%s\"\r\n"+
			"\r\n"+
			"--%s\r\n"+
			"Content-Type: text/plain; charset=UTF-8\r\n"+
			"Content-Transfer-Encoding: base64\r\n"+
			"\r\n"+
			"%s\r\n"+
			"--%s\r\n"+
			"Content-Type: text/html; charset=UTF-8\r\n"+
			"Content-Transfer-Encoding: base64\r\n"+
			"\r\n"+
			"%s\r\n"+
			"--%s--\r\n",
		encodedName, cfg.SMTPUser, cfg.ToEmail, replyToHeader, mimeBoundary,
		mimeBoundary,
		encodedPlain,
		mimeBoundary,
		encodedHTML,
		mimeBoundary,
	)

	return message, nil
}

// deliver opens the SMTP session and writes an already-assembled message.
func deliver(cfg Config, message string) error {
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
	if _, err := wc.Write([]byte(message)); err != nil {
		return fmt.Errorf("write: %w", err)
	}
	if err := wc.Close(); err != nil {
		return fmt.Errorf("close: %w", err)
	}

	return client.Quit()
}

// buildHTMLEmail renders the cyberpunk-styled HTML email template.
// All user-supplied values must already be sanitized before passing in.
func buildHTMLEmail(name, email, message string) string {
	eName := html.EscapeString(name)
	eEmail := html.EscapeString(email)
	eMessage := strings.ReplaceAll(html.EscapeString(message), "\n", "<br>")
	mailto := "mailto:" + html.EscapeString(email)

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New Contact — laddtnov.dev</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Courier New',Courier,monospace;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#0a0a0f;">

  <!-- UA flag stripe top -->
  <tr>
    <td width="50%" height="5" style="background-color:#1a6fff;font-size:0;line-height:0;">&nbsp;</td>
    <td width="50%" height="5" style="background-color:#ffe135;font-size:0;line-height:0;">&nbsp;</td>
  </tr>

  <!-- Top spacer -->
  <tr><td colspan="2" height="36" style="font-size:0;">&nbsp;</td></tr>

  <!-- Card wrapper -->
  <tr>
    <td colspan="2" align="center" style="padding:0 16px;">
      <table width="560" cellpadding="0" cellspacing="0" border="0" role="presentation"
             style="max-width:560px;width:100%;background-color:#0d0d1a;border:1px solid #00ffff;border-radius:4px;">

        <!-- ── Header ── -->
        <tr>
          <td style="padding:24px 32px 20px 32px;border-bottom:1px solid #1a2a2a;">
            <p style="margin:0 0 6px 0;color:#00ffff;font-size:10px;letter-spacing:4px;
                      text-transform:uppercase;font-family:'Courier New',monospace;">
              [ LADDTNOV.DEV ]
            </p>
            <h1 style="margin:0;color:#ffffff;font-size:18px;letter-spacing:2px;
                       font-weight:700;font-family:'Courier New',monospace;">
              NEW CONTACT TRANSMISSION
            </h1>
          </td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="padding:28px 32px 24px 32px;">

            <!-- FROM -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
                   style="margin-bottom:14px;">
              <tr>
                <td style="padding:12px 16px;background-color:#0a0a0f;border-left:3px solid #00ffff;">
                  <p style="margin:0 0 4px 0;color:#00ffff;font-size:9px;letter-spacing:3px;
                            font-family:'Courier New',monospace;text-transform:uppercase;">FROM:</p>
                  <p style="margin:0;color:#ffffff;font-size:15px;
                            font-family:'Courier New',monospace;">` + eName + `</p>
                </td>
              </tr>
            </table>

            <!-- EMAIL -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
                   style="margin-bottom:14px;">
              <tr>
                <td style="padding:12px 16px;background-color:#0a0a0f;border-left:3px solid #2a3a4a;">
                  <p style="margin:0 0 4px 0;color:#00ffff;font-size:9px;letter-spacing:3px;
                            font-family:'Courier New',monospace;text-transform:uppercase;">EMAIL:</p>
                  <p style="margin:0;color:#8888aa;font-size:14px;
                            font-family:'Courier New',monospace;">` + eEmail + `</p>
                </td>
              </tr>
            </table>

            <!-- MESSAGE -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
                   style="margin-bottom:28px;">
              <tr>
                <td style="padding:16px;background-color:#0a0a0f;border-left:3px solid #2a3a4a;">
                  <p style="margin:0 0 8px 0;color:#00ffff;font-size:9px;letter-spacing:3px;
                            font-family:'Courier New',monospace;text-transform:uppercase;">MESSAGE:</p>
                  <p style="margin:0;color:#ccccdd;font-size:14px;line-height:1.7;
                            font-family:'Courier New',monospace;">` + eMessage + `</p>
                </td>
              </tr>
            </table>

            <!-- Reply button -->
            <table cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td align="center" style="background-color:#00ffff;border-radius:2px;">
                  <a href="` + mailto + `"
                     style="display:inline-block;padding:10px 28px;color:#0a0a0f;
                            font-size:11px;letter-spacing:3px;font-weight:700;
                            text-decoration:none;font-family:'Courier New',monospace;
                            text-transform:uppercase;">
                    [ REPLY ]
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="padding:14px 32px;border-top:1px solid #1a2a2a;">
            <p style="margin:0;color:#333355;font-size:9px;letter-spacing:2px;
                      font-family:'Courier New',monospace;text-transform:uppercase;">
              LADDTNOV.DEV &nbsp;&bull;&nbsp; PORTFOLIO CONTACT SYSTEM &nbsp;&bull;&nbsp; SECURE TRANSMISSION
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- Bottom spacer -->
  <tr><td colspan="2" height="36" style="font-size:0;">&nbsp;</td></tr>

  <!-- UA flag stripe bottom (reversed) -->
  <tr>
    <td width="50%" height="5" style="background-color:#ffe135;font-size:0;line-height:0;">&nbsp;</td>
    <td width="50%" height="5" style="background-color:#1a6fff;font-size:0;line-height:0;">&nbsp;</td>
  </tr>

</table>
</body>
</html>`
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

// sanitizeEmailHeaderText sanitizes untrusted text down to printable ASCII for
// use where a header value must not contain encoded words — notably email
// addresses, which are ASCII by specification. For human-readable display text
// use sanitizeHeaderDisplayText instead, so non-Latin names are not destroyed.
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

// sanitizeHeaderDisplayText sanitizes untrusted display text (a person's name)
// for use in headers while preserving Unicode. Header injection needs CR or LF,
// so stripping line breaks and control characters is what actually matters;
// callers MUST pass the result through mime.QEncoding (or mail.Address, which
// encodes internally), which renders it as pure ASCII encoded words.
//
// Length is bounded in runes rather than bytes so a multi-byte character can
// never be sliced in half into invalid UTF-8.
func sanitizeHeaderDisplayText(v string, maxRunes int) string {
	v = strings.Map(func(r rune) rune {
		if r == '\r' || r == '\n' {
			return -1
		}
		if unicode.IsControl(r) {
			return -1
		}
		return r
	}, strings.TrimSpace(v))

	if maxRunes > 0 {
		if rs := []rune(v); len(rs) > maxRunes {
			v = string(rs[:maxRunes])
		}
	}
	return v
}

// sanitizeEmailBodyText sanitizes untrusted plain-text body content by
// normalizing line endings, removing unsafe control chars, and bounding size.
// The body is base64-encoded before transmission, so it cannot introduce
// headers or MIME boundaries regardless of content.
//
// maxRunes bounds length in runes, not bytes, so a multi-byte character is
// never split into invalid UTF-8.
func sanitizeEmailBodyText(v string, maxRunes int) string {
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
	if maxRunes > 0 {
		if rs := []rune(v); len(rs) > maxRunes {
			v = string(rs[:maxRunes])
		}
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
