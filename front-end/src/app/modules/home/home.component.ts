import { Component, OnInit } from '@angular/core';
import { ApiUrls, Urls } from 'src/app/base/enums/enums';
import { Category } from 'src/app/base/models/category.model';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { RouterService } from 'src/app/base/services/router.service';
import { ApiError } from 'src/types/api-error';
import { DashBoardGetResponse } from 'src/types/dashboard';
import { ResetCounterService } from '../reset-counter/reset-counter.service';
import { UsersManagementService } from '../users-management/users-management.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private routerService: RouterService,
    private httpClientService: HttpClientService,
    private resetCounterService: ResetCounterService,
    private usersManagementService: UsersManagementService
  ) {}

  ngOnInit(): void {
    this.httpClientService.get<DashBoardGetResponse>(
      ApiUrls.DASHBOARD,
      (response: DashBoardGetResponse) => {
        this.categories = response?.categories;
      },
      (error: ApiError) => {}
    );
  }

  onCardClick(cardTitle: string, isCtrlPressed: boolean) {
    const path = this.getUrlFromTitle(cardTitle);
    if (path === 'AMMINISTRAZIONE_GESTIONE_UTENTI') {
      this.usersManagementService.openModal();
    } else if (path === 'AMMINISTRAZIONE_CHIUDI_GIORNATA') {
      if (!isCtrlPressed) {
        console.log('CTRL + click expected');
      } else {
        this.resetCounterService.reset();
      }
    } else if (path && Urls[path]) {
      this.routerService.navigate(Urls[path]);
    } else {
      console.warn(`Route ${path} not defined!`);
    }
  }

  private getUrlFromTitle(title: string): string {
    return title
      .split('')
      .map((e) => {
        if (e === ' ' || e === '/') return '_';
        else return e;
      })
      .join('')
      .toUpperCase();
  }
}
