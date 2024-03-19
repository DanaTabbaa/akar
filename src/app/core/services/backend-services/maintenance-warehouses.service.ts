import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { MaintenanceWarehouses } from '../../models/maintenance-warehouses';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceWarehousesService  extends BaseService<MaintenanceWarehouses> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceWarehouses";

  }
  addRequest(model: MaintenanceWarehouses): Observable<MaintenanceWarehouses> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<MaintenanceWarehouses>(this.baseUrl + "/MaintenanceWarehouses/insert", model, { headers: this.apiHeaders });
  }

  updateRequest(model: MaintenanceWarehouses): Observable<MaintenanceWarehouses> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.put<MaintenanceWarehouses>(this.baseUrl + "/MaintenanceWarehouses/update", model, { headers: this.apiHeaders });
  }
  _addRequest(model: MaintenanceWarehouses) {
    return this.addData("insert", model);
  }
  
}
