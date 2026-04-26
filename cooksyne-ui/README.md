# Cooksyne UI

The frontend for [Cooksyne](https://github.com/Jordan890/cooksyne) — a self-hosted recipe and grocery list manager with AI-powered food analysis.

## Quick Start (Full-stack Docker — Recommended)

This launches the frontend, backend, database, and auth with a single command — no build tools required.

```bash
mkdir cooksyne && cd cooksyne
curl -LO https://raw.githubusercontent.com/Jordan890/cooksyne/main/deploy/docker-compose.yml
curl -LO https://raw.githubusercontent.com/Jordan890/cooksyne/main/deploy/.env.example
cp .env.example .env    # edit .env with your values (optional)
docker compose up -d
```

Or use the setup script (generates secrets automatically):

```bash
curl -LO https://raw.githubusercontent.com/Jordan890/cooksyne/main/deploy/setup.sh
chmod +x setup.sh
./setup.sh
```

The frontend will be available at `http://localhost:3000` once services are up. If you prefer to run only the frontend locally for development, see the Local Development section below.

---

## Local Development

If you want to contribute or run the frontend from source:

### Prerequisites

- Node.js 22+
- The backend running locally or via Docker

### Development Server

```bash
npm ci
ng serve
```

Open `http://localhost:4200/`. The app reloads automatically on file changes.

### Building

```bash
ng build
```

Build artifacts are output to `dist/`.

### Running Unit Tests

```bash
ng test
```

Uses [Vitest](https://vitest.dev/) as the test runner.

### Running End-to-End Tests

```bash
ng e2e
```

### Building the Docker Image Locally

```bash
docker build -t ghcr.io/jordan890/cooksyne-ui:local .
```

Then set `COOKSYNE_VERSION=local` in the backend's `deploy/.env`.

### Code Scaffolding

```bash
ng generate component component-name
ng generate --help
```

## Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Backend repository & full Docker setup](https://github.com/Jordan890/cooksyne)

## Windows Users

All Docker commands (`docker compose pull`, `docker compose up -d`) work the same on Windows via Docker Desktop or WSL2. If building locally, run `npm ci && npm run build` from PowerShell or WSL — both work. The `setup.sh` script in the backend repo requires Bash; see the [backend README](https://github.com/Jordan890/cooksyne#windows-users) for alternatives.
