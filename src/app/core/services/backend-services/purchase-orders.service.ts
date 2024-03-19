import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { PurchaseOrders } from '../../models/purchase-orders';



@Injectable({
    providedIn: 'root'
})
export class PurchaseOrdersService extends BaseService<PurchaseOrders> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PurchaseOrders";
  

  }
  insert(model: PurchaseOrders) {

    return this.addData("insert", model);
  }
  addRequest(model: PurchaseOrders): Observable<PurchaseOrders> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<PurchaseOrders>(this.baseUrl + "/PurchaseOrders/insert", model, { headers: this.apiHeaders });
  }
 
}