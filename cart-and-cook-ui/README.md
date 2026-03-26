# Cart and Cook UI

The frontend for [Cart & Cook](https://github.com/Jordan890/cart_and_cook) — a self-hosted recipe and grocery list manager with AI-powered food analysis.

## Quick Start (Docker — Recommended)

The easiest way to run Cart & Cook (frontend + backend + database + auth) is via Docker. **No Node.js or build tools required.**

Follow the [Quick Start in the backend README](https://github.com/Jordan890/cart_and_cook#quick-start-docker--recommended) — it launches everything including this UI.

The frontend will be available at `http://localhost:3000`.

---

## Local Development

If you want to contribute or run the frontend from source:

### Prerequisites

- Node.js 22+
- The [backend](https://github.com/Jordan890/cart_and_cook) running locally (or via Docker)

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

Angular CLI does not include an e2e framework by default — choose one that suits your needs.

### Building the Docker Image Locally

```bash
docker build -t ghcr.io/jordan890/cart-and-cook-ui:local .
```

Then set `CART_AND_COOK_VERSION=local` in the backend's `deploy/.env`.

### Code Scaffolding

```bash
ng generate component component-name
ng generate --help
```

## Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Backend repository & full Docker setup](https://github.com/Jordan890/cart_and_cook)

## Windows Users

All Docker commands (`docker compose pull`, `docker compose up -d`) work the same on Windows via Docker Desktop or WSL2. If building locally, run `npm ci && npm run build` from PowerShell or WSL — both work. The `setup.sh` script in the backend repo requires Bash; see the [backend README](https://github.com/Jordan890/cart_and_cook#windows-users) for alternatives.
