import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Configs } from './base/models/configs.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('./assets/config.json').subscribe((data: Configs) => {
      if (data) {
        environment.title = data.title;
        environment.basePathToTemplates = data.basePathToTemplates;
        environment.categoriesToPrint = data.categoriesToPrint;
      }
    });
  }
}
