import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GroceryItem, GroceryList, GroceryListDto } from '../../models/grocery-list.model';

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
  ],
  templateUrl: './grocery-list-form-page.html',
  styleUrls: ['./grocery-list-form-page.scss'],
})
export class GroceryListFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /* ── Mode ── */
  readonly listId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.listId());
  readonly pageTitle = computed(() => (this.isEdit() ? 'Edit Grocery List' : 'Create Grocery List'));

  /* ── Form state ── */
  readonly name = signal('');
  readonly items = signal<GroceryItem[]>([{ name: '', quantity: '' }]);

  /* ── UI state ── */
  readonly saving = signal(false);

  /* ── Validation ── */
  readonly isValid = computed(() => {
    if (!this.name().trim()) return false;
    return this.items().every(i => i.name.trim().length > 0);
  });

  /* ── Lifecycle ── */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.listId.set(id);
      this.loadList(id);
    }
  }

  /* ── Item list management ── */
  addItem(): void {
    this.items.update(list => [...list, { name: '', quantity: '' }]);
  }

  removeItem(index: number): void {
    this.items.update(list => list.filter((_, i) => i !== index));
  }

  updateItem(index: number, field: keyof GroceryItem, value: string): void {
    this.items.update(list =>
      list.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  /* ── Actions ── */
  save(): void {
    if (!this.isValid()) return;

    const dto: GroceryListDto = {
      name: this.name().trim(),
      items: this.items().filter(i => i.name.trim()),
    };

    this.saving.set(true);

    // TODO: replace with actual service call
    console.log(this.isEdit() ? 'Updating' : 'Creating', dto);

    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/grocery-lists']);
    }, 600);
  }

  cancel(): void {
    this.router.navigate(['/grocery-lists']);
  }

  /* ── Private ── */
  private loadList(id: string): void {
    // TODO: replace with actual service call
    const mock: GroceryList = {
      id,
      name: 'Weekly Essentials',
      items: [
        { name: 'Milk', quantity: '1 gal' },
        { name: 'Eggs', quantity: '1 dozen' },
        { name: 'Bread', quantity: '1 loaf' },
      ],
    };

    this.name.set(mock.name);
    this.items.set(mock.items.length ? mock.items : [{ name: '', quantity: '' }]);
  }
}
