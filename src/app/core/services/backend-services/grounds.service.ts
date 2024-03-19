import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Ground } from '../../models/grounds';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
 export class GroundsService  extends BaseService<Ground> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Grounds";
  

  }
  addRequest(model: Ground): Observable<Ground> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Ground>(this.baseUrl + "/Grounds/insert", model, { headers: this.apiHeaders });
  }
}