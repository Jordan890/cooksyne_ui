import { Component, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
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
    FormsModule,
  ],
  templateUrl: './image-analyzer.html',
  styleUrls: ['./image-analyzer.scss'],
})
export class ImageAnalyzer {
  private aiService = inject(AiService);

  /** Emitted when the AI returns a successful analysis. */
  analyzed = output<RecipeAnalysis>();

  readonly analysisType = signal<AnalysisType>('food');
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly analyzing = signal(false);
  readonly error = signal<string | null>(null);

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
    const file = this.selectedFile();
    if (!file) return;

    this.analyzing.set(true);
    this.error.set(null);

    const call =
      this.analysisType() === 'food'
        ? this.aiService.analyzeFood(file)
        : this.aiService.analyzeRecipe(file);

    call.subscribe({
      next: result => {
        this.analyzed.emit(result);
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
