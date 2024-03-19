import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { ProductsReceiptsUsers } from '../../models/products-receipt-users';



@Injectable({
    providedIn: 'root'
})
export class ProductsReceiptUsersService  extends BaseService<ProductsReceiptsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ProductsReceiptUsers";
  

  }

 
}