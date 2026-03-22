import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../../recipes/data/recipe.service';
import { GroceryListService } from '../../../grocery-lists/data/grocery-list.service';
import { Recipe } from '../../../recipes/models/recipe.model';
import { GroceryList } from '../../../grocery-lists/models/grocery-list.model';

@Component({
  selector: 'home-quick-links-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './quick-links-card.html',
  styleUrls: ['./quick-links-card.scss'],
})
export class QuickLinksCard implements OnInit {
  private recipeService = inject(RecipeService);
  private groceryListService = inject(GroceryListService);

  readonly loadingRecipes = signal(true);
  readonly loadingLists = signal(true);

  recentGroceryLists = signal<GroceryList[]>([]);
  recentRecipes = signal<Recipe[]>([]);

  ngOnInit(): void {
    this.groceryListService.getAll().subscribe({
      next: lists => {
        this.recentGroceryLists.set(lists.slice(0, 3));
        this.loadingLists.set(false);
      },
      error: () => this.loadingLists.set(false),
    });

    this.recipeService.getAll().subscribe({
      next: recipes => {
        this.recentRecipes.set(recipes.slice(0, 3));
        this.loadingRecipes.set(false);
      },
      error: () => this.loadingRecipes.set(false),
    });
  }
}
