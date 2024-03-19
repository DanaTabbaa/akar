import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { Tenants } from '../../models/tenants';



@Injectable({
    providedIn: 'root'
})
 
export class TenantsService  extends BaseService<Tenants> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Tenants";
  

  }
  addRequest(model: Tenants): Observable<Tenants> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Tenants>(this.baseUrl + "/Tenants/insert", model, { headers: this.apiHeaders });
  }
}