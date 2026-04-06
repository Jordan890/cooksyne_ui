import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IngredientQuantity, Recipe, RecipeAnalysis, RecipeRequest, UNITS, Unit } from '../../models/recipe.model';
import { RecipeService } from '../../data/recipe.service';
import { ImageUploadService } from '../../data/image-upload.service';
import { ImageAnalyzer } from '../../components/image-analyzer/image-analyzer';
import { AddToGroceryDialog, AddToGroceryDialogData } from '../../components/add-to-grocery-dialog/add-to-grocery-dialog';

@Component({
  selector: 'app-recipe-form-page',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    ImageAnalyzer,
  ],
  templateUrl: './recipe-form-page.html',
  styleUrls: ['./recipe-form-page.scss'],
})
export class RecipeFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private imageUploadService = inject(ImageUploadService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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

  /* ── AI analysis ── */
  readonly estimatedCalories = signal<number | null>(null);

  /* ── Recipe image ── */
  readonly imageUrl = signal<string | null>(null);
  readonly imagePreviewUrl = signal<string | null>(null);
  readonly uploadingImage = signal(false);

  /* ── UI state ── */
  readonly saving = signal(false);
  readonly loading = signal(false);

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
      this.loading.set(true);
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
      imageUrl: this.imageUrl() ?? undefined,
      ingredients: this.ingredients().filter(i => i.name.trim()),
      estimatedCalories: this.estimatedCalories(),
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

  /** Apply AI analysis results to the form. */
  applyAnalysis(result: RecipeAnalysis): void {
    if (result.title && !this.name().trim()) {
      this.name.set(result.title);
    }
    if (result.category && !this.category().trim()) {
      this.category.set(result.category);
    }
    if (result.description && !this.description().trim()) {
      this.description.set(result.description);
    }
    this.estimatedCalories.set(result.estimatedCalories ?? 0);
    if (result.ingredients?.length) {
      this.ingredients.set(
        result.ingredients.map(i => ({
          name: i.name,
          quantity: {
            amount: i.amount || 1,
            unit: (UNITS.includes(i.unit as Unit) ? i.unit : 'COUNT') as Unit,
          },
        })),
      );
    }
  }

  /** Upload a recipe photo chosen by the user. */
  onRecipeImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploadImage(file);
  }

  removeImage(): void {
    this.imageUrl.set(null);
    this.imagePreviewUrl.set(null);
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
  }

  /** Open dialog to add recipe ingredients to a grocery list. */
  addToGroceryList(): void {
    const filled = this.ingredients().filter(i => i.name.trim());
    if (!filled.length) return;

    const data: AddToGroceryDialogData = {
      recipeName: this.name() || 'Untitled Recipe',
      ingredients: filled,
    };

    this.dialog
      .open(AddToGroceryDialog, { data, width: '440px' })
      .afterClosed()
      .subscribe(success => {
        if (success) {
          this.snackBar.open('Ingredients added to grocery list', 'OK', { duration: 3000 });
        }
      });
  }

  /* ── Private ── */
  private uploadImage(file: File): void {
    this.uploadingImage.set(true);

    // Show a local preview immediately
    const reader = new FileReader();
    reader.onload = () => this.imagePreviewUrl.set(reader.result as string);
    reader.readAsDataURL(file);

    this.imageUploadService.upload(file).subscribe({
      next: url => {
        this.imageUrl.set(url);
        this.imagePreviewUrl.set(this.imageUploadService.resolveUrl(url));
        this.uploadingImage.set(false);
      },
      error: err => {
        console.error('Image upload failed', err);
        this.imagePreviewUrl.set(null);
        this.uploadingImage.set(false);
      },
    });
  }

  private loadRecipe(id: number): void {
    this.recipeService.getById(id).subscribe({
      next: (recipe: Recipe) => {
        this.name.set(recipe.name);
        this.category.set(recipe.category);
        this.description.set(recipe.description ?? '');
        this.estimatedCalories.set(recipe.estimatedCalories ?? null);
        if (recipe.imageUrl) {
          this.imageUrl.set(recipe.imageUrl);
          this.imagePreviewUrl.set(this.imageUploadService.resolveUrl(recipe.imageUrl));
        }
        this.ingredients.set(
          recipe.ingredients?.length
            ? recipe.ingredients
            : [{ name: '', quantity: { amount: 1, unit: 'COUNT' as Unit } }],
        );
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load recipe', err);
        this.loading.set(false);
      },
    });
  }
}
