import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
})
export class CartDetailComponent {
  @Input() title: string;
  @Input() quantity: number;
  @Input() price: number;

  readonly currency = environment.currency;
}
