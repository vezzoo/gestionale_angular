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
  @Input() stock: number;
  @Input() icon: string;

  @Output() onClickEvent = new EventEmitter<{
    isShiftPressed: boolean;
    isCtrlPressed: boolean;
  }>();

  readonly currency = environment.currency;
  readonly steps = [environment.stockWarningLimit, 0];

  private removeClicked: boolean = false;

  onClick(event: MouseEvent) {
    this.onClickEvent.emit({
      isShiftPressed: event.shiftKey || this.removeClicked,
      isCtrlPressed: event.ctrlKey,
    });

    if (this.removeClicked) {
      this.removeClicked = false;
    }
  }

  onRemoveClick() {
    this.removeClicked = true;
  }

  getLeft() {
    if (isNaN(this.quantity)) return this.stock;
    else return this.stock - this.quantity;
  }

  getCardStatus(): 'warning' | 'readonly' {
    if (this.stock < this.steps[0] && this.stock > this.steps[1]) {
      return 'warning';
    } else if (this.stock === this.steps[1]) {
      return 'readonly';
    }
  }

  isOutOfStock(): boolean {
    return this.quantity > 0 && this.stock === this.quantity;
  }
}
