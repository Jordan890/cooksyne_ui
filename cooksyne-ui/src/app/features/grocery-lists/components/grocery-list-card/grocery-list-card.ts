import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GroceryList } from '../../models/grocery-list.model';

export type { GroceryList };

@Component({
  selector: 'app-grocery-list-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './grocery-list-card.html',
  styleUrls: ['./grocery-list-card.scss'],
})
export class GroceryListCard {
  private router = inject(Router);

  list = input.required<GroceryList>();

  /** Emitted when the user confirms deletion */
  deleted = output<number>();

  /** Comma-separated preview of ingredient names, truncated with "…" */
  itemPreview = computed(() => {
    const names = this.list().ingredients.map(i => i.name).filter(Boolean);
    const maxLen = 60;
    let result = '';
    for (let i = 0; i < names.length; i++) {
      const next = result ? `${result}, ${names[i]}` : names[i];
      if (next.length > maxLen) {
        return result ? `${result}, …` : `${names[i].slice(0, maxLen)}…`;
      }
      result = next;
    }
    return result;
  });

  open(): void {
    if (this.list().id == null) return;
    this.router.navigate(['/grocery-lists', this.list().id, 'edit']);
  }

  /** Ask for confirmation then emit delete event */
  confirmDelete(event: Event): void {
    event.stopPropagation();
    const id = this.list().id;
    if (id == null) return;
    if (confirm(`Delete "${this.list().name}"?`)) {
      this.deleted.emit(id);
    }
  }
}
