import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../models/card.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  @Input() title: string;
  @Input() childrens: Card[];

  @Output() onCardClickEvent = new EventEmitter<string>();

  onClick(cardTitle: string) {
    this.onCardClickEvent.emit(`${this.title}/${cardTitle}`);
  }
}
