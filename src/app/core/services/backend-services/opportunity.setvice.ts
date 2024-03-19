import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Opportunity } from '../../models/opportunity';
@Injectable({
  providedIn: 'root'
})
export class OpportunityService extends BaseService<Opportunity> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Opportunities";
  

  }
 
}
