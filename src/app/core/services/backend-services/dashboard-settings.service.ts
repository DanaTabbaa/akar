import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from '../local-services/app-config.service';
import { DashboardSettings } from '../../models/dashboard-settings';



@Injectable({
    providedIn: 'root'
})
export class DashboardSettingsService   extends BaseService<DashboardSettings> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="DashboardSettings";
  

  }
}