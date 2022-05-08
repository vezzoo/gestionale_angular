import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor as AngularHttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { TranslateErrorPipe } from '../pipes/translateError.pipe';
import { SnackBarService } from '../services/snackbar.service';

@Injectable()
export class HttpInterceptor implements AngularHttpInterceptor {
  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private translateErrorPipe: TranslateErrorPipe
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // prettier-ignore
    let headers = this.setHeader(req.headers, 'Content-Type', 'application/json');
    const id = this.authService.getTokenJWT();

    if (id) {
      headers = this.setHeader(headers, 'Authorization', String(id));
    }

    return next.handle(req.clone({ headers })).pipe(
      catchError((error) => {
        console.error(error.message);

        const errorMessage = this.translateErrorPipe.transform(error.error);
        this.snackBarService.openErrorSnackBar(errorMessage);

        return throwError(error);
      })
    );
  }

  private setHeader(
    headers: HttpHeaders,
    name: string,
    value: string | string[]
  ): HttpHeaders {
    return headers.set(name, value);
  }
}
