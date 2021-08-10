import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { Card } from 'src/app/base/models/card.model';
import { Category } from 'src/app/base/models/category.model';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { RouterService } from 'src/app/base/services/router.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

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
export class CashDeskComponent implements OnInit {
  categories: Category[] = [];
  cart: Card[] = [];

  currency = environment.currency;
  showScrollButton: boolean = false;

  constructor(
    private httpService: HttpClientService,
    private routerService: RouterService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('TODO CALL CASH-DESK');

    const response: Category[] = [
      {
        title: 'Cucina',
        childrens: [
          {
            title: 'Panino e salamella',
            price: 2.5,
            quantity: 0,
          },
          {
            title: 'Patatine',
            price: 2,
            quantity: 0,
          },
          {
            title: 'Pizza',
            price: 2.5,
            quantity: 0,
          },
          {
            title: 'Costine',
            price: 3,
            quantity: 0,
          },
          {
            title: 'Alette',
            price: 2,
            quantity: 0,
          },
          {
            title: 'Calamari',
            price: 2.5,
            quantity: 0,
          },
        ],
      },
      {
        title: 'Bar',
        childrens: [
          {
            title: 'Coca-cola',
            price: 1.5,
            quantity: 0,
          },
          {
            title: 'Acqua',
            price: 0.5,
            quantity: 0,
          },
        ],
      },
    ];

    this.categories = response;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.checkIfShowScrollButton();
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

    this.updateCart(card);
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

  private updateCart(newElement: Card) {
    const c = this.cart.find((c) => c.title === newElement.title);
    if (newElement.quantity > 0) {
      if (c) c.quantity = newElement.quantity;
      else this.cart.push(newElement);
    } else if (newElement.quantity === 0 && c) {
      this.cart.splice(this.cart.indexOf(c), 1);
    }
  }

  private getCardFromTitle(cardTitle: string) {
    const split = cardTitle.split('/');
    const category = split[0];
    const card = split[1];

    return this.categories
      ?.find((cat) => cat.title === category)
      ?.childrens?.find((c) => c.title === card);
  }
}
