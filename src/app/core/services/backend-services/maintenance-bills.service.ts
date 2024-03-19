import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { MaintenanceBills } from '../../models/maintenance-bills';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceBillsService extends BaseService<MaintenanceBills> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceBills";


  }

}
