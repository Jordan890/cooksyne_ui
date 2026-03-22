import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GroceryList, GroceryListRequest } from '../models/grocery-list.model';

/**
 * Angular service that mirrors the backend GroceryListController.
 *
 * Endpoints
 * ─────────────────────────────────────────
 *  GET    /grocery_list        → getAll()
 *  GET    /grocery_list/:id    → getById(id)
 *  POST   /grocery_list        → upsert(req)   (create or update)
 *  DELETE /grocery_list/:id    → delete(id)
 */
@Injectable({ providedIn: 'root' })
export class GroceryListService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/grocery_list`;

  /** Fetch every grocery list owned by the authenticated user. */
  getAll(): Observable<GroceryList[]> {
    return this.http.get<GroceryList[]>(this.baseUrl);
  }

  /** Fetch a single grocery list by its ID. */
  getById(id: number): Observable<GroceryList> {
    return this.http.get<GroceryList>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create or update a grocery list (upsert).
   * Send `id: null` to create; send `id: <number>` to update.
   */
  upsert(request: GroceryListRequest): Observable<GroceryList> {
    return this.http.post<GroceryList>(this.baseUrl, request);
  }

  /** Delete a grocery list by its ID. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
