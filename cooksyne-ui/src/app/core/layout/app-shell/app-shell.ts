import { Component, signal, OnDestroy, ViewChild } from '@angular/core';
import type { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../auth/auth';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
})
export class AppShell {
  // responsive state
  isMobile = signal(false);
  sidenavOpen = signal(false);
  // always use overlay mode so sidenav overlaps content on all viewports
  sidenavMode = signal<MatDrawerMode>('over');
  @ViewChild('drawer') drawer?: MatSidenav;

  private mql?: MediaQueryList;
  private mqlListener?: (e: MediaQueryListEvent) => void;

  constructor(public auth: AuthService, private themeService: ThemeService) {
    // initialize based on current viewport (track mobile only)
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.mql = window.matchMedia('(max-width: 599px)');
      this.isMobile.set(this.mql.matches);

      this.mqlListener = (e: MediaQueryListEvent) => {
        this.isMobile.set(e.matches);
        // do not auto-toggle sidenav on resize; leave open/closed state to user
      };

      this.mql.addEventListener('change', this.mqlListener);
    }
  }

  toggle() {
    // Prefer the MatSidenav API to ensure internal state and backdrop update correctly
    if (this.drawer) {
      this.drawer.toggle().then(() => {
        this.sidenavOpen.set(!!this.drawer?.opened);
      });
    } else {
      this.sidenavOpen.update(v => !v);
    }
  }

  onOpenedChange(opened: boolean) {
    this.sidenavOpen.set(opened);
  }

  ngOnDestroy() {
    if (this.mql && this.mqlListener) {
      this.mql.removeEventListener('change', this.mqlListener as any);
    }
  }
}
