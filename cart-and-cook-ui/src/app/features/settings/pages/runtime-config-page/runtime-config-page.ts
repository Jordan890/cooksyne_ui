import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { forkJoin } from 'rxjs';
import { RuntimeConfigService } from '../../data/runtime-config.service';
import { RuntimeConfig } from '../../models/runtime-config.model';

@Component({
  selector: 'app-runtime-config-page',
  standalone: true,
  imports: [
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './runtime-config-page.html',
  styleUrls: ['./runtime-config-page.scss'],
})
export class RuntimeConfigPage implements OnInit {
  private runtimeConfigService = inject(RuntimeConfigService);

  readonly providerOptions = [
    { value: 'ollama', label: 'Ollama' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'bedrock', label: 'AWS Bedrock' },
    { value: 'huggingface', label: 'Hugging Face' },
  ];

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly saveMessage = signal<string | null>(null);

  /** Suggested model names per provider, fetched from backend. */
  providerModels: Record<string, string[]> = {};

  config: RuntimeConfig = {
    aiProvider: '',
    ollamaBaseUrl: '',
    ollamaModel: '',
    openAiModel: '',
    awsRegion: '',
    bedrockModelId: '',
    huggingFaceModel: '',
  };

  ngOnInit(): void {
    forkJoin({
      config: this.runtimeConfigService.getConfig(),
      models: this.runtimeConfigService.getModels(),
    }).subscribe({
      next: ({ config, models }) => {
        this.config = config;
        this.providerModels = models.models ?? {};
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load runtime config', err);
        this.loading.set(false);
      },
    });
  }

  /** Get suggested model names for a provider. */
  modelOptions(provider: string): string[] {
    return this.providerModels[provider] ?? [];
  }

  save(): void {
    this.saving.set(true);
    this.saveMessage.set(null);

    this.runtimeConfigService.saveConfig(this.config).subscribe({
      next: cfg => {
        this.config = cfg;
        this.saving.set(false);
        this.saveMessage.set('AI configuration saved.');
      },
      error: err => {
        console.error('Failed to save runtime config', err);
        this.saving.set(false);
        this.saveMessage.set(err?.error?.error || 'Failed to save configuration.');
      },
    });
  }

  canSave(): boolean {
    return !this.saving();
  }

  selectedProvider(): string {
    return this.config.aiProvider.trim().toLowerCase();
  }
}
