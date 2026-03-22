import { Component, inject, input, output } from '@angular/core';
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

  /** Emitted when the user confirms deletion */
  deleted = output<number>();

  /** Navigate to the edit page for this recipe */
  open(): void {
    const id = this.recipe().id;
    if (id != null) {
      this.router.navigate(['/recipes', id, 'edit']);
    }
  }

  /** Ask for confirmation then emit delete event */
  confirmDelete(event: Event): void {
    event.stopPropagation();
    const id = this.recipe().id;
    if (id == null) return;
    if (confirm(`Delete "${this.recipe().name}"?`)) {
      this.deleted.emit(id);
    }
  }
}
