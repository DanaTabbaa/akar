import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { RentContractsMaintenance } from '../../models/rent-contracts-maintenance';

@Injectable({
  providedIn: 'root'
})
export class RentContractsMaintenanceService extends BaseService<RentContractsMaintenance> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractsMaintenance";
  

  }
  addRequest(model: RentContractsMaintenance): Observable<RentContractsMaintenance> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<RentContractsMaintenance>(this.baseUrl + "/RentContractsMaintenance/insert", model, { headers: this.apiHeaders });
  }
}
