import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reset-counter-modal',
  templateUrl: './reset-counter-modal.component.html',
  styleUrls: ['./reset-counter-modal.component.scss'],
})
export class ResetCounterModalComponent {
  constructor(public modal: NgbActiveModal) {}

  close(result: boolean) {
    this.modal.close(result);
  }
}
