/** Shared grocery-list interfaces used across the grocery-lists feature. */

export interface GroceryItem {
  name: string;
  quantity: string;
  checked?: boolean;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  // extension points: createdAt, updatedAt, sharedWith, etc.
}

/** DTO sent to the backend on create / update */
export interface GroceryListDto {
  name: string;
  items: GroceryItem[];
}
