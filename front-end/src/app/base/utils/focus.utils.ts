import { ElementRef } from '@angular/core';

export class FocusUtils {
  public static focusOnField(field: ElementRef): void {
    setTimeout(() => field.nativeElement.focus(), 0);
  }
}
