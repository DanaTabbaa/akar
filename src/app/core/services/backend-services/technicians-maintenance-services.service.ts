import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { TechniciansMaintenanceServices } from '../../models/technicians-maintenance-services';



@Injectable({
    providedIn: 'root'
})
export class TechniciansMaintenanceServicesService extends BaseService<TechniciansMaintenanceServices> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="TechniciansMaintenanceServices";

  }
  addRequest(model: TechniciansMaintenanceServices): Observable<TechniciansMaintenanceServices> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<TechniciansMaintenanceServices>(this.baseUrl + "/TechniciansMaintenanceServices/insert", model, { headers: this.apiHeaders });
  }
}

