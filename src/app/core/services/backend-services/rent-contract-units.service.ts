import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { RentContractUnit } from '../../models/rent-contract-units';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class RentContractUnitsService extends BaseService<RentContractUnit> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractUnits";
  

  }
  addRequest(model: RentContractUnit): Observable<RentContractUnit> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<RentContractUnit>(this.baseUrl + "/RentContractUnits/insert", model, { headers: this.apiHeaders });
  }
}