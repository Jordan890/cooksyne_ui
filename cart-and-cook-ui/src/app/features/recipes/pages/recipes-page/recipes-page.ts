import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../core/auth/auth';
import { RecipeCard } from '../../components/recipe-card/recipe-card';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RecipeCard,
  ],
  templateUrl: './recipes-page.html',
  styleUrls: ['./recipes-page.scss'],
})
export class RecipesPage {
  /** Mock data — replace with a service / HTTP call later */
  readonly recipes = signal<Recipe[]>([
    { id: 'r1', title: 'Lemon Garlic Salmon', minutes: 30, description: 'Bright, quick pan-seared salmon with a zesty garlic butter sauce.' },
    { id: 'r2', title: 'One-Pan Chicken & Veg', minutes: 40, description: 'Roasted chicken thighs with seasonal vegetables — minimal cleanup.' },
    { id: 'r3', title: 'Vegan Chili', minutes: 50, description: 'Hearty three-bean chili loaded with warm spices and smoky heat.' },
  ]);

  /** Reactive search query bound to the search input */
  readonly search = signal('');

  /** Computed filtered list that reacts to search changes */
  readonly filteredRecipes = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.recipes();
    return this.recipes().filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q),
    );
  });

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  /** Navigate to future "add recipe" flow */
  goAdd(): void {
    this.router.navigate(['/recipes', 'new']);
  }
}
