import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oidc = inject(OidcSecurityService);

  const token = oidc.getAccessToken();
  const API_URL = 'http://localhost:8081';

  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

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
