import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { MaintenanceOffersUsers } from '../../models/maintenance-offers-users';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceOffersUsersService  extends BaseService<MaintenanceOffersUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceOffersUsers";
  

  }

 
}