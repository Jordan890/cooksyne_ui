import { Routes } from '@angular/router';
import { RecipesPage } from './features/recipes/pages/recipes-page/recipes-page';
import { HomePage } from './features/home/pages/home-page/home-page';
import { GroceryListsPage } from './features/grocery-lists/pages/grocery-lists-page/grocery-lists-page';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomePage,
  },
  {
    path: 'recipes',
    loadComponent: () => RecipesPage,
  },
  {
    path: 'grocery-lists',
    loadComponent: () => GroceryListsPage,
  },
];
