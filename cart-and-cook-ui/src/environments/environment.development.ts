import type { AuthRuntime } from '../app/core/auth/auth-runtime';

export const environment = {
  production: false,
  authRuntime: 'oidc' as AuthRuntime,
  apiUrl: 'http://localhost:8081',
};
