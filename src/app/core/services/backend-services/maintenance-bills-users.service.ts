import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { MaintenanceBillsUsers } from '../../models/maintenance-bills-users';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceBillsUsersService  extends BaseService<MaintenanceBillsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceBillsUsers";
  

  }

 
}