import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { MaintenancePurchaseBillsUsers } from '../../models/maintenance-purchase-bills-users';



@Injectable({
    providedIn: 'root'
})
export class MaintenancePurchaseBillsUsersService extends BaseService<MaintenancePurchaseBillsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="MaintenancePurchaseBillsUsers";
  

  }
}
