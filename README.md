# Cooksyne UI

The frontend for [Cooksyne](https://github.com/Jordan890/cooksyne) — a self-hosted recipe and grocery list manager with AI-powered food analysis.

Built with Angular and secured with OIDC authentication (Keycloak, Auth0, Okta, or any OIDC provider).

## Self-Hosting (Docker)

The recommended way to run Cooksyne is with Docker Compose. The backend repository contains the full deployment stack including this UI.

**Quick start:**

```bash
# Clone the backend repo
git clone https://github.com/Jordan890/cooksyne.git
cd cooksyne/deploy
chmod +x setup.sh
./setup.sh
```

See the **[deployment guide](https://github.com/Jordan890/cooksyne/blob/main/deploy/README.md)** for full instructions including AI setup, auth configuration, reverse proxy options, and more.

---

## Local Development

To run the frontend from source for development or contribution.

### Prerequisites

- **Node.js 22+**
- The backend running locally or via Docker (see [backend README](https://github.com/Jordan890/cooksyne#local-development))

### Development Server

```bash
cd cooksyne-ui
npm ci
ng serve
```

Open `http://localhost:4200/`. The app reloads automatically on file changes.

### Environment Configuration

The frontend reads runtime configuration from `public/env.js`. For local development, the defaults point to `localhost`:

- **API URL**: `http://localhost:8081/api`
- **Auth Authority**: `http://localhost:8080/realms/cooksyne`
- **Auth Client ID**: `cooksyne-ui`

To change these, edit `src/environments/environment.development.ts` or `public/env.js`.

In Docker, these are set via environment variables (`API_URL`, `AUTH_AUTHORITY`, `AUTH_CLIENT_ID`) — see the [deployment guide](https://github.com/Jordan890/cooksyne/blob/main/deploy/README.md).

### Building

```bash
ng build
```

Build artifacts are output to `dist/`.

### Running Tests

```bash
ng test
```

Uses [Vitest](https://vitest.dev/) as the test runner.

### Building the Docker Image Locally

```bash
cd cooksyne-ui
docker build -t ghcr.io/jordan890/cooksyne-ui:local .
```

Then set `COOKSYNE_VERSION=local` in the backend's `deploy/.env`.

### Code Scaffolding

```bash
ng generate component component-name
ng generate --help
```

---

## Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Backend repository & deployment guide](https://github.com/Jordan890/cooksyne)

## Windows Users

All Docker commands work on Windows via Docker Desktop or WSL2. For local development, `npm ci && ng serve` works from either PowerShell or WSL. The `setup.sh` script in the backend repo requires Bash — see the [backend README](https://github.com/Jordan890/cooksyne#windows-users) for alternatives.
