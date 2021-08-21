import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app/base/enums/enums';
import { Category } from 'src/app/base/models/category.model';
import { HttpClientService } from 'src/app/base/services/httpClient.service';
import { RouterService } from 'src/app/base/services/router.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private httpService: HttpClientService,
    private routerService: RouterService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('TODO CALL DASHBOARD');

    const response: Category[] = [
      {
        title: 'Cassa',
        children: [
          {
            id: 'foo',
            title: 'Standard',
            description: 'Cassa completa di tutte le categorie',
            icon: 'local_atm',
          },
          {
            id: 'foo',
            title: 'Bar',
            description: 'Cassa comprendente solo la categoria bar',
            icon: 'money',
          },
          {
            id: 'foo',
            title: 'Asporto',
            description: 'Cassa completa, solo da asporto',
            icon: 'local_atm',
          },
        ],
      },
      {
        title: 'Gestione',
        children: [
          {
            id: 'foo',
            title: 'Magazzino',
            description: '<Desc here>',
            icon: 'storage',
          },
          {
            id: 'foo',
            title: 'Reports',
            description: '<Desc here>',
            icon: 'equalizer',
          },
        ],
      },
      {
        title: 'Amministrazione',
        children: [
          {
            id: 'foo',
            title: 'Gestione utenti',
            description: '<Desc here>',
            icon: 'account_circle',
          },
          {
            id: 'foo',
            title: 'Chiudi giornata',
            description: '<Desc here>',
            icon: 'close',
          },
        ],
      },
    ];

    this.categories = response;
  }

  onCardClick(cardTitle: string) {
    const path = this.getUrlFromTitle(cardTitle);
    if (path && Urls[path]) {
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
