import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../../models/contract';
import { AppConfigService } from '../local-services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService extends BaseService<Contract> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Contracts";
  

  }
}
