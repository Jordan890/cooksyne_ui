import { Injectable, signal, OnDestroy } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  /** Reactive signal – true when the app is in dark mode */
  readonly isDarkMode = signal(false);

  private mql?: MediaQueryList;
  private mqlListener?: (e: MediaQueryListEvent) => void;

  constructor() {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    this.mql = window.matchMedia('(prefers-color-scheme: dark)');

    // Apply the initial system preference
    this.applyTheme(this.mql.matches ? 'dark' : 'light');

    // Listen for system-level changes
    this.mqlListener = (e: MediaQueryListEvent) => {
      this.applyTheme(e.matches ? 'dark' : 'light');
    };
    this.mql.addEventListener('change', this.mqlListener);
  }

  /** Programmatically switch theme */
  setTheme(theme: Theme): void {
    this.applyTheme(theme);
  }

  /** Toggle between light ↔ dark */
  toggleTheme(): void {
    this.applyTheme(this.isDarkMode() ? 'light' : 'dark');
  }

  ngOnDestroy(): void {
    if (this.mql && this.mqlListener) {
      this.mql.removeEventListener('change', this.mqlListener);
    }
  }

  // ── private ──

  private applyTheme(theme: Theme): void {
    const isDark = theme === 'dark';
    this.isDarkMode.set(isDark);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
