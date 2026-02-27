import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Ingredient, Recipe, RecipeDto } from '../../models/recipe.model';

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
  ],
  templateUrl: './recipe-form-page.html',
  styleUrls: ['./recipe-form-page.scss'],
})
export class RecipeFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /* ── Mode ── */
  readonly recipeId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.recipeId());
  readonly pageTitle = computed(() => (this.isEdit() ? 'Edit Recipe' : 'Create Recipe'));

  /* ── Form state (signals) ── */
  readonly title = signal('');
  readonly description = signal('');
  readonly imageUrl = signal('');
  readonly minutes = signal<number | null>(null);
  readonly servings = signal<number | null>(null);
  readonly ingredients = signal<Ingredient[]>([{ name: '', quantity: '' }]);

  /* ── UI state ── */
  readonly saving = signal(false);

  /* ── Validation ── */
  readonly isValid = computed(() => {
    if (!this.title().trim()) return false;
    // every existing ingredient row must have a name
    return this.ingredients().every(i => i.name.trim().length > 0);
  });

  /* ── Lifecycle ── */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeId.set(id);
      this.loadRecipe(id);
    }
  }

  /* ── Ingredient list management ── */
  addIngredient(): void {
    this.ingredients.update(list => [...list, { name: '', quantity: '' }]);
  }

  removeIngredient(index: number): void {
    this.ingredients.update(list => list.filter((_, i) => i !== index));
  }

  updateIngredient(index: number, field: keyof Ingredient, value: string): void {
    this.ingredients.update(list =>
      list.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  /* ── Actions ── */
  save(): void {
    if (!this.isValid()) return;

    const dto: RecipeDto = {
      title: this.title().trim(),
      minutes: this.minutes() ?? 0,
      description: this.description().trim() || undefined,
      imageUrl: this.imageUrl().trim() || undefined,
      servings: this.servings() ?? undefined,
      ingredients: this.ingredients().filter(i => i.name.trim()),
    };

    this.saving.set(true);

    // TODO: replace with actual service call
    // this.recipeService.save(this.recipeId(), dto).subscribe(...)
    console.log(this.isEdit() ? 'Updating' : 'Creating', dto);

    // Simulate async save
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/recipes']);
    }, 600);
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
  }

  /* ── Private ── */
  private loadRecipe(id: string): void {
    // TODO: replace with actual service call
    // For now, populate with mock data matching the ID
    const mock: Recipe = {
      id,
      title: 'Lemon Garlic Salmon',
      minutes: 30,
      description: 'Bright, quick pan-seared salmon with a zesty garlic butter sauce.',
      servings: 2,
      ingredients: [
        { name: 'Salmon fillet', quantity: '2 pieces' },
        { name: 'Garlic cloves', quantity: '4, minced' },
        { name: 'Lemon', quantity: '1, juiced' },
        { name: 'Butter', quantity: '2 tbsp' },
      ],
    };

    this.title.set(mock.title);
    this.description.set(mock.description ?? '');
    this.imageUrl.set(mock.imageUrl ?? '');
    this.minutes.set(mock.minutes);
    this.servings.set(mock.servings ?? null);
    this.ingredients.set(mock.ingredients?.length ? mock.ingredients : [{ name: '', quantity: '' }]);
  }
}
