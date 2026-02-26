import { Component, signal, computed, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/auth';

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
],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
})
export class AppShell {
  // responsive state
  isMobile = signal(false);
  sidenavOpen = signal(true);
  sidenavMode = computed(() => (this.isMobile() ? 'over' : 'side'));
  hasBackdrop = computed(() => this.isMobile());

  private mql?: MediaQueryList;
  private mqlListener?: (e: MediaQueryListEvent) => void;

  constructor(public auth: AuthService) {
    // initialize based on current viewport
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.mql = window.matchMedia('(max-width: 767px)');
      this.isMobile.set(this.mql.matches);
      this.sidenavOpen.set(!this.mql.matches);

      this.mqlListener = (e: MediaQueryListEvent) => {
        this.isMobile.set(e.matches);
        // close sidenav on mobile, open on larger screens
        if (e.matches) {
          this.sidenavOpen.set(false);
        } else {
          this.sidenavOpen.set(true);
        }
      };

      this.mql.addEventListener('change', this.mqlListener);
    }
  }

  toggle() {
    this.sidenavOpen.update(v => !v);
  }

  ngOnDestroy() {
    if (this.mql && this.mqlListener) {
      this.mql.removeEventListener('change', this.mqlListener as any);
    }
  }
}
