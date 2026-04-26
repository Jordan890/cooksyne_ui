#!/bin/sh
set -e

# Generate /usr/share/nginx/html/env.js from environment variables.
# This runs at container startup so the Angular SPA picks up Docker env vars.

API_URL="${API_URL:-http://localhost:8081}"
AUTH_AUTHORITY="${AUTH_AUTHORITY:-http://localhost:8080/realms/cooksyne}"
AUTH_CLIENT_ID="${AUTH_CLIENT_ID:-cooksyne-ui}"
AUTH_RUNTIME="${AUTH_RUNTIME:-oidc}"

cat > /usr/share/nginx/html/env.js <<EOF
window.__env = {
  API_URL: "${API_URL}",
  AUTH_AUTHORITY: "${AUTH_AUTHORITY}",
  AUTH_CLIENT_ID: "${AUTH_CLIENT_ID}",
  AUTH_RUNTIME: "${AUTH_RUNTIME}"
};
EOF

echo "env.js generated: API_URL=${API_URL}, AUTH_AUTHORITY=${AUTH_AUTHORITY}"
