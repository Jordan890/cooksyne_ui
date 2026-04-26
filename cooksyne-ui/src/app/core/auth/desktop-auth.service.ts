import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth';

/** Shape returned by the local backend's `/auth/login` endpoint. */
export interface DesktopLoginResponse {
  token: string;
  user: {
    name: string;
    email?: string;
    [key: string]: unknown;
  };
}

/**
 * Offline / desktop authentication service.
 *
 * Used in the **desktop** runtime where a bundled local backend (SQLite)
 * handles credential verification.  The Angular frontend renders its own
 * login page and POSTs `{ username, password }` to the local backend.
 */
@Injectable()
export class DesktopAuthService extends AuthService {
  readonly isLoading = signal(false);
  readonly isAuthenticated = signal(false);
  readonly user = signal<any | null>(null);
  readonly accessToken: Signal<string>;

  /** Internal token store exposed as a signal via `accessToken`. */
  private readonly _token = signal('');

  /** Observable mirror of the token for the interceptor. */
  private readonly _token$ = new BehaviorSubject<string>('');

  /** Base URL for the local backend. */
  private readonly apiUrl = 'http://localhost:9090';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    super();
    this.accessToken = this._token;
    this._restoreSession();
  }

  // ── Public API ────────────────────────────────────────────────────

  /**
   * Navigate to the built-in login page.
   * Components call `auth.login()` and don't need to know whether
   * that triggers an OIDC redirect or an in-app navigation.
   */
  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this._clearSession();
    this.router.navigate(['/']);
  }

  getAccessToken$(): Observable<string> {
    return this._token$.asObservable();
  }

  // ── Desktop-specific helpers (used by the LoginPage) ──────────────

  /**
   * Post credentials to the local backend.
   * Returns an observable so the login page can handle success / error.
   */
  authenticate(username: string, password: string): Observable<DesktopLoginResponse> {
    return this.http.post<DesktopLoginResponse>(`${this.apiUrl}/auth/login`, {
      username,
      password,
    });
  }

  /**
   * Called by the login page after a successful `authenticate()`.
   * Stores session state and navigates to the home page.
   */
  handleLoginSuccess(response: DesktopLoginResponse): void {
    this._setSession(response.token, response.user);
    this.router.navigate(['/']);
  }

  // ── Session persistence (localStorage) ────────────────────────────

  private _setSession(token: string, userData: any): void {
    this._token.set(token);
    this._token$.next(token);
    this.user.set(userData);
    this.isAuthenticated.set(true);

    try {
      localStorage.setItem('cc_desktop_token', token);
      localStorage.setItem('cc_desktop_user', JSON.stringify(userData));
    } catch {
      // localStorage may be unavailable — signals still hold the state.
    }
  }

  private _clearSession(): void {
    this._token.set('');
    this._token$.next('');
    this.user.set(null);
    this.isAuthenticated.set(false);

    try {
      localStorage.removeItem('cc_desktop_token');
      localStorage.removeItem('cc_desktop_user');
    } catch {
      // noop
    }
  }

  private _restoreSession(): void {
    try {
      const token = localStorage.getItem('cc_desktop_token');
      const userData = localStorage.getItem('cc_desktop_user');
      if (token && userData) {
        this._setSession(token, JSON.parse(userData));
      }
    } catch {
      // corrupt or unavailable — start logged out.
    }
  }
}
