import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { IngredientQuantity, Recipe, RecipeRequest, UNITS, Unit } from '../../models/recipe.model';
import { RecipeService } from '../../data/recipe.service';

@Component({
  selector: 'app-recipe-form-page',
  standalone: true,
  imports: [
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  templateUrl: './recipe-form-page.html',
  styleUrls: ['./recipe-form-page.scss'],
})
export class RecipeFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);

  /* ── Constants ── */
  readonly units = UNITS;

  /* ── Mode ── */
  readonly recipeId = signal<number | null>(null);
  readonly isEdit = computed(() => this.recipeId() !== null);
  readonly pageTitle = computed(() => (this.isEdit() ? 'Edit Recipe' : 'Create Recipe'));

  /* ── Form state (signals) ── */
  readonly name = signal('');
  readonly category = signal('');
  readonly description = signal('');
  readonly ingredients = signal<IngredientQuantity[]>([
    { name: '', quantity: { amount: 1, unit: 'COUNT' } },
  ]);

  /* ── UI state ── */
  readonly saving = signal(false);

  /* ── Validation ── */
  readonly isValid = computed(() => {
    if (!this.name().trim()) return false;
    if (!this.category().trim()) return false;
    return this.ingredients().every(i => i.name.trim().length > 0);
  });

  /* ── Lifecycle ── */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.recipeId.set(id);
      this.loadRecipe(id);
    }
  }

  /* ── Ingredient list management ── */
  addIngredient(): void {
    this.ingredients.update(list => [
      ...list,
      { name: '', quantity: { amount: 1, unit: 'COUNT' as Unit } },
    ]);
  }

  removeIngredient(index: number): void {
    this.ingredients.update(list => list.filter((_, i) => i !== index));
  }

  updateIngredientName(index: number, value: string): void {
    this.ingredients.update(list =>
      list.map((item, i) => (i === index ? { ...item, name: value } : item)),
    );
  }

  updateIngredientAmount(index: number, value: number): void {
    this.ingredients.update(list =>
      list.map((item, i) =>
        i === index
          ? { ...item, quantity: { ...item.quantity, amount: value } }
          : item,
      ),
    );
  }

  updateIngredientUnit(index: number, value: Unit): void {
    this.ingredients.update(list =>
      list.map((item, i) =>
        i === index
          ? { ...item, quantity: { ...item.quantity, unit: value } }
          : item,
      ),
    );
  }

  /* ── Actions ── */
  save(): void {
    if (!this.isValid()) return;

    const request: RecipeRequest = {
      id: this.recipeId(),
      name: this.name().trim(),
      category: this.category().trim(),
      description: this.description().trim(),
      ingredients: this.ingredients().filter(i => i.name.trim()),
    };

    this.saving.set(true);

    this.recipeService.upsert(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/recipes']);
      },
      error: err => {
        console.error('Failed to save recipe', err);
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
  }

  /* ── Private ── */
  private loadRecipe(id: number): void {
    this.recipeService.getById(id).subscribe({
      next: (recipe: Recipe) => {
        this.name.set(recipe.name);
        this.category.set(recipe.category);
        this.description.set(recipe.description ?? '');
        this.ingredients.set(
          recipe.ingredients?.length
            ? recipe.ingredients
            : [{ name: '', quantity: { amount: 1, unit: 'COUNT' as Unit } }],
        );
      },
      error: err => console.error('Failed to load recipe', err),
    });
  }
}
