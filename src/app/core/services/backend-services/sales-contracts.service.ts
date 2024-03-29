import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from '../local-services/app-config.service';
import { Contract } from '../../models/contract';



@Injectable({
    providedIn: 'root'
})
export class SalesBuyContractsService   extends BaseService<Contract> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="SalesBuy";
  

  }
  generateEntry(contractId:any) {
    return this.addData("generateEntry", contractId);
  }
}