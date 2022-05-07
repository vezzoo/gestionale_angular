import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToolbarFunction } from '../../models/function.model';

@Injectable({ providedIn: 'root' })
export class ToolbarService {
  addToolbarFunction = new Subject<ToolbarFunction>();
  removeToolbarFunction = new Subject<string>();

  addFunction(f: ToolbarFunction) {
    this.addToolbarFunction.next(f);
  }

  removeFunction(name: string) {
    this.removeToolbarFunction.next(name);
  }
}
