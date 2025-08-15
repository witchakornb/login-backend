# API Documentation

Base URL: `http://localhost:3000`

## Authentication Flow

1. Register or login with email & password.
2. Server sets `access_token` (short-lived) and `refresh_token` (longer) as httpOnly cookies.
3. Use `/auth/me` to fetch current user (cookie automatically sent by browser).
4. When access token expires, call `/auth/refresh` (browser sends refresh cookie) to receive fresh tokens.
5. Call `/auth/logout` to clear cookies.

## Endpoints

### GET /health

Check service status.

Response 200:

```json
{ "status": "ok", "time": "2025-01-01T00:00:00.000Z" }
```

### POST /auth/register

Register a new user and receive tokens.

Request Body:

```json
{ "email": "user@example.com", "password": "secret123" }
```

Responses:

- 201 Created

```json
{ "user": { "id": "<uuid>", "email": "user@example.com" } }
```

- 409 Email already registered

### POST /auth/login

Login and receive tokens.

Request Body same as register.

Responses:

- 200 OK (same shape as register)
- 401 Invalid credentials

### POST /auth/refresh

Issue new tokens using `refresh_token` cookie.

Responses:

- 200 OK (same user response)
- 401 Invalid / missing refresh token

### GET /auth/me

Return current authenticated user.

Headers/Cookies:

- Sends `access_token` cookie automatically (or Authorization: Bearer token)

Responses:

- 200 OK

```json
{ "user": { "id": "<uuid>", "email": "user@example.com" } }
```

- 401 Unauthorized

### POST /auth/logout

Clear cookies and end session.

Response 200:

```json
{ "message": "Logged out" }
```

## Cookies

| Name | Path | Purpose | Typical Max Age |
|------|------|---------|-----------------|
| access_token | / | Short-lived access JWT | 15m |
| refresh_token | /auth/refresh | Refresh JWT for new access tokens | 7d |

## Error Format

Validation errors:

```json
{ "message": "Validation failed", "errors": [ { "code": "too_small", "path": ["password"] } ] }
```

Generic error:

```json
{ "message": "Internal server error" }
```

## OpenAPI Spec

See `docs/openapi.yaml` for a machine-readable specification. You can import it into Postman, Insomnia, or Swagger UI.

## Security Notes

- Always use HTTPS in production and set `secure: true` & `sameSite` appropriately.
- Rotate JWT secret if compromised.
- Consider implementing refresh token rotation & revocation list.
