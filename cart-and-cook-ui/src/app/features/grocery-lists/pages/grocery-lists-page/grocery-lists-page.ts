import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../core/auth/auth';
import { GroceryListCard } from '../../components/grocery-list-card/grocery-list-card';
import { GroceryList } from '../../models/grocery-list.model';

@Component({
  selector: 'app-grocery-lists-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    GroceryListCard,
  ],
  templateUrl: './grocery-lists-page.html',
  styleUrls: ['./grocery-lists-page.scss'],
})
export class GroceryListsPage {
  /** Mock data — replace with a service / HTTP call later */
  readonly lists = signal<GroceryList[]>([
    {
      id: 'gl1',
      name: 'Weekly Essentials',
      items: [
        { name: 'Milk', quantity: '1 gal' },
        { name: 'Eggs', quantity: '1 dozen' },
        { name: 'Bread', quantity: '1 loaf' },
      ],
    },
    {
      id: 'gl2',
      name: 'BBQ Night',
      items: [
        { name: 'Burgers', quantity: '8 patties' },
        { name: 'Buns', quantity: '8' },
      ],
    },
  ]);

  readonly search = signal('');

  readonly filteredLists = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.lists();
    return this.lists().filter(l => l.name.toLowerCase().includes(q));
  });

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  goCreate(): void {
    this.router.navigate(['/grocery-lists', 'new']);
  }
}
