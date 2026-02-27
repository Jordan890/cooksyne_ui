import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface Recipe {
  id: string;
  title: string;
  minutes: number;
  description?: string;
  // extension points — add imageUrl, tags, favorite, etc. later
}

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.scss'],
})
export class RecipeCard {
  /** The recipe data to display */
  recipe = input.required<Recipe>();
}
