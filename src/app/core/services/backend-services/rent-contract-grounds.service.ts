import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { RentContractGround } from '../../models/rent-contract-grounds';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})
export class RentContractGroundsService  extends BaseService<RentContractGround> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractGround";
  

  }
}