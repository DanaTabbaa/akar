import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { RentContractDues } from '../../models/rent-contract-dues';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class RentContractDuesService extends BaseService<RentContractDues> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractDues";
  

  }
  addRequest(model: RentContractDues): Observable<RentContractDues> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<RentContractDues>(this.baseUrl + "/RentContractDues/insert", model, { headers: this.apiHeaders });
  }


}