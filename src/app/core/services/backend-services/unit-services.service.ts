import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { UnitServices } from '../../models/unit-services';

@Injectable({
  providedIn: 'root'
})
export class UnitServicesService extends BaseService<UnitServices> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="UnitServices";
  

  }
  addRequest(model: UnitServices): Observable<UnitServices> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<UnitServices>(this.baseUrl + "/UnitServices/insert", model, { headers: this.apiHeaders });
  }
}
