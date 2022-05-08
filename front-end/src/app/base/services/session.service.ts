import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginGetRequest } from 'src/types/login';
import { ToolbarService } from '../components/toolbar/toolbar.service';

const printersErrorMessage = `Una o più stampanti non rispondono!`;

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _onErrorsChanges = new Subject<void>();
  private _errors: Array<string> = [];
  private _userCredentials: LoginGetRequest = {} as LoginGetRequest;
  private _printers: Array<string> = [];

  constructor(private toolbarService: ToolbarService) {}

  listenToErrorsChanges(): Observable<Array<string>> {
    return this._onErrorsChanges.pipe(map(() => this._errors));
  }

  setPrinters(printers: Array<string>): void {
    this._printers = printers;
    this.toolbarService.startCheckingPrintersStatus.next();
  }

  getPrintersApis(): Array<string> {
    return this._printers.map((a) => a.concat(`/api/status/`));
  }

  setPrintersError(): void {
    this.setError(printersErrorMessage);
  }

  resetPrintersError(): void {
    this.resetError(printersErrorMessage);
  }

  setError(message: string): void {
    if (this.getIndex(message) === -1) {
      this._errors.push(message);
      this._onErrorsChanges.next();
    }
  }

  resetError(message: string): void {
    const index = this.getIndex(message);

    if (index > -1) {
      this._errors.splice(index, 1);
      this._onErrorsChanges.next();
    }
  }

  resetErrors(): void {
    this._errors = [];
    this._onErrorsChanges.next();
  }

  private getIndex(message: string): number {
    return this._errors.findIndex((errMessage) => errMessage === message);
  }
}
