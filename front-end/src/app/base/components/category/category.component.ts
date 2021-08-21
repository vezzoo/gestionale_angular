import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CashDeskItem } from '../../models/cashDeskItem.model';
import { DashboardItem } from '../../models/dashboardItem.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  @Input() cardSmall: boolean = false;
  @Input() title: string;
  @Input() children: Array<DashboardItem | CashDeskItem>;

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

  getCashDeskItem(item: DashboardItem | CashDeskItem): CashDeskItem {
    return <CashDeskItem>item;
  }

  getDashboardItem(item: DashboardItem | CashDeskItem): DashboardItem {
    return <DashboardItem>item;
  }
}
