import { Component, inject, output, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../data/ai.service';
import { RecipeAnalysis } from '../../models/recipe.model';

export type AnalysisType = 'food' | 'recipe';

@Component({
  selector: 'app-image-analyzer',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './image-analyzer.html',
  styleUrls: ['./image-analyzer.scss'],
})
export class ImageAnalyzer {
  private aiService = inject(AiService);

  /** Emitted when the AI returns a successful analysis. */
  analyzed = output<RecipeAnalysis>();

  /** Emitted with the selected file when a food (dish) analysis succeeds. */
  foodImageAnalyzed = output<File>();

  readonly analysisType = signal<AnalysisType>('food');
  readonly dishTitle = signal('');
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly analyzing = signal(false);
  readonly error = signal<string | null>(null);

  /** At least a title or an image must be provided. */
  readonly canAnalyze = computed(() => {
    return !!(this.dishTitle().trim() || this.selectedFile()) && !this.analyzing();
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
    this.error.set(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  analyze(): void {
    const file = this.selectedFile() ?? undefined;
    const title = this.dishTitle().trim() || undefined;
    if (!file && !title) return;

    this.analyzing.set(true);
    this.error.set(null);

    const call =
      this.analysisType() === 'food'
        ? this.aiService.analyzeFood(file, title)
        : this.aiService.analyzeRecipe(file, title);

    call.subscribe({
      next: result => {
        this.analyzed.emit(result);
        if (this.analysisType() === 'food' && file) {
          this.foodImageAnalyzed.emit(file);
        }
        this.analyzing.set(false);
      },
      error: () => {
        this.error.set('Analysis failed. Please try again.');
        this.analyzing.set(false);
      },
    });
  }

  clear(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.error.set(null);
  }
}
