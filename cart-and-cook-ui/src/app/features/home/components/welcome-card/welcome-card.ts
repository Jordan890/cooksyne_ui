import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/auth/auth';

@Component({
  selector: 'home-welcome-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './welcome-card.html',
  styleUrls: ['./welcome-card.scss'],
})
export class WelcomeCard {
  constructor(public auth: AuthService) {}
}
