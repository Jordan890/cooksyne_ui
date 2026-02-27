import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GroceryList } from '../../models/grocery-list.model';

export type { GroceryList };

@Component({
  selector: 'app-grocery-list-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './grocery-list-card.html',
  styleUrls: ['./grocery-list-card.scss'],
})
export class GroceryListCard {
  private router = inject(Router);

  list = input.required<GroceryList>();

  open(): void {
    this.router.navigate(['/grocery-lists', this.list().id, 'edit']);
  }
}
