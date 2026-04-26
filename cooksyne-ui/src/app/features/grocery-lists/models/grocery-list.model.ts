/**
 * Shared grocery-list interfaces used across the grocery-lists feature.
 *
 * Ingredients reuse the same IngredientQuantity / Quantity / Unit types as
 * recipes — both features share the backend domain model.
 */
import { IngredientQuantity } from '../../recipes/models/recipe.model';

export type { IngredientQuantity };

/**
 * Full grocery list as returned by the API.
 * Matches backend `GroceryListResponse`.
 */
export interface GroceryList {
  id: number | null;
  name: string;
  description: string;
  ingredients: IngredientQuantity[];
}

/**
 * DTO sent to the backend on create / update.
 * Matches backend `GroceryListRequest`.
 */
export interface GroceryListRequest {
  id: number | null;
  name: string;
  description: string;
  ingredients: IngredientQuantity[];
}
