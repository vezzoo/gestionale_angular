import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsComponent } from './reports.component';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private ngbModal: NgbModal) {}

  openModal() {
    this.ngbModal.open(ReportsComponent, {
      size: 'xl',
      backdrop: 'static',
    });
  }
}
