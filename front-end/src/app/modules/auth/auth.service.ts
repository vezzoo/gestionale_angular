import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiUrls, Urls } from 'src/app/base/enums/enums';
import { TranslateErrorPipe } from 'src/app/base/pipes/translateError.pipe';
import { RouterService } from 'src/app/base/services/router.service';
import { ApiError } from 'src/types/api-error';
import { LoginGetRequest, LoginGetResponse } from 'src/types/login';
import { HttpClientService } from '../../base/services/httpClient.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  onUserChange = new Subject<string>();
  isUserLefthanded: boolean;
  private user: string;
  private tokenJWT: string;

  constructor(
    private routerService: RouterService,
    private httpClientService: HttpClientService,
    private translateErrorPipe: TranslateErrorPipe
  ) {}

  private setUser(value: string, isUserLefthanded: boolean) {
    this.user = value;
    this.isUserLefthanded = isUserLefthanded;
    this.onUserChange.next(this.user);
  }

  doLogin(
    usr: string,
    pwd: string,
    callBackSuccess?: (response: LoginGetResponse) => void,
    callBackError?: (error: any) => void
  ): void {
    const body: LoginGetRequest = {
      username: usr,
      password: pwd,
    };

    this.httpClientService.post<LoginGetResponse>(
      ApiUrls.LOGIN,
      body,
      (response: LoginGetResponse) => {
        if (response) {
          this.setUser(response.username, response.isLefthanded);
          this.tokenJWT = response.token;
          callBackSuccess(response);
        }
      },
      (error: ApiError) =>
        callBackError(this.translateErrorPipe.transform(error))
    );
  }

  doLogout(): void {
    this.setUser(null, null);
    this.tokenJWT = null;

    this.routerService.navigate(Urls.AUTH);
  }

  getTokenJWT(): string {
    return this.tokenJWT;
  }

  isUserDefined(): boolean {
    return !!(this.user && this.tokenJWT);
  }
}
