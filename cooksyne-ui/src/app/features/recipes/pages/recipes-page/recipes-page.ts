import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/auth/auth';
import { RecipeCard } from '../../components/recipe-card/recipe-card';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../data/recipe.service';

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RecipeCard,
  ],
  templateUrl: './recipes-page.html',
  styleUrls: ['./recipes-page.scss'],
})
export class RecipesPage implements OnInit {
  private recipeService = inject(RecipeService);

  /** All recipes loaded from the API */
  readonly recipes = signal<Recipe[]>([]);

  /** Whether the initial data fetch is in progress */
  readonly loading = signal(true);

  /** Reactive search query bound to the search input */
  readonly search = signal('');

  /** Computed filtered list that reacts to search changes */
  readonly filteredRecipes = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.recipes();
    return this.recipes().filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        (r.category ?? '').toLowerCase().includes(q),
    );
  });

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  /** Navigate to "add recipe" flow */
  goAdd(): void {
    this.router.navigate(['/recipes', 'new']);
  }

  /** Delete a recipe by ID, then remove it from the local list */
  deleteRecipe(id: number): void {
    this.recipeService.delete(id).subscribe({
      next: () => this.recipes.update(list => list.filter(r => r.id !== id)),
      error: err => console.error('Failed to delete recipe', err),
    });
  }

  /** Fetch all recipes from the backend */
  private loadRecipes(): void {
    this.loading.set(true);
    this.recipeService.getAll().subscribe({
      next: recipes => {
        this.recipes.set(recipes);
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load recipes', err);
        this.loading.set(false);
      },
    });
  }
}
