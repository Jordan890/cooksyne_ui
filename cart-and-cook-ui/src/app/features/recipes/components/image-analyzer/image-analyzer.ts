import { Component, inject, output, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../data/ai.service';
import { RecipeAnalysis } from '../../models/recipe.model';

/** Max dimension (px) for OCR images — keeps file size well under server limits. */
const OCR_MAX_DIMENSION = 2048;
const OCR_JPEG_QUALITY = 0.85;

function resizeImage(file: File, maxDim: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      if (width <= maxDim && height <= maxDim) {
        resolve(file); // already small enough
        return;
      }
      const scale = maxDim / Math.max(width, height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        blob => {
          if (!blob) { reject(new Error('Canvas toBlob failed')); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

@Component({
  selector: 'app-image-analyzer',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
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

  readonly dishTitle = signal('');
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly analyzing = signal(false);
  readonly error = signal<string | null>(null);

  /** Can generate from dish name. */
  readonly canAnalyzeFood = computed(() => {
    return !!this.dishTitle().trim() && !this.analyzing();
  });

  /** Can scan recipe image. */
  readonly canAnalyzeRecipe = computed(() => {
    return !!this.selectedFile() && !this.analyzing();
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

  analyzeFood(): void {
    const title = this.dishTitle().trim();
    if (!title) return;

    this.analyzing.set(true);
    this.error.set(null);

    this.aiService.analyzeFood(title).subscribe({
      next: result => {
        this.analyzed.emit(result);
        this.analyzing.set(false);
      },
      error: () => {
        this.error.set('Failed to generate ingredients. Please try again.');
        this.analyzing.set(false);
      },
    });
  }

  async analyzeRecipe(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    this.analyzing.set(true);
    this.error.set(null);

    try {
      const resized = await resizeImage(file, OCR_MAX_DIMENSION, OCR_JPEG_QUALITY);
      this.aiService.analyzeRecipe(resized).subscribe({
        next: result => {
          this.analyzed.emit(result);
          this.analyzing.set(false);
        },
        error: () => {
          this.error.set('Failed to scan recipe. Please try a clearer image.');
          this.analyzing.set(false);
        },
      });
    } catch {
      this.error.set('Failed to process image. Please try a different file.');
      this.analyzing.set(false);
    }
  }

  clear(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.error.set(null);
  }
}
