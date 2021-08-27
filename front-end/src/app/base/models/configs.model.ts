import { CategoryToPrint } from './categoryToPrint.model';

export interface Configs {
  title: string;
  basePathToTemplates: string;
  categoriesToPrint: Array<CategoryToPrint>;
  barCashDeskCategories: Array<string>;
}
