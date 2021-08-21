import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiError } from 'src/types/api-error';
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
    callBackError?: (error: ApiError) => void
  ) {
    this.subscribeToHttp(
      this.http.post<T>(this.getUrl(url), body, this.options),
      callBackSuccess,
      callBackError
    );
  }

  patch<T>(
    url: string,
    body: any | null,
    callBackSuccess?: (response: T) => void,
    callBackError?: (error: ApiError) => void
  ) {
    this.subscribeToHttp(
      this.http.patch<T>(this.getUrl(url), body, this.options),
      callBackSuccess,
      callBackError
    );
  }

  put<T>(
    url: string,
    body: any | null,
    callBackSuccess?: (response: T) => void,
    callBackError?: (error: ApiError) => void
  ) {
    this.subscribeToHttp(
      this.http.put<T>(this.getUrl(url), body, this.options),
      callBackSuccess,
      callBackError
    );
  }

  get<T>(
    url: string,
    callBackSuccess?: (response: T) => void,
    callBackError?: (error: ApiError) => void
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
    callBackError: (error: ApiError) => void
  ) {
    obs.pipe(map((res) => res['body'])).subscribe(
      (response: T) => this.handleSuccess<T>(response, callBackSuccess),
      (error: { error: ApiError }) =>
        this.handleError(error.error, callBackError),
      () => {}
    );
  }

  private handleSuccess<T>(
    response: T,
    callBackSuccess: (response: T) => void
  ): void {
    if (callBackSuccess) callBackSuccess(response);
  }

  private handleError(
    error: ApiError,
    callBackError: (error: ApiError) => void
  ): void {
    console.error(error.message);

    if (callBackError) callBackError(error);
    else console.log(error);
  }
}
