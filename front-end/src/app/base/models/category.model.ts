import { Card } from './card.model';

export interface Category {
  title: string;
  childrens: Card[];
}
