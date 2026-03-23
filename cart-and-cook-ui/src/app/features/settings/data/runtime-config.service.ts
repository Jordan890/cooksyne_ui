import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RuntimeConfig } from '../models/runtime-config.model';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/config/runtime`;

  getConfig(): Observable<RuntimeConfig> {
    return this.http.get<RuntimeConfig>(this.baseUrl);
  }

  saveConfig(config: RuntimeConfig): Observable<RuntimeConfig> {
    return this.http.put<RuntimeConfig>(this.baseUrl, config);
  }
}
