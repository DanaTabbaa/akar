import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { PriceRequestsUsers } from '../../models/price-requests-users';



@Injectable({
    providedIn: 'root'
})
export class PriceRequestsUsersService  extends BaseService<PriceRequestsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PriceRequestsUsers";
  

  }

 
}