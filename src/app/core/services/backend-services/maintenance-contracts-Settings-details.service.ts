import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { MaintenanceContractsSettingsDetails } from '../../models/maintenance-contract-settings-details';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceContractsSettingsDetailsService extends BaseService<MaintenanceContractsSettingsDetails> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceContractsSettingsDetails";


  }

}
