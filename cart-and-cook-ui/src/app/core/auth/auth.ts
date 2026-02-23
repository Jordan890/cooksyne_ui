import { Injectable, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Reactive signals
  public isAuthenticated = signal(false);
  public user = signal<UserDataResult | null>(null);
  public accessToken!: Signal<string>;

  constructor(private oidc: OidcSecurityService) {

    this.accessToken = toSignal(this.oidc.getAccessToken(), {
      initialValue: '',
    });

    // Initialize
    this.oidc.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      this.isAuthenticated.set(isAuthenticated);
      this.user.set(userData);
    });
  }

  login() {
    this.oidc.authorize();
  }

  logout() {
    this.oidc.logoff().subscribe();
  }

  getAccessToken$() {
    return this.oidc.getAccessToken();
  }
}
