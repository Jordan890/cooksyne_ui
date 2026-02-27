/** Shared recipe-related interfaces used across the recipes feature. */

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  minutes: number;
  description?: string;
  imageUrl?: string;
  servings?: number;
  ingredients?: Ingredient[];
  // extension points: tags, instructions, favourite, etc.
}

/** DTO sent to the backend on create / update */
export interface RecipeDto {
  title: string;
  minutes: number;
  description?: string;
  imageUrl?: string;
  servings?: number;
  ingredients?: Ingredient[];
}
