import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { ProductsReceiptDetails } from '../../models/products-receipt-details';



@Injectable({
    providedIn: 'root'
})
export class ProductsReceiptDetailsService extends BaseService<ProductsReceiptDetails> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ProductsReceiptDetails";


  }
 
}
