import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersManagementComponent } from './users-management.component';

@Injectable({ providedIn: 'root' })
export class UsersManagementService {
  constructor(private ngbModal: NgbModal) {}

  openModal() {
    this.ngbModal.open(UsersManagementComponent, {
      size: 'xl',
      backdrop: 'static',
    });
  }
}
