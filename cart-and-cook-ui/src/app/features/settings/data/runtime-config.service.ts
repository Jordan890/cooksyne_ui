import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RuntimeConfig } from '../models/runtime-config.model';

export interface RuntimeDbTestResult {
  success: boolean;
  message: string;
  testToken: string | null;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/config/runtime`;

  getConfig(): Observable<RuntimeConfig> {
    return this.http.get<RuntimeConfig>(this.baseUrl);
  }

  saveConfig(config: RuntimeConfig, dbTestToken: string | null): Observable<RuntimeConfig> {
    return this.http.put<RuntimeConfig>(this.baseUrl, {
      ...config,
      dbTestToken,
    });
  }

  testDbConnection(config: RuntimeConfig): Observable<RuntimeDbTestResult> {
    return this.http.post<RuntimeDbTestResult>(`${this.baseUrl}/test-db`, {
      dbUrl: config.dbUrl,
      dbUsername: config.dbUsername,
      dbPassword: config.dbPassword,
    });
  }

  rollbackDb(): Observable<RuntimeConfig> {
    return this.http.post<RuntimeConfig>(`${this.baseUrl}/rollback-db`, {});
  }
}
