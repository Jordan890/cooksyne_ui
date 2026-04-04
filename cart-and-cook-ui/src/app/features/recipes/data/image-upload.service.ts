import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/images`;

  /** Upload an image file and return the server-relative URL. */
  upload(image: File): Observable<string> {
    const form = new FormData();
    form.append('image', image);
    return this.http
      .post<{ imageUrl: string }>(this.baseUrl, form)
      .pipe(map(res => res.imageUrl));
  }

  /** Resolve a relative image URL to an absolute one. */
  resolveUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${environment.apiUrl}${imageUrl}`;
  }
}
