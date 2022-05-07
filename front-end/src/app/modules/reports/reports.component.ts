import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrls } from 'src/app/base/enums/enums';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { CommonUtils } from 'src/app/base/utils/common.utils';
import { environment } from 'src/environments/environment';
import { ApiError } from 'src/types/api-error';
import { ReportsGetResponse } from 'src/types/reports';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  file: string;
  printing: boolean = true;

  constructor(
    private httpClientService: HttpClientService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.onSubmit();
  }

  onSubmit(): void {
    const date = Math.round(new Date().getTime() / 1000);
    const timestamp = date - environment.reportsHourDifference * 3600;

    this.httpClientService.get<ReportsGetResponse>(
      `${ApiUrls.REPORTS}?from=${timestamp * 1000}`,
      (response: ReportsGetResponse) => {
        this.download(response?.data);
      },
      (error: ApiError) => {}
    );
  }

  private download(data: string) {
    const universalBOM = '\uFEFF';
    const a = window.document.createElement('a');
    const date = new Date();
    // prettier-ignore
    const stringDate = `${CommonUtils.formatNumberWithStartingZero(date.getDate())}-${CommonUtils.formatNumberWithStartingZero(date.getMonth() + 1)}-${date.getFullYear()}`;
    // prettier-ignore
    const stringHour = `${CommonUtils.formatNumberWithStartingZero(date.getHours())},${CommonUtils.formatNumberWithStartingZero(date.getMinutes())}`;
    this.file = `Report_${stringDate}_${stringHour}.csv`;

    a.setAttribute(
      'href',
      'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + data)
    );
    a.setAttribute('download', this.file);
    window.document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.document.body.removeChild(a);
      this.printing = false;
    }, 200);
  }
}
