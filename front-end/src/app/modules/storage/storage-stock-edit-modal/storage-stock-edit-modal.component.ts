import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrls } from 'src/app/base/enums/enums';
import { Product } from 'src/app/base/models/product.model';
import { TranslateErrorPipe } from 'src/app/base/pipes/translateError.pipe';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { CommonUtils } from 'src/app/base/utils/common.utils';
import { ApiError } from 'src/types/api-error';
import {
  StorageGetResponse,
  StoragePatchRequest,
  StoragePatchResponse,
} from 'src/types/storage';

@Component({
  selector: 'app-storage-stock-edit-modal',
  templateUrl: './storage-stock-edit-modal.component.html',
  styleUrls: ['./storage-stock-edit-modal.component.scss'],
})
export class StorageStockEditModalComponent implements OnInit {
  formGroup: FormGroup;
  products: Product[];

  private defaultFormValue: string;

  constructor(
    private httpClientService: HttpClientService,
    private translateErrorPipe: TranslateErrorPipe,
    public modal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({ stock: [''] });

    this.httpClientService.get<StorageGetResponse>(ApiUrls.STORAGE).subscribe(
      (response: StorageGetResponse) => {
        this.products = response?.categories
          ?.map((c) => {
            c.children.forEach((i) => (i.category = c.title));
            return c;
          })
          ?.map((c) => c.children)
          ?.reduce((accumulator, current) => current.concat(accumulator), [])
          ?.sort((a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;

            return 0;
          });

        const productFields = {};
        this.products.forEach((p) => (productFields[p.id] = [false]));

        this.formGroup = this.fb.group({
          stock: [String(0)],
          ...productFields,
        });

        this.defaultFormValue = JSON.stringify(this.formGroup.value);
      },
      (error: ApiError) => {}
    );
  }

  isValid(): boolean {
    return (
      this.defaultFormValue &&
      this.getChangedProducts().length &&
      this.formGroup?.valid &&
      JSON.stringify(this.formGroup?.value) !== this.defaultFormValue
    );
  }

  selectAll() {
    this.products.forEach((p) => this.formGroup.controls[p.id].setValue(true));
  }

  onSave() {
    const stock = CommonUtils.getFormControlValue(this.formGroup, 'stock');
    const productsIds = this.getChangedProducts().map((p) => p.id);

    // prettier-ignore
    const body: StoragePatchRequest = {
      editedItems: productsIds.map((id) => { return { id, stock }; }),
    };

    this.httpClientService
      .patch<StoragePatchResponse>(ApiUrls.STORAGE, body)
      .subscribe(
        (response: StoragePatchResponse) => {
          this.modal.close();
        },
        (error: ApiError) =>
          console.log(this.translateErrorPipe.transform(error))
      );
  }

  private getChangedProducts() {
    return this.products.filter(
      (p) => !!CommonUtils.getFormControlValue(this.formGroup, p.id)
    );
  }

  formatLeft(event: any): boolean {
    return event.charCode >= 48 && event.charCode <= 57;
  }
}
