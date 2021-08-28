import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ApiUrls, Urls } from 'src/app/base/enums/enums';
import { CashDeskItem } from 'src/app/base/models/cashDeskItem.model';
import { Category } from 'src/app/base/models/category.model';
import { CategoryToPrint } from 'src/app/base/models/categoryToPrint.model';
import { NormalizePricePipe } from 'src/app/base/pipes/normalizePrice.pipe';
import { TranslateErrorPipe } from 'src/app/base/pipes/translateError.pipe';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { RouterService } from 'src/app/base/services/router.service';
import { CommonUtils } from 'src/app/base/utils/common.utils';
import { environment } from 'src/environments/environment';
import { ApiError } from 'src/types/api-error';
import {
  CashDeskGetResponse,
  CashDeskOrderConfirmRequest,
  CashDeskOrderConfirmResponse,
} from 'src/types/cash-desk';
import { AuthService } from '../auth/auth.service';
import { CashDeskModalComponent } from './cash-desk-modal/cash-desk-modal.component';

@Component({
  selector: 'app-cash-desk',
  templateUrl: './cash-desk.component.html',
  styleUrls: ['./cash-desk.component.scss'],
  animations: [
    // prettier-ignore
    trigger('animateScrollButton', [
      state('visible', style({
          transform: 'translateY(0)',
        })
      ),
      state('hidden', style({
        transform: 'translateY(100px)',
        })
      ),
      transition('visible <=> hidden', animate('0.2s')),
    ]),
  ],
})
export class CashDeskComponent implements OnInit, OnDestroy {
  readonly currency = environment.currency;

  categories: Category[] = [];
  cart: CashDeskItem[] = [];
  showScrollButton: boolean = false;
  formGroup: FormGroup;
  computedAmount: number;

  private sub: Subscription;

