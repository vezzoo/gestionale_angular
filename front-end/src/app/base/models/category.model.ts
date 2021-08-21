import { CashDeskItem } from './cashDeskItem.model';
import { DashboardItem } from './dashboardItem.model';

export interface Category {
  title: string;
  children: Array<DashboardItem | CashDeskItem>;
}
