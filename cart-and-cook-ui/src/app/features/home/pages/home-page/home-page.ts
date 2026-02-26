import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WelcomeCard } from '../../components/welcome-card/welcome-card';
import { QuickLinksCard } from '../../components/quick-links-card/quick-links-card';
import { AuthService } from '../../../../core/auth/auth';

@Component({
  selector: 'app-home-page',
  imports: [WelcomeCard, QuickLinksCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

  constructor(public auth: AuthService) {}

}
