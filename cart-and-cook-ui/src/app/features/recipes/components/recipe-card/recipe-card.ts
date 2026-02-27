import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Recipe } from '../../models/recipe.model';

export type { Recipe };

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.scss'],
})
export class RecipeCard {
  private router = inject(Router);

  /** The recipe data to display */
  recipe = input.required<Recipe>();

  /** Navigate to the edit page for this recipe */
  open(): void {
    this.router.navigate(['/recipes', this.recipe().id, 'edit']);
  }
}
