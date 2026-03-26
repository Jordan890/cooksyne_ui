import type { AuthRuntime } from '../app/core/auth/auth-runtime';

const _env: Record<string, string> = (window as any).__env || {};

export const environment = {
  production: true,
  authRuntime: (_env['AUTH_RUNTIME'] || 'oidc') as AuthRuntime,
  apiUrl: _env['API_URL'] || 'http://localhost:8081',
};
