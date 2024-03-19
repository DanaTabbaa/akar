import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { RentContractServiceModel } from '../../models/rent-contract-services';

@Injectable({
  providedIn: 'root'
})
export class RentContractServicesService extends BaseService<RentContractServiceModel> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractServices";
  

  }
  addRequest(model: RentContractServiceModel): Observable<RentContractServiceModel> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<RentContractServiceModel>(this.baseUrl + "/RentContractServices/insert", model, { headers: this.apiHeaders });
  }
}
