import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/auth/auth';
import { GroceryListCard } from '../../components/grocery-list-card/grocery-list-card';
import { GroceryList } from '../../models/grocery-list.model';
import { GroceryListService } from '../../data/grocery-list.service';

@Component({
  selector: 'app-grocery-lists-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    GroceryListCard,
  ],
  templateUrl: './grocery-lists-page.html',
  styleUrls: ['./grocery-lists-page.scss'],
})
export class GroceryListsPage implements OnInit {
  private groceryListService = inject(GroceryListService);

  /** Whether the initial data fetch is in progress */
  readonly loading = signal(true);

  readonly lists = signal<GroceryList[]>([]);

  readonly search = signal('');

  readonly filteredLists = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.lists();
    return this.lists().filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q),
    );
  });

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadLists();
  }

  goCreate(): void {
    this.router.navigate(['/grocery-lists', 'new']);
  }

  private loadLists(): void {
    this.loading.set(true);
    this.groceryListService.getAll().subscribe({
      next: lists => {
        this.lists.set(lists);
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load grocery lists', err);
        this.loading.set(false);
      },
    });
  }
}
