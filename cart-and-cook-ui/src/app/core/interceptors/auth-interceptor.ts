import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
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
  const API_URLS = ['http://localhost:8081', 'http://localhost:9090'];
  const isApiRequest = API_URLS.some((url) => req.url.startsWith(url));

  if (!isApiRequest) {
    return next(req);
  }

  // Lazy-resolve AuthService so it isn't created during OidcSecurityService's
  // own HTTP calls (which would trigger the cycle).
  const injector = inject(Injector);
  const auth = injector.get(AuthService);
  const token = auth.accessToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
