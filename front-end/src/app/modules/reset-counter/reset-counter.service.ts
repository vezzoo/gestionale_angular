import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrls } from 'src/app/base/enums/enums';
import { SnackBarService } from 'src/app/base/services/snackbar.service';
import { ApiError } from 'src/types/api-error';
import { OrderResetPostResponse } from 'src/types/cash-desk';
import { HttpClientService } from '../../base/services/httpClient.service';
import { ResetCounterModalComponent } from './reset-counter-modal/reset-counter-modal.component';

@Injectable({ providedIn: 'root' })
export class ResetCounterService {
  constructor(
    private ngbModal: NgbModal,
    private httpClientService: HttpClientService,
    private snackBarService: SnackBarService
  ) {}

  reset(): void {
    this.ngbModal
      .open(ResetCounterModalComponent, { size: 'lg', backdrop: 'static' })
      .result.then(
        (result) => {
          if (result) {
            this.httpClientService
              .post<OrderResetPostResponse>(ApiUrls.RESET_ORDER, {})
              .subscribe(
                (response: OrderResetPostResponse) => {
                  if (response?.status)
                    this.snackBarService.openSuccessSnackBar();
                },
                (error: ApiError) => {}
              );
          }
        },
        () => {}
      );
  }
}
