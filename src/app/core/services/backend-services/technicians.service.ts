import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { Technicians } from '../../models/technicians';



@Injectable({
    providedIn: 'root'
})
export class TechniciansService extends BaseService<Technicians> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="Technicians";
  

  }
  addRequest(model: Technicians): Observable<Technicians> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Technicians>(this.baseUrl + "/Technicians/insert", model, { headers: this.apiHeaders });
  }
}

