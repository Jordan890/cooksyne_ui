import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth';
import { AUTH_RUNTIME } from '../auth/auth-runtime';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const runtime = inject(AUTH_RUNTIME);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Desktop runtime → send to the built-in login page.
  // OIDC runtime   → send to home (the login button triggers the redirect).
  return router.createUrlTree([runtime === 'desktop' ? '/login' : '/']);
};