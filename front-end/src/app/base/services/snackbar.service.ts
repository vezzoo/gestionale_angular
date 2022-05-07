import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  openSuccessSnackBar(msg: string = 'Ok') {
    this.openSnackBar(msg, false);
  }

  openErrorSnackBar(msg: string = 'Errore generico') {
    this.openSnackBar(msg, true);
  }

  private openSnackBar(msg: string, error: boolean) {
    this.snackBar.open(msg, ``, {
      duration: !error ? 5000 : 10000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      panelClass: [!error ? 'snack-success' : 'snack-error'],
    });
  }
}
