import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../modules/auth/auth.service';
import { Urls } from '../../enums/enums';
import { ToolbarFunction } from '../../models/function.model';
import { ConfigurationsService } from '../../services/configurations.service';
import { RouterService } from '../../services/router.service';
import { CommonUtils } from '../../utils/common.utils';
import { ToolbarService } from './toolbar.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  title: string;
  username: string = null;
  functions: ToolbarFunction[] = [];
  time: string;

  private subs: Array<Subscription> = [];

  constructor(
    private authService: AuthService,
    private configurationsService: ConfigurationsService,
    private toolbarService: ToolbarService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.configurationsService.onEnvironmentReady.subscribe(
        (e) => (this.title = environment.title)
      )
    );

    this.subs.push(
      this.toolbarService.addToolbarFunction.subscribe((f) =>
        this.functions.push(f)
      )
    );

    this.subs.push(
      this.toolbarService.removeToolbarFunction.subscribe((name) =>
        this.functions.splice(
          this.functions.indexOf(this.functions.find((f) => f.name === name)),
          1
        )
      )
    );

    this.subs.push(
      this.authService.onUserChange.subscribe((user) => (this.username = user))
    );

    this.updateTime();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub?.unsubscribe());
    this.subs = [];
  }

  private updateTime(diff: number = 0) {
    setTimeout(() => {
      const date = new Date();
      // prettier-ignore
      this.time = `${CommonUtils.formatNumberWithStartingZero(date.getHours())}:${CommonUtils.formatNumberWithStartingZero(date.getMinutes())}`

      this.updateTime(60 - date.getSeconds());
    }, diff * 1000);
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
