import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatCheckboxModule,
  ],
  templateUrl: './runtime-config-page.html',
  styleUrls: ['./runtime-config-page.scss'],
})
export class RuntimeConfigPage implements OnInit {
  private runtimeConfigService = inject(RuntimeConfigService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly saveMessage = signal<string | null>(null);

  config: RuntimeConfig = {
    dbUrl: '',
    dbUsername: '',
    dbPassword: '',
    oauth2IssuerUri: '',
    port: '',
    autoRestartOnConfigSave: true,
    aiProvider: '',
    ollamaBaseUrl: '',
    ollamaModel: '',
    openAiApiKey: '',
    openAiModel: '',
    awsRegion: '',
    bedrockModelId: '',
    huggingFaceApiKey: '',
    huggingFaceModel: '',
    restartRequired: true,
    restartRequiredKeys: [],
  };

  ngOnInit(): void {
    this.runtimeConfigService.getConfig().subscribe({
      next: cfg => {
        this.config = cfg;
        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load runtime config', err);
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.saveMessage.set(null);

    this.runtimeConfigService.saveConfig(this.config).subscribe({
      next: cfg => {
        this.config = cfg;
        this.saving.set(false);
        if (cfg.restartRequired && cfg.autoRestartOnConfigSave) {
          this.saveMessage.set('Configuration saved. Restart triggered automatically.');
        } else if (cfg.restartRequired) {
          this.saveMessage.set('Configuration saved. Restart runtime for changes to take effect.');
        } else {
          this.saveMessage.set('Configuration saved. No restart required.');
        }
      },
      error: err => {
        console.error('Failed to save runtime config', err);
        this.saving.set(false);
        this.saveMessage.set('Failed to save configuration.');
      },
    });
  }
}
