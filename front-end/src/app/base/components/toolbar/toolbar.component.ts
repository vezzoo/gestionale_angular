import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, of, Subscription } from 'rxjs';
import { first, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiError } from 'src/types/api-error';
import { PrinterStatusResponse } from 'src/types/printers';
import { AuthService } from '../../../modules/auth/auth.service';
import { Urls } from '../../enums/enums';
import { ToolbarFunction } from '../../models/function.model';
import { ConfigurationsService } from '../../services/configurations.service';
import { HttpClientService } from '../../services/httpClient.service';
import { RouterService } from '../../services/router.service';
import { SessionService } from '../../services/session.service';
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
  errors: Array<string>;

  private subs: Array<Subscription> = [];
  private printersStatusInterval: any;

  constructor(
    private authService: AuthService,
    private configurationsService: ConfigurationsService,
    private toolbarService: ToolbarService,
    private routerService: RouterService,
    private httpClientService: HttpClientService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.configurationsService.onEnvironmentReady.subscribe(() => {
        this.title = environment.title;
      })
    );

    this.subs.push(
      this.toolbarService.addToolbarFunction.subscribe((f) => {
        this.functions.push(f);
      })
    );

    this.subs.push(
      this.toolbarService.removeToolbarFunction.subscribe((name) => {
        const index = this.functions.findIndex((f) => f.name === name);
        this.functions.splice(index, 1);
      })
    );

    this.subs.push(
      this.authService.onUserChange.subscribe((user) => {
        this.username = user;
      })
    );

    this.subs.push(
      this.sessionService.listenToErrorsChanges().subscribe((errors) => {
        this.errors = errors;
      })
    );

    this.subs.push(
      this.toolbarService.startCheckingPrintersStatus.subscribe(() => {
        if (this.printersStatusInterval) {
          clearInterval(this.printersStatusInterval);
        }

        this.checkPrintersStatus();
        this.printersStatusInterval = setInterval(
          () => this.checkPrintersStatus(),
          1000 * 60
        );
      })
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

  private checkPrintersStatus() {
    const printersApis = this.sessionService.getPrintersApis();
    const printersCheck = printersApis?.map((url) => {
      return this.httpClientService
        .get<PrinterStatusResponse>(url)
        .pipe(timeout(1000 * 2));
    });

    forkJoin(printersCheck?.length ? printersCheck : of(null))
      .pipe(first())
      .subscribe(
        (response: Array<PrinterStatusResponse>) => {
          this.sessionService.resetPrintersError();
        },
        (error: ApiError) => {
          this.sessionService.setPrintersError();
        }
      );
  }

  doLogout(): void {
    clearInterval(this.printersStatusInterval);
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
