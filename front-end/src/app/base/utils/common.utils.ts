import { FormGroup, NgForm } from '@angular/forms';

export class CommonUtils {
  public static getFormControlValue(
    form: FormGroup | NgForm,
    formControlName: string
  ): any {
    return form?.controls[formControlName]?.value;
  }
}
