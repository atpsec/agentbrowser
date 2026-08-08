# Google Sign-In v1

## Goal
Provide real Google authentication without storing Google passwords or trusting browser-decoded identity claims.

## Runtime
- `/login/` renders the official Google Identity Services button.
- `/api/auth/config` exposes only the public Web Client ID when auth is fully configured and issues a CSRF cookie/value pair.
- `/api/auth/google` accepts the GIS ID token, requires same-origin + double-submit CSRF, verifies the Google RS256 signature against Google JWKs, and validates `iss`, `aud`, `exp`, `iat`, `sub`, and `email_verified`.
- A successful login creates a 7-day signed `__Host-aip_session` cookie with `Secure`, `HttpOnly`, `SameSite=Lax`, and `Path=/`.
- `/api/auth/session` returns the minimal signed-in profile.
- `/api/auth/logout` requires CSRF and clears the session cookie.
- No Google access token, refresh token, password, or client secret is stored in the browser.

## Required Cloudflare configuration
Set these in the Worker environment; do not commit values:

- `GOOGLE_CLIENT_ID` — Google OAuth 2.0 **Web application** client ID. This value is public but kept in environment configuration so deployments remain portable.
- `SESSION_SECRET` — high-entropy server-only signing secret. Store as a Cloudflare Worker secret. Use at least 32 random bytes.

If either is missing, `/api/auth/config` returns `googleEnabled:false` and the UI fails closed.

## Google Cloud Console
For the Web application OAuth client, add the production JavaScript origin:

- `https://agentbrowser.tpberg3tp.workers.dev`

Add local development origins only when needed. This implementation uses the GIS JavaScript callback flow and does not require a Google OAuth client secret in browser code.

## Security boundaries
- Google CSP permissions exist only on `/login/*`; the rest of the site keeps its stricter CSP.
- Session cookie is signed server-side and is not readable by JavaScript.
- CSRF cookie is intentionally JavaScript-readable and is matched to the `X-CSRF-Token` header plus same-origin `Origin` validation.
- Google JWK responses are cached for 30 minutes; unknown key IDs fail closed.
- No database is required for v1. Account persistence/roles/paid entitlements still require a durable server-side store.

## Rollback
Revert the Google auth PR. Static assets continue to work independently because the Worker only runs first for `/api/auth/*`.
