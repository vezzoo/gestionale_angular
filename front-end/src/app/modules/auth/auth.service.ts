import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Urls } from 'src/app/base/enums/enums';
import { RouterService } from 'src/app/base/services/router.service';
import { LoginGetRequest, LoginGetResponse } from 'src/types/login';
import { HttpClientService } from '../../base/services/httpClient.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  onUserChange = new Subject<string>();
  private user: string;
  private tokenJWT: string;

  constructor(
    private routerService: RouterService,
    private httpClientService: HttpClientService
  ) {}

  private setUser(value: string) {
    this.user = value;
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

    console.log('TODO DO LOGIN API CALL');
    this.setUser('luca');
    this.tokenJWT = 'questoeunbellixximotokentgeivuti';
    callBackSuccess(null);

    // this.httpClientService.post<LoginGetResponse>(
    //   '/login',
    //   body,
    //   (response: LoginGetResponse) => {
    //     if (response) {
    //       this.setUser(response.username);
    //       this.tokenJWT = response.token;
    //       callBackSuccess(response);
    //     }
    //   },
    //   (error: { error: ApiError }) => callBackError(error?.error?.errorMessage)
    // );
  }

  doLogout(): void {
    this.setUser(null);
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
