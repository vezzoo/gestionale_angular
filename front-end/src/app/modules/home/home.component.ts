import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ToolbarService } from 'src/app/base/components/toolbar/toolbar.service';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  constructor(
    private httpService: HttpClientService,
    private toolbarService: ToolbarService,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  onSubmit() {}
}
