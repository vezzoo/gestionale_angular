import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToolbarService {
  selectedDate = new BehaviorSubject<Date>(new Date());

  setSelectedDate(date: Date): void {
    this.selectedDate.next(date);
  }

  getSelectedDate(): Date {
    return this.selectedDate.getValue();
  }
}
