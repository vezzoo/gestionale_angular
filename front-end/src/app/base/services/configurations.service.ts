import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Configs } from '../models/configs.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationsService {
  errorTranslations: Object;

  constructor(private http: HttpClient) {}

  loadConfigurations(): void {
    this.readFile('./assets/errors.json', (data: any) => {
      this.errorTranslations = data;
    });

    this.readFile('./assets/config.json', (data: Configs) => {
      if (data) {
        environment.title = data.title;
        environment.basePathToTemplates = data.basePathToTemplates;
        environment.categoriesToPrint = data.categoriesToPrint;
      }
    });
  }

  private readFile(url: string, callback: Function) {
    this.http.get(url).subscribe((data: any) => callback(data));
  }
}
