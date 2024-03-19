import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { MaintenanceContractDues } from '../../models/maintenance-contract-dues';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceContractDuesService extends BaseService<MaintenanceContractDues> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceContractsDues";


  }

}
