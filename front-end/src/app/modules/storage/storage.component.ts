import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarService } from 'src/app/base/components/toolbar/toolbar.service';
import { ApiUrls } from 'src/app/base/enums/enums';
import { Product } from 'src/app/base/models/product.model';
import { TranslateErrorPipe } from 'src/app/base/pipes/translateError.pipe';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { environment } from 'src/environments/environment';
import { ApiError } from 'src/types/api-error';
import { StorageGetResponse } from 'src/types/storage';
import { StorageEditModalComponent } from './storage-edit-modal/storage-edit-modal.component';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'title',
    'description',
    'price',
    'stock',
    'category',
    'actions',
  ];
  dataSource: MatTableDataSource<unknown>;

  currency = environment.currency;

  constructor(
    private translateErrorPipe: TranslateErrorPipe,
    private ngbModal: NgbModal,
    private toolbarService: ToolbarService,
    private httpClientService: HttpClientService
  ) {
    this.toolbarService.addFunction({
      name: 'add',
      onClick: () => {
        this.openModal(null);
      },
    });
  }

  ngOnInit(): void {
    this.httpClientService.get<StorageGetResponse>(ApiUrls.STORAGE).subscribe(
      (response: StorageGetResponse) => {
        const products: Product[] = (
          [].concat(
            ...response?.categories
              ?.map((c) => {
                c.children.forEach((i) => (i.category = c.title));
                return c;
              })
              ?.map((c) => c.children)
          ) as Product[]
        )
          .sort((a, b) => {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;

            return 0;
          })
          .sort((a, b) => {
            if (a.stock < b.stock) return -1;
            if (a.stock > b.stock) return 1;

            return 0;
          });

        this.dataSource = new MatTableDataSource(products);
      },
      (error: ApiError) => {}
    );
  }

  ngOnDestroy(): void {
    this.toolbarService.removeFunction('add');
  }

  getRowStatus(stock: number): 'warning' | 'empty' | 'none' {
    if (stock === 0) {
      return 'empty';
    } else if (stock < environment.stockWarningLimit) {
      return 'warning';
    } else {
      return 'none';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(product: Product) {
    this.openModal(product);
  }

  onDelete(event: any, id: string) {
    if (!event.ctrlKey) {
      console.log('CTRL + click expected');
    } else {
      this.httpClientService
        .delete<Object>(`${ApiUrls.STORAGE}${id}`)
        .subscribe(
          (response: Object) => this.ngOnInit(),
          (error: ApiError) =>
            console.log(this.translateErrorPipe.transform(error))
        );
    }
  }

  private openModal(product: Product) {
    const ref = this.ngbModal.open(StorageEditModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    ref.componentInstance.id = product?.id;
    ref.componentInstance.title = product?.title;
    ref.componentInstance.description = product?.description;
    ref.componentInstance.price = product?.price;
    ref.componentInstance.stock = product?.stock;
    ref.componentInstance.category = product?.category;
    ref.result.then(
      () => this.ngOnInit(),
      () => {}
    );
  }
}
