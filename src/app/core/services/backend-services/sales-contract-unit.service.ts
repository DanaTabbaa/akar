import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { RentContractUnit } from '../../models/rent-contract-units';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})
export class SalesContractUnitService extends BaseService<RentContractUnit> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractUnit";
  

  }
}