import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { PurchaseOrdersUsers } from '../../models/purchase-orders-users';



@Injectable({
    providedIn: 'root'
})
export class PurchaseOrdersUsersService  extends BaseService<PurchaseOrdersUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PurchaseOrdersUsers";
  

  }

 
}