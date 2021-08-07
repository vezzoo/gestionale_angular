import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const id = this.authService.getUserId();

    if (id) {
      return next.handle(
        req.clone({ headers: req.headers.append('user', String(id)) })
      );
    } else {
      return next.handle(req);
    }
  }
}
