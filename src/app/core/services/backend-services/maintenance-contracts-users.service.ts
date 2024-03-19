import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { MaintenanceContractsUsers } from '../../models/maintenance-contracts-users';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceContractsUsersService  extends BaseService<MaintenanceContractsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceContractsUsers";
  

  }

 
}