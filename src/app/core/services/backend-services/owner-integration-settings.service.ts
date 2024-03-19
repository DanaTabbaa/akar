import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { OwnerIntegrationSettings } from '../../models/owner-integration-settings';

@Injectable({
  providedIn: 'root'
})
export class OwnerIntegrationSettingsService extends BaseService<OwnerIntegrationSettings> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    
    this.path="OnwerIntegrationSettings";
  

  }
 
}
