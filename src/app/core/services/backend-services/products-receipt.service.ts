import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { ProductsReceipt } from '../../models/products-receipt';



@Injectable({
    providedIn: 'root'
})
export class ProductsReceiptService extends BaseService<ProductsReceipt> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ProductsReceipt";
  

  }
  insert(model: ProductsReceipt) {

    return this.addData("insert", model);
  }
  addRequest(model: ProductsReceipt): Observable<ProductsReceipt> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<ProductsReceipt>(this.baseUrl + "/ProductsReceipt/insert", model, { headers: this.apiHeaders });
  }
  getAllByMaintenanceRequestId(maintenanceRequestId:any)
  {
    ;
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<any>(this.baseUrl + "/ProductsReceipt/getAllByMaintenanceRequestId?maintenanceRequestId="+maintenanceRequestId, { headers: this.apiHeaders });
  }
}