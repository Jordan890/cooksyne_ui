import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RecipeAnalysis } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/ai`;

  /** Upload a photo of a prepared dish for AI analysis. */
  analyzeFood(image: File): Observable<RecipeAnalysis> {
    const form = new FormData();
    form.append('image', image);
    return this.http.post<RecipeAnalysis>(`${this.baseUrl}/analyze-food`, form);
  }

  /** Upload a photo of a written/printed recipe for AI analysis. */
  analyzeRecipe(image: File): Observable<RecipeAnalysis> {
    const form = new FormData();
    form.append('image', image);
    return this.http.post<RecipeAnalysis>(`${this.baseUrl}/analyze-recipe`, form);
  }
}
