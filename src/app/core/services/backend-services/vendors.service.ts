import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { Vendors } from '../../models/vendors';

@Injectable({
  providedIn: 'root'
})
export class VendorsService extends BaseService<Vendors> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Vendors";
  

  }
  addRequest(model: Vendors): Observable<Vendors> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Vendors>(this.baseUrl + "/Vendors/insert", model, { headers: this.apiHeaders });
  }
}
