import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth';
import { DesktopAuthService } from '../../../../core/auth/desktop-auth.service';

/**
 * Native login page shown only in the **desktop** runtime.
 *
 * Posts credentials to the local backend via `DesktopAuthService.authenticate()`.
 * In the OIDC runtime this page is never routed to because `auth.login()`
 * triggers an external redirect instead.
 */
@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
})
export class LoginPage {
  username = signal('');
  password = signal('');
  error = signal<string | null>(null);
  loading = signal(false);
  hidePassword = signal(true);

  /** Narrow-cast so we can reach desktop-specific helpers. */
  private desktop: DesktopAuthService;

  constructor(
    auth: AuthService,
    private router: Router,
  ) {
    // If already authenticated, bounce to home immediately.
    if (auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.desktop = auth as DesktopAuthService;
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((v) => !v);
  }

  submit(): void {
    const u = this.username().trim();
    const p = this.password();

    if (!u || !p) {
      this.error.set('Username and password are required.');
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    this.desktop.authenticate(u, p).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.desktop.handleLoginSuccess(res);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ?? 'Invalid credentials. Please try again.',
        );
      },
    });
  }
}
