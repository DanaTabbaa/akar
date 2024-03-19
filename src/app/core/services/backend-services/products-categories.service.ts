import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { ProductCategory } from '../../models/Product-category';



@Injectable({
    providedIn: 'root'
})
export class ProductsCategoriesService extends BaseService<ProductCategory> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ProductsCategories";
  

  }
  addRequest(model: ProductCategory): Observable<ProductCategory> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<ProductCategory>(this.baseUrl + "/ProductsCategories/insert", model, { headers: this.apiHeaders });
  }

  updateRequest(model: ProductCategory): Observable<ProductCategory> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.put<ProductCategory>(this.baseUrl + "/ProductsCategories/update", model, { headers: this.apiHeaders });
  }
  _addRequest(model: ProductCategory) {
    return this.addData("insert", model);
  }

  

  

  

  
}