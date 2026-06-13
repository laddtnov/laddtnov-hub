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

Deployed to Fly.io at `https://laddtnov-hub-contact.fly.dev`. The frontend
(`js/contact.js`) posts to this API's `/api/contact` endpoint, replacing
Formspree.

## Deploying

```bash
fly deploy
```

Secrets (SMTP credentials) are set via `fly secrets set` and are not stored
in `fly.toml` or git.
