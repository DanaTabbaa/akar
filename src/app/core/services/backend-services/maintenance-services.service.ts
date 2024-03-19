import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { MaintenanceServices } from '../../models/maintenance-services';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceServicesService extends BaseService<MaintenanceServices> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceServices";
  

  }
  addRequest(model: MaintenanceServices): Observable<MaintenanceServices> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<MaintenanceServices>(this.baseUrl + "/MaintenanceServices/insert", model, { headers: this.apiHeaders });
  }
}
