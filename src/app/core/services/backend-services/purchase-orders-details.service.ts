import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { PurchaseOrdersDetails } from '../../models/purchase-orders-details';



@Injectable({
    providedIn: 'root'
})
export class PurchaseOrdersDetailsService extends BaseService<PurchaseOrdersDetails> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PurchaseOrdersDetails";
  

  }
  addRequest(model: PurchaseOrdersDetails): Observable<PurchaseOrdersDetails> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<PurchaseOrdersDetails>(this.baseUrl + "/PurchaseOrdersDetails/insert", model, { headers: this.apiHeaders });
  }
}