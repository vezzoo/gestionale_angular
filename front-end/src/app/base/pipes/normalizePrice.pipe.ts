import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'normalizePrice' })
export class NormalizePricePipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number): string {
    return this.decimalPipe.transform(value / 100, '1.2-2');
  }
}
