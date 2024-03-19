import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { SalesBuyContractUnit } from '../../models/sales-buy-contract-unit';



@Injectable({
    providedIn: 'root'
})
export class SalesBuyContractUnitsService extends BaseService<SalesBuyContractUnit> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="SalesBuyContractsUnits";


  }

}
