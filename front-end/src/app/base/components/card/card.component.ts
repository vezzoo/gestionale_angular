import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() quantity: number;
  @Input() icon: string;

  @Output() onClickEvent = new EventEmitter<string>();

  onClick() {
    this.onClickEvent.emit(this.title);
  }
}
