import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Office } from '../../models/offices';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class OfficesService extends BaseService<Office> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="Offices";
  

  }
  addRequest(model: Office): Observable<Office> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Office>(this.baseUrl + "/Offices/insert", model, { headers: this.apiHeaders });
  }
}

