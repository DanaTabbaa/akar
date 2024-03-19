import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { MaintenanceRequests } from '../../models/maintenance-requests';

@Injectable({
    providedIn: 'root'
})
export class MaintenanceRequestsService extends BaseService<MaintenanceRequests> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceRequests";
  

  }
  addRequest(model: MaintenanceRequests): Observable<MaintenanceRequests> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<MaintenanceRequests>(this.baseUrl + "/MaintenanceRequests/insert", model, { headers: this.apiHeaders });
  }
  // closeRequest(id: any): Observable<any> {
  //   this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
  //   return this.http.get<any>(this.baseUrl + "/MaintenanceRequests/CloseRequest?id="+id, { headers: this.apiHeaders });
  // }
}

