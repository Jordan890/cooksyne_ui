import { Routes } from '@angular/router';
import { RecipesPage } from './features/recipes/pages/recipes-page/recipes-page';
import { RecipeFormPage } from './features/recipes/pages/recipe-form-page/recipe-form-page';
import { HomePage } from './features/home/pages/home-page/home-page';
import { GroceryListsPage } from './features/grocery-lists/pages/grocery-lists-page/grocery-lists-page';
import { GroceryListFormPage } from './features/grocery-lists/pages/grocery-list-form-page/grocery-list-form-page';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { authGuard } from './core/guards/authguard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomePage,
  },
  {
    path: 'login',
    loadComponent: () => LoginPage,
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
  {
    path: 'grocery-lists/new',
    loadComponent: () => GroceryListFormPage,
    canActivate: [authGuard],
  },
  {
    path: 'grocery-lists/:id/edit',
    loadComponent: () => GroceryListFormPage,
    canActivate: [authGuard],
  },
];
