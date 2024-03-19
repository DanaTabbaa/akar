import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { PriceRequests } from '../../models/price-requests';



@Injectable({
    providedIn: 'root'
})
export class PriceRequestsService extends BaseService<PriceRequests> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PriceRequests";
  

  }
  insert(model: PriceRequests) {

    return this.addData("insert", model);
  }
  addRequest(model: PriceRequests): Observable<PriceRequests> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<PriceRequests>(this.baseUrl + "/PriceRequests/insert", model, { headers: this.apiHeaders });
  }
  getAllByMaintenanceRequestId(maintenanceRequestId:any)
  {
    ;
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<any>(this.baseUrl + "/PriceRequests/getAllByMaintenanceRequestId?maintenanceRequestId="+maintenanceRequestId, { headers: this.apiHeaders });
  }
}