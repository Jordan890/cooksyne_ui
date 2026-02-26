import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log('User is authenticated, allowing access to route');
    return true;
  }

  // Redirect unauthenticated users
  return router.createUrlTree(['/']);
};