import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { Products } from '../../models/products';



@Injectable({
    providedIn: 'root'
})
export class ProductsService extends BaseService<Products> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="Products";
  

  }
  addRequest(model: Products): Observable<Products> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Products>(this.baseUrl + "/Products/insert", model, { headers: this.apiHeaders });
  }
}

