import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  constructor(private http: HttpClient) {}

  getUrl(url: string): string {
    if (url.includes('http')) {
      return url;
    } else {
      return (
        environment.path +
        (environment.port !== undefined ? ':' + environment.port : '') +
        environment.optionalLayer +
        url
      );
    }
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.getUrl(url), body);
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(this.getUrl(url), body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(this.getUrl(url), body);
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(this.getUrl(url));
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(url));
  }
}
