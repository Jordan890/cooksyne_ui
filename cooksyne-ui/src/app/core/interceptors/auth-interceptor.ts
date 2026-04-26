import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { AuthService } from '../auth/auth';

/**
 * Runtime-agnostic HTTP interceptor.
 *
 * Attaches the current access / session token (from whichever AuthService
 * implementation is active) to outgoing API requests.
 *
 * Uses lazy injection via `Injector` to break the circular dependency:
 *   OidcAuthService → OidcSecurityService → HttpClient → interceptor → AuthService
 * Non-API requests (like Keycloak discovery) bail out early before resolving AuthService.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only attach to your own API — bail early for everything else
  // (including OIDC discovery requests) to avoid the circular dependency.
  // Read runtime API URL from env.js (generated at container start). Fall
  // back to the local default when not present.
  const runtimeApi = (window as any).__env?.API_URL ?? 'http://localhost:8081';
  const API_URLS = [runtimeApi, 'http://localhost:9090'];
  const isApiRequest = API_URLS.some((url) => req.url.startsWith(url));

  if (!isApiRequest) {
    return next(req);
  }

  // Lazy-resolve AuthService so it isn't created during OidcSecurityService's
  // own HTTP calls (which would trigger the cycle).
  const injector = inject(Injector);
  const auth = injector.get(AuthService);

  // Wait for the token observable to emit so we don't fire a bare request
  // before the OIDC library has resolved the access token.
  return auth.getAccessToken$().pipe(
    take(1),
    switchMap(token => {
      if (!token) {
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    }),
  );
};
