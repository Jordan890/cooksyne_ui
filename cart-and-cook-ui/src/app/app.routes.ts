import { Routes } from '@angular/router';
import { RecipesPage } from './features/recipes/pages/recipes-page/recipes-page';
import { RecipeFormPage } from './features/recipes/pages/recipe-form-page/recipe-form-page';
import { HomePage } from './features/home/pages/home-page/home-page';
import { GroceryListsPage } from './features/grocery-lists/pages/grocery-lists-page/grocery-lists-page';
import { authGuard } from './core/guards/authguard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomePage,
  },
  {
    path: 'recipes',
    loadComponent: () => RecipesPage,
    canActivate: [authGuard],
  },
  {
    path: 'recipes/new',
    loadComponent: () => RecipeFormPage,
    canActivate: [authGuard],
  },
  {
    path: 'recipes/:id/edit',
    loadComponent: () => RecipeFormPage,
    canActivate: [authGuard],
  },
  {
    path: 'grocery-lists',
    loadComponent: () => GroceryListsPage,
    canActivate: [authGuard],
  },
];
