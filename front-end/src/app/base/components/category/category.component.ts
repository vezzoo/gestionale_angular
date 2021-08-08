import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  @Input() cardSmall: boolean = false;
  @Input() title: string;
  @Input() childrens: Card[];

  @Output() onCardClickEvent = new EventEmitter<{
    cardTitle: string;
    isShiftPressed: boolean;
  }>();

  onClick(cardTitle: string, isShiftPressed: boolean) {
    this.onCardClickEvent.emit({
      cardTitle: `${this.title}/${cardTitle}`,
      isShiftPressed: isShiftPressed,
    });
  }
}
