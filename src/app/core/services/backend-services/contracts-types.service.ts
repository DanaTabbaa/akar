import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { ContractTypes } from '../../models/contract-types';

@Injectable({
  providedIn: 'root'
})
export class ContractsTypesService extends BaseService<ContractTypes> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ContractsTypes";
  

  }
  
  addRequest(model: ContractTypes): Observable<ContractTypes> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<ContractTypes>(this.baseUrl + "/ContractsTypes/insert", model, { headers: this.apiHeaders });
  }
}
