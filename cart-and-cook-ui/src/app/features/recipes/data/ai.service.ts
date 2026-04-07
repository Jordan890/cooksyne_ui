import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RecipeAnalysis } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ai`;

  /** Generate ingredients from a dish name (text-only, no image). */
  analyzeFood(title: string): Observable<RecipeAnalysis> {
    const params = new HttpParams().set('title', title);
    return this.http.post<RecipeAnalysis>(`${this.baseUrl}/analyze-food`, null, { params });
  }

  /** Upload a recipe image for OCR extraction and AI analysis. */
  analyzeRecipe(image: File): Observable<RecipeAnalysis> {
    const form = new FormData();
    form.append('image', image);
    return this.http.post<RecipeAnalysis>(`${this.baseUrl}/analyze-recipe`, form);
  }

  /** Estimate calories for a recipe based on serving size and ingredients. */
  estimateCalories(
    recipeName: string,
    ingredientsSummary: string,
    servingSize: string,
  ): Observable<{ estimatedCalories: number }> {
    const params = new HttpParams()
      .set('recipeName', recipeName)
      .set('ingredientsSummary', ingredientsSummary)
      .set('servingSize', servingSize);
    return this.http.post<{ estimatedCalories: number }>(
      `${this.baseUrl}/estimate-calories`,
      null,
      { params },
    );
  }
}
