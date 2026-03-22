import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface GroceryList {
  id: string;
  name: string;
  date: string;
  itemCount: number;
}

interface Recipe {
  id: number;
  name: string;
  category: string;
}

@Component({
  selector: 'home-quick-links-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './quick-links-card.html',
  styleUrls: ['./quick-links-card.scss'],
})
export class QuickLinksCard {
  // Mock data — replace with backend data later
  recentGroceryLists = signal<GroceryList[]>([
    { id: 'g1', name: 'Weekly Groceries', date: '2026-02-22', itemCount: 14 },
    { id: 'g2', name: 'Party Supplies', date: '2026-02-16', itemCount: 8 },
    { id: 'g3', name: 'Veggie Restock', date: '2026-02-10', itemCount: 6 },
  ]);

  favoriteRecipes = signal<Recipe[]>([
    { id: 1, name: 'Lemon Garlic Salmon', category: 'seafood' },
    { id: 2, name: 'One-Pan Chicken Veg', category: 'poultry' },
    { id: 3, name: 'Vegan Chili', category: 'vegetarian' },
  ]);
}
