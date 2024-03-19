import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { GeneralIntegrationSettings } from '../../models/general-integration-settings';

@Injectable({
  providedIn: 'root'
})
export class GeneralIntegrationSettingsService extends BaseService<GeneralIntegrationSettings> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    
    this.path="GeneralIntegrationSettings";
  

  }
 
}
