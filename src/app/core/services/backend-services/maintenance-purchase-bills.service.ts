import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { MaintenancePurchaseBills } from '../../models/maintenance-purchase-bills';



@Injectable({
    providedIn: 'root'
})
export class MaintenancePurchaseBillsService extends BaseService<MaintenancePurchaseBills> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="MaintenancePurchaseBills";
  

  }
  addRequest(model: MaintenancePurchaseBills): Observable<MaintenancePurchaseBills> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<MaintenancePurchaseBills>(this.baseUrl + "/MaintenancePurchaseBills/insert", model, { headers: this.apiHeaders });
  }
  insert(model: MaintenancePurchaseBills) {

    return this.addData("insert", model);
  }
}

