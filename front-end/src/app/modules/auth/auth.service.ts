import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Urls } from 'src/app/base/enums/enums';
import { ApiError } from 'src/app/base/models/apiError.model';
import { RouterService } from 'src/app/base/services/router.service';
import { User } from '../../base/models/user.model';
import { HttpClientService } from '../../base/services/httpClient.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  onUserChange = new Subject<string>();
  private user: User;

  constructor(
    private routerService: RouterService,
    private httpClientService: HttpClientService
  ) {}

  private setUser(value: User) {
    this.user = value;
    this.onUserChange.next(this.user?.username);
  }

  doLogin(
    usr: string,
    pwd: string,
    callBackSuccess?: (response: User) => void,
    callBackError?: (error: any) => void
  ): void {
    const body = {
      username: usr,
      password: pwd,
    };

    console.log('TODO DO LOGIN API CALL');
    this.setUser({
      username: 'luca',
      id: 1,
    });
    callBackSuccess(null);

    // this.httpClientService.post<User>(
    //   '/login',
    //   body,
    //   (response: User) => {
    //     if (response) {
    //       this.setUser(response);
    //       callBackSuccess(response);
    //     }
    //   },
    //   (error: { error: ApiError }) => callBackError(error?.error?.errorMessage)
    // );
  }

  doLogout(): void {
    this.setUser(null);
    this.routerService.navigate(Urls.AUTH);
  }

  getUserId(): number {
    return this.user?.id;
  }

  isUserDefined(): boolean {
    return !!(this.user?.username && this.user?.id);
  }
}
