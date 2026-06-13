# Contact API (Go)

A small Go HTTP service that replaces Formspree for the portfolio's contact
form. One endpoint, JSON in, JSON out — kept strictly separate from the
frontend per the project's architecture rules.

## Endpoints

- `POST /api/contact` — body `{"name": "...", "email": "...", "message": "..."}`
  - `200 {"ok": true}` on success
  - `400 {"ok": false, "errors": {"field": "message"}}` on validation failure
  - `500 {"ok": false, "errors": {"_": "failed to send message"}}` if email sending fails
- `GET /healthz` — returns `ok`, for uptime checks

## Running locally

```bash
cd backend
cp .env.example .env   # fill in real SMTP credentials
export $(cat .env | xargs)
go run .
```

## Status

This is the **experiment** stage: the live site still uses Formspree.
`js/contact.js` (or equivalent) on the frontend will be pointed at this
API's `/api/contact` URL only after it's deployed and verified working.
