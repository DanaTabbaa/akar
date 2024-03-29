import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from '../local-services/app-config.service';

import { OpportunitiesOffers } from '../../models/opportunities-offers';

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesOffersService extends BaseService<OpportunitiesOffers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="OffersOpportunities";
  

  }
 
}
