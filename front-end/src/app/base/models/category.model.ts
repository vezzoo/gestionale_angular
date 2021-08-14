import { CashDeskItem } from './cashDeskItem.model';
import { DashboardItem } from './dashboardItem.model';

export interface Category {
  title: string;
  childrens: Array<DashboardItem | CashDeskItem>;
}
