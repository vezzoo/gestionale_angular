import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/base/utils/common.utils';
import { FocusUtils } from 'src/app/base/utils/focus.utils';

@Component({
  selector: 'app-cash-desk-modal',
  templateUrl: './cash-desk-modal.component.html',
  styleUrls: ['./cash-desk-modal.component.scss'],
})
export class CashDeskModalComponent implements OnInit, AfterViewInit {
  @Input() min: number;
  @Input() max: number;

  @ViewChild('qta') qta: ElementRef;

  formGroup: FormGroup;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      qta: [null, [Validators.min(this.min || 1), Validators.max(this.max)]],
    });
  }

  ngAfterViewInit() {
    FocusUtils.focusOnField(this.qta);
  }

  isValid(): boolean {
    const value = Number(
      CommonUtils.getFormControlValue(this.formGroup, 'qta')
    );
    return this.formGroup?.valid && !!value;
  }

  onSave() {
    if (this.isValid()) {
      this.modal.close(
        Number(CommonUtils.getFormControlValue(this.formGroup, 'qta'))
      );
    }
  }

  format(event: any): boolean {
    return (
      event.charCode === 45 || (event.charCode >= 48 && event.charCode <= 57)
    );
  }
}
