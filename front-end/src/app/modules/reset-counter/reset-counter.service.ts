import { Injectable } from '@angular/core';
import { ApiUrls } from 'src/app/base/enums/enums';
import { SnackBarService } from 'src/app/base/services/snackbar.service';
import { ApiError } from 'src/types/api-error';
import { OrderResetPostResponse } from 'src/types/cash-desk';
import { HttpClientService } from '../../base/services/httpClient.service';

@Injectable({ providedIn: 'root' })
export class ResetCounterService {
  constructor(
    private httpClientService: HttpClientService,
    private snackBarService: SnackBarService
  ) {}

  reset(): void {
    const body = {};

    this.httpClientService.post<OrderResetPostResponse>(
      ApiUrls.RESET_ORDER,
      body,
      (response: OrderResetPostResponse) => {
        if (response?.status) this.snackBarService.openSuccessSnackBar();
      },
      (error: ApiError) => {}
    );
  }
}