  constructor(
    private routerService: RouterService,
    private ngbModal: NgbModal,
    private decimalPipe: DecimalPipe,
    private httpClientService: HttpClientService,
    private translateErrorPipe: TranslateErrorPipe,
    private normalizePricePipe: NormalizePricePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      notes: '',
      takeAway: false,
      receivedAmount: null,
    });

    this.formGroup.controls['receivedAmount'].valueChanges.subscribe((value) =>
      this.calculateComputedAmount(value)
    );

    let url: string = ApiUrls.CASH_DESK;
    if (this.routerService.getUrl() === Urls.CASSA_BAR) {
      url += environment.barCashDeskCategories?.join(`&`);
    } else if (this.routerService.getUrl() === Urls.CASSA_ASPORTO) {
      this.formGroup.controls['takeAway'].disable();
      this.formGroup.controls['takeAway'].setValue(true);
    }

    this.httpClientService.get<CashDeskGetResponse>(
      url,
      (response: CashDeskGetResponse) => {
        const categories = response?.categories?.map((c) => {
          c.children.forEach((e) => {
            delete e.description;
            e.quantity = 0;

            return e;
          });

          return c;
        });

        environment.cashDeskCategoriesOrder.forEach((co) => {
          const cat = categories.find((c) => c.title === co);

          if (cat) this.categories.push(cat);
          else console.warn(`No category found for ${co}!`);
        });
      },
      (error: ApiError) => console.log(this.translateErrorPipe.transform(error))
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.checkIfShowScrollButton();
  }

  // prettier-ignore
  formatReceivedAmount(event: any): boolean {
    const isCharCodeOk: boolean = event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57);
    const value: string = String(this.formGroup.controls['receivedAmount']?.value);
    const isLenOk: boolean = !(value?.includes('.') && value.split('.')?.[1]?.length > 1);

    return isCharCodeOk && isLenOk;
  }

  onCardClick(
    cardTitle: string,
    isShiftPressed: boolean,
    isCtrlPressed: boolean
  ) {
    const card = this.getCardFromTitle(cardTitle);

    if (isCtrlPressed) {
      const ref = this.ngbModal.open(CashDeskModalComponent, {
        backdrop: 'static',
      });

      ref.componentInstance.min = -card.quantity;
      ref.componentInstance.max = card.stock;
      ref.result.then(
        (qta) => this.compute(card, cardTitle, isShiftPressed, qta),
        () => {}
      );
    } else {
      this.compute(card, cardTitle, isShiftPressed, 1);
    }
  }

  private compute(
    card: CashDeskItem,
    cardTitle: string,
    isShiftPressed: boolean,
    qta: number
  ) {
    if (isShiftPressed) {
      if (card.quantity > 0) {
        card.quantity -= qta;
      }
    } else if (card.quantity < card.stock) {
      card.quantity += qta;
    }

    this.updateCart(card, cardTitle.substr(0, cardTitle.indexOf('/')));
    this.calculateComputedAmount(
      this.formGroup.controls['receivedAmount'].value
    );
  }

  getTotal(): number {
    return this.cart.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
  }

  scrollToBottom() {
    const element = document.querySelector('#scrollDestionation');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  checkIfShowScrollButton() {
    this.showScrollButton = !(
      document.body.scrollHeight - (window.innerHeight + window.scrollY) <=
      10
    );
  }

  calculateComputedAmount(value: number) {
    const total = this.getTotal();
    value *= 100;

    if (value && value >= total) {
      this.computedAmount = value - total;
    } else {
      this.computedAmount = undefined;
    }
  }

  onSubmit() {
    const body: CashDeskOrderConfirmRequest = {
      cart: Object.fromEntries(this.cart.map((p) => [p.id, p.quantity])),
      notes: CommonUtils.getFormControlValue(this.formGroup, 'notes'),
      takeAway: CommonUtils.getFormControlValue(this.formGroup, 'takeAway'),
    };

    this.httpClientService.put<CashDeskOrderConfirmResponse>(
      ApiUrls.ORDER,
      body,
      (response: CashDeskOrderConfirmResponse) => {
        if (response?.code) {
          this.print(Number(response.code) || 0);
        }

        Object.keys(response?.printList).forEach((pl) => {
          console.log(`TODO PRINT CALL FOR ${pl}`);
        });
      },
      (error: ApiError) => console.log(this.translateErrorPipe.transform(error))
    );
  }

  private reset() {
    this.cart = [];
    this.ngOnInit();
  }

  private print(orderNumber: number) {
    const basePath = window.location.href.substr(
      0,
      window.location.href.indexOf('#') - 1
    );

    environment.categoriesToPrint.forEach((c: CategoryToPrint, i: number) => {
      const name = `${c.title}PrintIframe`;
      const iframeElement = document.createElement('iframe');
      iframeElement.classList.add('iframe-hidden');
      iframeElement.name = name;
      iframeElement.src = `${basePath}${environment.basePathToTemplates}/${c.path}`;
      iframeElement.onload = () => {
        const iframe = window.frames[name];
        iframe.setData(this.getDataToPrint(c.title, c.category, orderNumber));
        iframe.printBill();

        document.body.removeChild(iframeElement);

        if (i === environment.categoriesToPrint.length - 1) {
          this.reset();
        }
      };

      document.body.appendChild(iframeElement);
    });
  }

  private getDataToPrint(
    title: string,
    categoryTitle: string,
    orderNumber: number
  ) {
    let products = this.getProductsToPrint();

    if (categoryTitle) {
      products = products.filter((p) => p.category === categoryTitle);
    }

    return {
      title: title || environment.title,
      orderNumber: this.decimalPipe
        .transform(orderNumber, '4.0')
        .replace(/,/g, ''),
      total: this.formatPrice(this.getTotal()),
      products: products,
    };
  }

  private formatPrice(value: number): string {
    return this.normalizePricePipe.transform(value) + this.currency;
  }

  private getProductsToPrint() {
    return this.cart.map((e) => {
      return {
        description: e.title,
        category: e.category,
        quantity: `${e.quantity}x`,
        price: this.formatPrice(e.price),
      };
    });
  }

  private updateCart(newElement: CashDeskItem, categoryTitle: string) {
    const c = this.cart.find((c) => c.title === newElement.title);

    if (newElement.quantity > 0) {
      if (c) {
        c.quantity = newElement.quantity;
        c.category = categoryTitle;
      } else {
        this.cart.push({
          ...newElement,
          category: categoryTitle,
        });
      }
    } else if (newElement.quantity === 0 && c) {
      this.cart.splice(this.cart.indexOf(c), 1);
    }
  }

  private getCardFromTitle(cardTitle: string) {
    const split = cardTitle.split('/');
    const category = split[0];
    const card = split[1];

    return <CashDeskItem>(
      this.categories
        ?.find((cat) => cat.title === category)
        ?.children?.find((c) => c.title === card)
    );
  }
}
