# Login Backend

Simple Express.js backend providing JWT (access + refresh) auth with HTTP-only cookies.

## Features

- Register, Login, Refresh, Logout, Me endpoints
- In-memory user store (replace with DB later)
- Password hashing (bcrypt)
- Input validation (zod)
- Access + Refresh tokens in httpOnly cookies

## Endpoints

- POST /auth/register { email, password }
- POST /auth/login { email, password }
- POST /auth/refresh (uses refresh_token cookie)
- GET /auth/me (requires auth)
- POST /auth/logout
- GET /health

## Quick Start

1. Copy .env.example to .env and set a strong JWT_SECRET.
2. Install deps: `npm install`
3. Run dev server: `npm run dev`
4. Run tests: `npm test`

## Replace User Store

Swap `src/modules/auth/user.store.js` with a DB implementation (e.g., Prisma, Mongoose). Ensure unique email constraint.

## Security Notes

- Set `secure: true` on cookies in production (HTTPS).
- Use a long random JWT secret.
- Consider rotating refresh tokens and storing a whitelist / version field.

## Documentation

For full endpoint details see `docs/API.md` and the OpenAPI spec in `docs/openapi.yaml`.

## License

MIT
