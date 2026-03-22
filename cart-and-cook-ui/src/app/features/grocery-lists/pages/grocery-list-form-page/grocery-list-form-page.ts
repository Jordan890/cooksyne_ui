import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { GroceryList, GroceryListRequest, IngredientQuantity } from '../../models/grocery-list.model';
import { UNITS, Unit } from '../../../recipes/models/recipe.model';
import { GroceryListService } from '../../data/grocery-list.service';

@Component({
  selector: 'app-grocery-list-form-page',
  standalone: true,
  imports: [
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './grocery-list-form-page.html',
  styleUrls: ['./grocery-list-form-page.scss'],
})
export class GroceryListFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groceryListService = inject(GroceryListService);

  /* ── Constants ── */
  readonly units = UNITS;

  /* ── Mode ── */
  readonly listId = signal<number | null>(null);
  readonly isEdit = computed(() => this.listId() !== null);
  readonly pageTitle = computed(() => (this.isEdit() ? 'Edit Grocery List' : 'Create Grocery List'));

  /* ── Form state ── */
  readonly name = signal('');
  readonly description = signal('');
  readonly ingredients = signal<IngredientQuantity[]>([
    { name: '', quantity: { amount: 1, unit: 'COUNT' } },
  ]);

  /* ── UI state ── */
  readonly saving = signal(false);
  readonly loading = signal(false);

  /* ── Validation ── */
  readonly isValid = computed(() => {
    if (!this.name().trim()) return false;
    return this.ingredients().every(i => i.name.trim().length > 0);
  });

  /* ── Lifecycle ── */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.listId.set(id);
      this.loading.set(true);
      this.loadList(id);
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

    const request: GroceryListRequest = {
      id: this.listId(),
      name: this.name().trim(),
      description: this.description().trim(),
      ingredients: this.ingredients().filter(i => i.name.trim()),
    };

    this.saving.set(true);

    this.groceryListService.upsert(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/grocery-lists']);
      },
      error: err => {
        console.error('Failed to save grocery list', err);
        this.saving.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/grocery-lists']);
  }

  /* ── Private ── */
  private loadList(id: number): void {
    this.groceryListService.getById(id).subscribe({
      next: (list: GroceryList) => {
        this.name.set(list.name);
        this.description.set(list.description ?? '');
        this.ingredients.set(
          list.ingredients?.length
            ? list.ingredients
            : [{ name: '', quantity: { amount: 1, unit: 'COUNT' as Unit } }],
        );
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load grocery list', err);
        this.loading.set(false);
      },
    });
  }
}
