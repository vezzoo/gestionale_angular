import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Urls } from 'src/app/base/enums/enums';
import { RouterService } from 'src/app/base/services/router.service';
import { FocusUtils } from 'src/app/base/utils/focus.utils';
import { AuthService } from './auth.service';

const delta = 80;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    // prettier-ignore
    trigger('slideRightLeft', [
      state('right', style({
          transform: 'translateX(8px)',
        })
      ),
      state('left', style({
          transform: 'translateX(-8px)',
        })
      ),
      state('neutral', style({
          transform: 'translate(0, 0)',
        })
      ),
      transition('neutral <=> right', animate(delta)),
      transition('neutral <=> left', animate(delta)),
    ]),
  ],
})
export class AuthComponent implements OnDestroy, AfterViewInit {
  @ViewChild('form') form: NgForm;
  @ViewChild('username') username: ElementRef;

  hide = true;
  loading = false;
  errorPos: 'left' | 'neutral' | 'right' = 'neutral';
  errorMessage: string;

  private sub: Subscription = null;

  constructor(
    private authService: AuthService,
    private routerService: RouterService
  ) {}

  ngAfterViewInit(): void {
    this.focusOnUserName();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  onSubmit(): void {
    this.loading = true;
    this.authService.doLogin(
      this.form.controls['username'].value,
      this.form.controls['password'].value,
      (user) => {
        this.loading = false;
        this.routerService.navigate(Urls.HOME);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error;
        this.resetValuesAndSetError();
        this.doAnimation();
        this.focusOnUserName();
      }
    );
  }

  focusOnUserName() {
    FocusUtils.focusOnField(this.username);
  }

  resetValuesAndSetError() {
    this.resetFieldValueAndSetError('username');
    this.resetFieldValueAndSetError('password');
  }

  resetFieldValueAndSetError(formName: string) {
    this.form.controls[formName].setErrors({ invalid: true });
    this.form.controls[formName].setValue('');
  }

  doAnimation() {
    let time = 0;

    for (let i = 0; i < 2; i++) {
      setTimeout(() => (this.errorPos = 'right'), time);
      setTimeout(() => (this.errorPos = 'neutral'), (time += delta));
      setTimeout(() => (this.errorPos = 'left'), (time += delta));
      setTimeout(() => (this.errorPos = 'neutral'), (time += delta));
    }
  }
}
