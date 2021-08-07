import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Urls } from '../enums/enums';

@Injectable({ providedIn: 'root' })
export class RouterService {
  constructor(private router: Router) {}

  navigate(url: Urls): void {
    this.router.navigateByUrl(`/${url}`);
  }
}
