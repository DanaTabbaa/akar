import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Region } from '../../models/regions';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class RegionsService extends BaseService<Region> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Regions";
  

  }
  addRequest(model: Region): Observable<Region> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Region>(this.baseUrl + "/Regions/insert", model, { headers: this.apiHeaders });
  }
}