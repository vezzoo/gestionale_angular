import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../modules/auth/auth.service';
import { Urls } from '../../enums/enums';
import { ConfigurationsService } from '../../services/configurations.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  title: string;

  username: string = null;

  private subs: Array<Subscription> = [];

  constructor(
    private authService: AuthService,
    private configurationsService: ConfigurationsService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.configurationsService.onEnvironmentReady.subscribe(
        (e) => (this.title = environment.title)
      )
    );

    this.subs.push(
      this.authService.onUserChange.subscribe((user) => (this.username = user))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub?.unsubscribe());
    this.subs = [];
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
