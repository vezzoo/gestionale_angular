import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../modules/auth/auth.service';
import { Urls } from '../../enums/enums';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  title;

  username: string = null;

  private sub: Subscription;

  constructor(
    private authService: AuthService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.title = environment.title);

    this.sub = this.authService.onUserChange.subscribe(
      (user) => (this.username = user)
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  doLogout(): void {
    this.authService.doLogout();
    this.username = null;
  }

  goToHome(): void {
    this.routerService.navigate(Urls.HOME);
  }

  isHome(): boolean {
    return this.routerService.getUrl() === Urls.HOME;
  }
}
