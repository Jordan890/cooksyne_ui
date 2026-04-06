import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RecipeAnalysis } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ai`;

  /** Analyze a prepared dish — accepts image, title, or both. */
  analyzeFood(image?: File, title?: string): Observable<RecipeAnalysis> {
    const form = new FormData();
    if (image) form.append('image', image);
    if (title) form.append('title', title);
    return this.http.post<RecipeAnalysis>(`${this.baseUrl}/analyze-food`, form);
  }

  /** Analyze a recipe — accepts image, title, or both. */
  analyzeRecipe(image?: File, title?: string): Observable<RecipeAnalysis> {
    const form = new FormData();
    if (image) form.append('image', image);
    if (title) form.append('title', title);
    return this.http.post<RecipeAnalysis>(`${this.baseUrl}/analyze-recipe`, form);
  }
}
