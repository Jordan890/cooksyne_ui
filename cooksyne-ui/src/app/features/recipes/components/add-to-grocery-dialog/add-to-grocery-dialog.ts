import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { GroceryList, GroceryListRequest } from '../../../grocery-lists/models/grocery-list.model';
import { GroceryListService } from '../../../grocery-lists/data/grocery-list.service';
import { IngredientQuantity } from '../../models/recipe.model';
import { mergeIngredients } from '../../../../shared/utils/ingredient-merger';

export interface AddToGroceryDialogData {
  recipeName: string;
  ingredients: IngredientQuantity[];
}

@Component({
  selector: 'app-add-to-grocery-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './add-to-grocery-dialog.html',
  styleUrls: ['./add-to-grocery-dialog.scss'],
})
export class AddToGroceryDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<AddToGroceryDialog>);
  private groceryService = inject(GroceryListService);
  readonly data: AddToGroceryDialogData = inject(MAT_DIALOG_DATA);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly lists = signal<GroceryList[]>([]);

  /** 'existing' or 'new' */
  readonly mode = signal<'existing' | 'new'>('new');

  readonly selectedListId = signal<number | null>(null);
  readonly newListName = signal('');

  ngOnInit(): void {
    this.newListName.set(`Ingredients for ${this.data.recipeName}`);
    this.groceryService.getAll().subscribe({
      next: lists => {
        this.lists.set(lists);
        this.mode.set(lists.length > 0 ? 'existing' : 'new');
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    if (this.saving()) return;
    this.saving.set(true);

    if (this.mode() === 'new') {
      this.createNewList();
    } else {
      this.addToExistingList();
    }
  }

  private createNewList(): void {
    const request: GroceryListRequest = {
      id: null,
      name: this.newListName().trim() || `Ingredients for ${this.data.recipeName}`,
      description: `Ingredients from recipe: ${this.data.recipeName}`,
      ingredients: this.data.ingredients.map(i => ({
        name: i.name,
        quantity: { amount: i.quantity.amount, unit: i.quantity.unit },
      })),
    };

    this.groceryService.upsert(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: err => {
        console.error('Failed to create grocery list', err);
        this.saving.set(false);
      },
    });
  }

  private addToExistingList(): void {
    const id = this.selectedListId();
    if (id == null) {
      this.saving.set(false);
      return;
    }

    this.groceryService.getById(id).subscribe({
      next: list => {
        const merged = mergeIngredients(list.ingredients, this.data.ingredients);
        const request: GroceryListRequest = {
          id: list.id,
          name: list.name,
          description: list.description,
          ingredients: merged,
        };
        this.groceryService.upsert(request).subscribe({
          next: () => {
            this.saving.set(false);
            this.dialogRef.close(true);
          },
          error: err => {
            console.error('Failed to update grocery list', err);
            this.saving.set(false);
          },
        });
      },
      error: err => {
        console.error('Failed to load grocery list', err);
        this.saving.set(false);
      },
    });
  }
}
