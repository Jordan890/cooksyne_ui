import { EnvironmentProviders, InjectionToken, Provider } from '@angular/core';
import { provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from '../../auth/auth.config';
import { AuthService } from './auth';
import { DesktopAuthService } from './desktop-auth.service';
import { OidcAuthService } from './oidc-auth.service';

// ── Runtime discriminator ───────────────────────────────────────────

/** The two supported authentication runtimes. */
export type AuthRuntime = 'oidc' | 'desktop';

/**
 * Injection token that tells the rest of the app which auth runtime is active.
 * Set once at bootstrap; never changes at runtime.
 */
export const AUTH_RUNTIME = new InjectionToken<AuthRuntime>('AUTH_RUNTIME');

// ── Provider helpers ────────────────────────────────────────────────

/**
 * Call one of these in `app.config.ts` to wire up the correct `AuthService`
 * implementation and any runtime-specific providers (e.g. OIDC library).
 *
 * Usage:
 * ```ts
 * // Self-hosted / cloud
 * providers: [ ...provideOidcAuth() ]
 *
 * // Desktop / offline
 * providers: [ ...provideDesktopAuth() ]
 * ```
 */
export function provideOidcAuth(): (Provider | EnvironmentProviders)[] {
  return [
    { provide: AUTH_RUNTIME, useValue: 'oidc' as AuthRuntime },
    provideAuth({ config: authConfig.config }),
    { provide: AuthService, useClass: OidcAuthService },
  ];
}

export function provideDesktopAuth(): (Provider | EnvironmentProviders)[] {
  return [
    { provide: AUTH_RUNTIME, useValue: 'desktop' as AuthRuntime },
    { provide: AuthService, useClass: DesktopAuthService },
  ];
}
