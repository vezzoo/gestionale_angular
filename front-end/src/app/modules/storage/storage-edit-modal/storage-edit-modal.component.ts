import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrls } from 'src/app/base/enums/enums';
import { NormalizePricePipe } from 'src/app/base/pipes/normalizePrice.pipe';
import { TranslateErrorPipe } from 'src/app/base/pipes/translateError.pipe';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { CommonUtils } from 'src/app/base/utils/common.utils';
import { ApiError } from 'src/types/api-error';
import {
  StoragePatchRequest,
  StoragePatchResponse,
  StoragePutRequest,
  StoragePutResponse,
} from 'src/types/storage';

@Component({
  selector: 'app-storage-edit-modal',
  templateUrl: './storage-edit-modal.component.html',
  styleUrls: ['./storage-edit-modal.component.scss'],
})
export class StorageEditModalComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() description: string;
  @Input() price: number;
  @Input() stock: number;
  @Input() category: string;
  @Input() position: number;

  formGroup: FormGroup;
  categories: { value: string; viewValue: string }[];

  private defaultFormValue: string;

  constructor(
    private httpClientService: HttpClientService,
    private translateErrorPipe: TranslateErrorPipe,
    private normalizePricePipe: NormalizePricePipe,
    public modal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      title: this.title,
      description: this.description,
      price: [
        this.normalizePricePipe.transform(this.price || 0),
        Validators.min(0),
      ],
      stock: [String(this.stock || 0), Validators.min(0)],
      category: this.category,
      position: { value: this.position, disabled: this.position == null },
    });

    this.httpClientService.get<Array<string>>(ApiUrls.CATEGORIES).subscribe(
      (response: Array<string>) => {
        this.categories = response.map((e) => {
          return {
            value: e,
            viewValue: e.charAt(0).toUpperCase() + e.substr(1).toLowerCase(),
          };
        });
      },
      (error: ApiError) => {}
    );

    this.defaultFormValue = JSON.stringify(this.formGroup.value);
  }

  isValid(): boolean {
    return (
      this.formGroup?.valid &&
      JSON.stringify(this.formGroup?.value) !== this.defaultFormValue
    );
  }

  onSave() {
    const title = CommonUtils.getFormControlValue(this.formGroup, 'title');
    const description = CommonUtils.getFormControlValue(
      this.formGroup,
      'description'
    );
    const price = CommonUtils.getFormControlValue(this.formGroup, 'price');
    const stock = CommonUtils.getFormControlValue(this.formGroup, 'stock');
    const category = CommonUtils.getFormControlValue(
      this.formGroup,
      'category'
    );
    const position = CommonUtils.getFormControlValue(
      this.formGroup,
      'position'
    );

    if (this.id) {
      const body: StoragePatchRequest = {
        editedItems: [
          {
            id: this.id,
            title: title !== this.title ? title : undefined,
            description:
              description !== this.description ? description : undefined,
            price:
              Math.round(Number(price) * 100) !== this.price
                ? Math.round(Number(price) * 100)
                : undefined,
            stock: Number(stock) !== this.stock ? Number(stock) : undefined,
            category: category !== this.category ? category : undefined,
            position:
              Number(position) !== this.position ? Number(position) : undefined,
          },
        ],
      };

      this.httpClientService
        .patch<StoragePatchResponse>(ApiUrls.STORAGE, body)
        .subscribe(
          (response: StoragePatchResponse) => {
            if (response?.[this.id]?.status) this.modal.close();
          },
          (error: ApiError) =>
            console.log(this.translateErrorPipe.transform(error))
        );
    } else {
      const body: StoragePutRequest = {
        title: title,
        description: description,
        price: Math.round(Number(price) * 100),
        stock: Number(stock),
        category: category,
      };

      this.httpClientService
        .put<StoragePutResponse>(ApiUrls.STORAGE, body)
        .subscribe(
          (response: StoragePutResponse) => {
            if (response?.status) this.modal.close();
          },
          (error: ApiError) =>
            console.log(this.translateErrorPipe.transform(error))
        );
    }
  }

  // prettier-ignore
  formatAmount(event: any): boolean {
    const isCharCodeOk: boolean = event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57);
    const value: string = String(this.formGroup.controls['price']?.value);
    const isLenOk: boolean = !(value?.includes('.') && value.split('.')?.[1]?.length > 1);

    return isCharCodeOk && isLenOk;
  }

  formatLeft(event: any): boolean {
    return event.charCode >= 48 && event.charCode <= 57;
  }
}
