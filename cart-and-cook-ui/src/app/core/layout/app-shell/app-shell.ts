import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
})
export class AppShell {
  sidenavOpen = signal(true);

  toggle() {
    this.sidenavOpen.update(v => !v);
  }
}
