import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Runtime-agnostic authentication contract.
 *
 * Every component, guard, and interceptor depends on this abstract class.
 * The concrete implementation is swapped at bootstrap time:
 *   • OidcAuthService  – self-hosted / cloud (redirect-based OIDC)
 *   • DesktopAuthService – offline desktop (local username / password)
 */
export abstract class AuthService {
  /** Whether the auth check is still in progress (e.g. OIDC callback). */
  abstract readonly isLoading: Signal<boolean>;

  /** Whether the current user is authenticated. */
  abstract readonly isAuthenticated: Signal<boolean>;

  /** Authenticated user profile (null when logged out). */
  abstract readonly user: Signal<any | null>;

  /** Current access / session token (empty string when logged out). */
  abstract readonly accessToken: Signal<string>;

  /** Trigger the login flow (OIDC redirect **or** navigate to local login). */
  abstract login(): void;

  /** Log the user out and clear session state. */
  abstract logout(): void;

  /** Observable wrapper kept for the HTTP interceptor. */
  abstract getAccessToken$(): Observable<string>;
}
