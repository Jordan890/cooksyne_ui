import { PassedInitialConfig } from 'angular-auth-oidc-client';

const _env: Record<string, string> = (window as any).__env || {};

export const authConfig: PassedInitialConfig = {
  config: {
              authority: _env['AUTH_AUTHORITY'] || 'http://localhost:8080/realms/cooksyne',
              redirectUrl: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: _env['AUTH_CLIENT_ID'] || 'cooksyne-ui',
              scope: 'openid profile email',
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }
}
