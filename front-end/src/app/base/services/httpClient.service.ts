import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpOptions } from '../models/httpOptions.model';

@Injectable({ providedIn: 'root' })
export class HttpClientService {
  private options: HttpOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    observe: 'events',
  };

  constructor(private http: HttpClient) {}

  getUrl(url: string): string {
    return (
      environment.path +
      (environment.port !== undefined ? ':' + environment.port : '') +
      environment.optionalLayer +
      url
    );
  }

  post<T>(
    url: string,
    body: any | null,
    callBackSuccess?: (response: T) => void,
    callBackError?: (error: any) => void
  ) {
    this.subscribeToHttp(
      this.http.post<T>(this.getUrl(url), body, this.options),
      callBackSuccess,
      callBackError
    );
  }

  get<T>(
    url: string,
    callBackSuccess?: (response: T) => void,
    callBackError?: (error: any) => void
  ) {
    this.subscribeToHttp(
      this.http.get<T>(this.getUrl(url), this.options),
      callBackSuccess,
      callBackError
    );
  }

  private subscribeToHttp<T>(
    obs: Observable<HttpEvent<T>>,
    callBackSuccess: (response: T) => void,
    callBackError: (error: any) => void
  ) {
    obs.pipe(map((res) => res['body'])).subscribe(
      (response: T) => this.handleSuccess<T>(response, callBackSuccess),
      (error: any) => this.handleError<T>(error, callBackError),
      () => {}
    );
  }

  private handleSuccess<T>(
    response: T,
    callBackSuccess: (response: T) => void
  ): void {
    if (callBackSuccess) callBackSuccess(response);
  }

  private handleError<T>(error: T, callBackError: (error: any) => void): void {
    if (callBackError) callBackError(error);
    else console.log(error);
  }
}
