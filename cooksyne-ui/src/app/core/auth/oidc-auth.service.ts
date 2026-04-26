import { Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

/**
 * OIDC / Keycloak authentication service.
 *
 * Used in the **self-hosted / cloud** runtime.
 * The user never sees a login form in Angular — the browser redirects to the
 * identity provider's hosted login page and back.
 */
@Injectable()
export class OidcAuthService extends AuthService {
  readonly isLoading = signal(true);
  readonly isAuthenticated = signal(false);
  readonly user = signal<any | null>(null);
  readonly accessToken: Signal<string>;

  constructor(private oidc: OidcSecurityService) {
    super();

    this.accessToken = toSignal(this.oidc.getAccessToken(), {
      initialValue: '',
    });

    // Bootstrap: check whether the user already has a valid session / callback code.
    this.oidc.checkAuth().subscribe({
      next: ({ isAuthenticated, userData }) => {
        this.isAuthenticated.set(isAuthenticated);
        this.user.set(userData);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  login(): void {
    this.oidc.authorize();
  }

  logout(): void {
    this.oidc.logoff().subscribe();
  }

  getAccessToken$(): Observable<string> {
    return this.oidc.getAccessToken();
  }
}
