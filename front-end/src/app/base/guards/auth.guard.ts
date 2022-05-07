import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/auth.service';
import { Urls } from '../enums/enums';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // prettier-ignore
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.isUserDefined() || this.router.createUrlTree([Urls.AUTH]);
  }
}
