import { FormGroup, NgForm } from '@angular/forms';

export class CommonUtils {
  public static getFormControlValue(
    form: FormGroup | NgForm,
    formControlName: string
  ): any {
    return form?.controls[formControlName]?.value;
  }

  public static formatNumberWithStartingZero(value: string | number): string {
    return ('00' + value).substr(-2);
  }
}
