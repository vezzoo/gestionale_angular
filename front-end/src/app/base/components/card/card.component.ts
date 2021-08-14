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

  onClick(event: any) {
    this.onClickEvent.emit(event.shiftKey);
  }
}
