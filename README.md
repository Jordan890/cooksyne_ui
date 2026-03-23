# Cart and Cook UI

Comprehensive guide for setting up, running, and understanding default behavior of the Angular frontend.

## What This Repository Contains

This repository contains the frontend application used by Cart and Cook.

- Workspace root: this folder
- Angular app root: `cart-and-cook-ui/`
- Main source directory: `cart-and-cook-ui/src/`

Most day-to-day frontend work is done inside `cart-and-cook-ui/`.

## Tech Stack

- Angular 21 (standalone APIs)
- Angular Material
- RxJS
- `angular-auth-oidc-client` for OIDC login flow
- TypeScript 5.9
- Vitest for test execution through Angular CLI

## Prerequisites

Install these before starting:

1. Node.js 22 LTS (recommended)
2. npm (project currently uses npm and declares `npm@11.10.1`)
3. Running backend API from the companion backend repository (default `http://localhost:8081`)
4. Keycloak (or another OIDC provider compatible with the configured issuer) when using OIDC mode

## Recommended Startup Sequence

Use this order to avoid common startup/auth issues.

1. In the backend repository, start PostgreSQL.
2. Start Keycloak and verify issuer URI is available (`http://localhost:8080/realms/cart_and_cook` by default).
3. In the backend terminal, export startup environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `OAUTH2_ISSUER_URI`, `PORT`, `CONFIG_ENCRYPTION_KEY`).
4. Start backend runtime and wait until it is listening on `http://localhost:8081`.
5. In this UI repository, install dependencies and start the frontend (`npm install` then `npm start`).
6. Open `http://localhost:4200` and complete OIDC login.
7. After login, use `/settings/runtime` for AI provider configuration only.

## Quick Start

1. Open a terminal in this repository.
2. Move to the Angular app folder:

```bash
cd cart-and-cook-ui
```

3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm start
```

5. Open the app:

- `http://localhost:4200`

## Default Runtime Configuration (Frontend)

By default, this app uses the development environment file and expects a self-hosted backend with OIDC.

- Frontend URL: `http://localhost:4200`
- API base URL: `http://localhost:8081`
- Auth runtime (development): `oidc`
- OIDC authority default: `http://localhost:8080/realms/cart_and_cook`
- OIDC client ID default: `cart-and-cook-ui`
- OIDC response type: `code`
- Token renew: enabled with refresh token support

### Environment Files

- `cart-and-cook-ui/src/environments/environment.development.ts`
  - `production: false`
  - `authRuntime: 'oidc'`
  - `apiUrl: 'http://localhost:8081'`
- `cart-and-cook-ui/src/environments/environment.ts`
  - `production: true`
  - `authRuntime: 'desktop'`
  - `apiUrl: 'http://localhost:9090'`

## Authentication Modes and Behavior

The app supports two auth runtimes.

1. `oidc` mode
2. `desktop` mode

### OIDC Mode (Default During Local Web Development)

- Used for self-hosted/cloud-style login.
- Clicking login initiates an OIDC redirect.
- Angular does not render a username/password form for OIDC.
- Access token is acquired through the OIDC client and attached by interceptor to API calls.

### Desktop Mode

- Intended for local desktop/offline-style flow.
- Uses built-in login page and posts credentials to `http://localhost:9090/auth/login`.
- Session token/user are stored in localStorage keys:
  - `cc_desktop_token`
  - `cc_desktop_user`

## Routing and Access Defaults

Public routes:

- `/`
- `/login`

Protected routes (require authentication guard):

- `/recipes`
- `/recipes/new`
- `/recipes/:id/edit`
- `/grocery-lists`
- `/grocery-lists/new`
- `/grocery-lists/:id/edit`
- `/settings/runtime`

Guard behavior by runtime:

- `desktop`: unauthenticated users are redirected to `/login`
- `oidc`: unauthenticated users are redirected to `/` (where login trigger performs OIDC redirect)

## Runtime Settings UI Behavior

The settings page (`/settings/runtime`) is tightly coupled to backend runtime config APIs.

Default behavior:

1. Loads config from `GET /config/runtime`
2. Allows AI provider and AI model/key edits
3. Save call: `PUT /config/runtime`

Important:

- Core runtime settings are no longer editable in UI.
- DB URL/credentials, OAuth issuer, and server port must be set as startup environment variables for the backend process.

## Running Tests and Builds

From `cart-and-cook-ui/`:

- Start dev server: `npm start`
- Build: `npm run build`
- Watch build: `npm run watch`
- Unit tests: `npm test`

## Local Integration Setup (UI + Backend + Keycloak)

1. Start backend service at `http://localhost:8081`.
2. Start Keycloak with realm issuer matching:
   - `http://localhost:8080/realms/cart_and_cook`
3. Configure OIDC client `cart-and-cook-ui` with redirect URI:
   - `http://localhost:4200/*`
4. Start UI (`npm start`) and login through OIDC.

## Troubleshooting

### 401 from API

- Verify user is logged in.
- Verify frontend is in `oidc` mode when calling backend on `8081`.
- Confirm issuer URL and realm in OIDC config match the token issuer.

### CORS Errors

- Backend allows origins `http://localhost:4200` and `http://localhost:9090`.
- Make sure UI runs from one of those origins unless backend CORS is changed.

### Login Redirect Loop

- Confirm Keycloak client ID: `cart-and-cook-ui`.
- Confirm redirect URI includes `http://localhost:4200/*`.
- Confirm backend `OAUTH2_ISSUER_URI` matches actual Keycloak issuer.

### Core Runtime Changes Not In UI

- This is expected behavior.
- Core runtime values are configured when backend starts (environment variables), not from the frontend settings page.

## Development Notes

- API interceptor attaches bearer tokens only for requests to:
  - `http://localhost:8081`
  - `http://localhost:9090`
- Static/public paths may be visible without auth, but feature pages are guarded by route auth checks.

## Repository Workflow Recommendation

For contributors:

1. Keep frontend and backend running in separate terminals.
2. Use the runtime settings page for backend AI adjustments during development.
3. Re-test auth flow any time issuer/client settings are changed.
