import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'normalizePrice' })
export class NormalizePricePipe implements PipeTransform {
  transform(value: number): number {
    return value / 100;
  }
}
