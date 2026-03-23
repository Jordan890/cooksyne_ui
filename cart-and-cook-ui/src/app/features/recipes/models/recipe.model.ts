/** Shared recipe-related interfaces used across the recipes feature. */

/**
 * Measurement units matching the backend `Unit` enum.
 * Weight: GRAMS, OUNCES, POUNDS
 * Volume: CUPS, TBSP, TSP, ML, LITERS
 * Countable: COUNT
 */
export type Unit =
  | 'GRAMS'
  | 'OUNCES'
  | 'POUNDS'
  | 'CUPS'
  | 'TBSP'
  | 'TSP'
  | 'ML'
  | 'LITERS'
  | 'COUNT';

/** All valid unit values (useful for dropdowns). */
export const UNITS: Unit[] = [
  'COUNT',
  'CUPS',
  'TBSP',
  'TSP',
  'ML',
  'LITERS',
  'GRAMS',
  'OUNCES',
  'POUNDS',
];

/** Structured quantity (amount + unit). Matches backend `Quantity` record. */
export interface Quantity {
  amount: number;
  unit: Unit;
}

/** Ingredient with structured quantity. Matches backend `IngredientQuantity`. */
export interface IngredientQuantity {
  name: string;
  quantity: Quantity;
}

/**
 * Full recipe as returned by the API.
 * Matches backend `RecipeResponse`.
 */
export interface Recipe {
  id: number | null;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  ingredients: IngredientQuantity[];
  estimatedCalories?: number | null;
}

/**
 * DTO sent to the backend on create / update.
 * Matches backend `RecipeRequest`.
 */
export interface RecipeRequest {
  id: number | null;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  ingredients: IngredientQuantity[];
  estimatedCalories?: number | null;
}

/** Single ingredient returned by the AI analysis endpoint. */
export interface IngredientEstimate {
  name: string;
  amount: number;
  unit: string;
  calories: number | null;
}

/** Response from POST /api/ai/analyze-food or /api/ai/analyze-recipe. */
export interface RecipeAnalysis {
  title: string;
  category: string;
  description: string;
  ingredients: IngredientEstimate[];
  estimatedCalories: number | null;
}
