import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() small: boolean = false;
  @Input() id: string;
  @Input() title: string;
  @Input() description: string;
  @Input() quantity: number;
  @Input() price: number;
  @Input() left: number;
  @Input() icon: string;

  @Output() onClickEvent = new EventEmitter<boolean>();

  readonly currency = environment.currency;
  readonly steps = [20, 0];

  onClick(event: any) {
    this.onClickEvent.emit(event.shiftKey);
  }

  getLeft() {
    if (isNaN(this.quantity)) return this.left;
    else return this.left - this.quantity;
  }

  getCardStatus(): 'warning' | 'readonly' {
    if (this.left < this.steps[0] && this.left > this.steps[1]) {
      return 'warning';
    } else if (this.left === this.steps[1]) {
      return 'readonly';
    }
  }

  isOutOfStock(): boolean {
    return this.quantity > 0 && this.left === this.quantity;
  }
}
