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
import { Subscription } from 'rxjs';
import { CashDeskItem } from 'src/app/base/models/cashDeskItem.model';
import { Category } from 'src/app/base/models/category.model';
import { CategoryToPrint } from 'src/app/base/models/categoryToPrint.model';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { RouterService } from 'src/app/base/services/router.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-cash-desk',
  templateUrl: './cash-desk.component.html',
  styleUrls: ['./cash-desk.component.scss'],
  providers: [DecimalPipe],
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
    private httpService: HttpClientService,
    private routerService: RouterService,
    private authService: AuthService,
    private decimalPipe: DecimalPipe,
    fb: FormBuilder
  ) {
    this.formGroup = fb.group({
      notes: '',
      takeAway: false,
      receivedAmount: null,
    });

    this.formGroup.controls['receivedAmount'].valueChanges.subscribe((value) =>
      this.calculateComputedAmount(value)
    );
  }

  ngOnInit(): void {
    console.log('TODO CALL CASH-DESK');

    const response: Category[] = [
      {
        title: 'Cucina',
        childrens: [
          {
            id: 'foo',
            title: 'Panino e salamella',
            price: 2.5,
            quantity: 0,
            left: 100,
          },
          {
            id: 'foo',
            title: 'Patatine',
            price: 2,
            quantity: 0,
            left: 100,
          },
          {
            id: 'foo',
            title: 'Pizza',
            price: 2.5,
            quantity: 0,
            left: 100,
          },
          {
            id: 'foo',
            title: 'Costine',
            price: 3,
            quantity: 0,
            left: 100,
          },
          {
            id: 'foo',
            title: 'Alette',
            price: 2,
            quantity: 0,
            left: 100,
          },
          {
            id: 'foo',
            title: 'Calamari',
            price: 2.5,
            quantity: 0,
            left: 100,
          },
        ],
      },
      {
        title: 'Bar',
        childrens: [
          {
            id: 'foo',
            title: 'Coca-cola',
            price: 1.5,
            quantity: 0,
            left: 100,
          },
          {
            id: 'foo',
            title: 'Acqua',
            price: 0.5,
            quantity: 0,
            left: 100,
          },
        ],
      },
    ];

    this.categories = response;
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

  onCardClick(cardTitle: string, isShiftPressed: boolean) {
    const card = this.getCardFromTitle(cardTitle);

    if (isShiftPressed) {
      if (card.quantity > 0) {
        card.quantity--;
      }
    } else {
      card.quantity++;
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

    if (value && value >= total) {
      this.computedAmount = value - total;
    } else {
      this.computedAmount = undefined;
    }
  }

  onSubmit() {
    console.log('TODO ORDER CONFIRM CALL');
    console.log('TODO PRINT CALL');

    this.print();
  }

  private reset() {
    this.cart = [];
    this.ngOnInit();
  }

  private print() {
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
      document.body.appendChild(iframeElement);

      setTimeout(() => {
        const iframe = window.frames[name];
        iframe.setData(this.getDataToPrint(c.title, c.category));
        iframe.printBill();

        document.body.removeChild(iframeElement);

        if (i === environment.categoriesToPrint.length - 1) {
          this.reset();
        }
      }, 500);
    });
  }

  private getDataToPrint(title: string, categoryTitle: string) {
    let products = this.getProductsToPrint();

    if (categoryTitle) {
      products = products.filter((p) => p.category === categoryTitle);
    }

    return {
      title: title || environment.title,
      orderNumber: '0020', // TODO get from BE
      total: this.formatPrice(this.getTotal()),
      products: products,
    };
  }

  private formatPrice(value: number): string {
    return this.decimalPipe.transform(value, '1.2-2') + this.currency;
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
        ?.childrens?.find((c) => c.title === card)
    );
  }
}
