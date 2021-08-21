import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Configs } from './base/models/configs.model';
import { ConfigurationsService } from './base/services/configurations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private configurationsService: ConfigurationsService) {}

  ngOnInit(): void {
    this.configurationsService.loadConfigurations();
  }
}
