import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Recipe, RecipeRequest } from '../models/recipe.model';

/**
 * Angular service that mirrors the backend RecipeController.
 *
 * Endpoints
 * ─────────────────────────────────────────
 *  GET    /recipes        → getAllRecipes()
 *  GET    /recipes/:id    → getRecipeById(id)
 *  POST   /recipes        → upsertRecipe(req)   (create or update)
 *  DELETE /recipes/:id    → deleteRecipe(id)
 */
@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/recipes`;

  /** Fetch every recipe owned by the authenticated user. */
  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl);
  }

  /** Fetch a single recipe by its ID. */
  getById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create or update a recipe (upsert).
   * Send `id: null` to create; send `id: <number>` to update.
   */
  upsert(request: RecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, request);
  }

  /** Delete a recipe by its ID. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
