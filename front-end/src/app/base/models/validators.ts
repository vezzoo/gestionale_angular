import { FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';

interface CustomValidator {
  (control: AbstractControl): ValidationErrors | null;
}

export function isMaskCompleted(): CustomValidator {
  return (control: FormGroup): ValidationErrors | null =>
    control?.value?.split('').includes('_') ? { invalid: true } : null;
}

export function isDateValid(splitter: string): CustomValidator {
  return (control: FormGroup): ValidationErrors | null => {
    if (!control) return null;
    if (!control.value) return null;

    const split = control.value.split(splitter);
    const day = +split[0];
    const month = +split[1];
    const year = +split[2];
    const date = new Date(year, month - 1, day);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if ((date && isNaN(date.getMonth())) || isNaN(month)) return null;
    if ((date && date.getMonth()) !== month - 1) return { invalid: true };
    if (date < currentDate) return { invalid: true };

    return null;
  };
}
