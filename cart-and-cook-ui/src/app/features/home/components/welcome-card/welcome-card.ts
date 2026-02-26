import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'home-welcome-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './welcome-card.html',
  styleUrls: ['./welcome-card.scss'],
})
export class WelcomeCard {}
