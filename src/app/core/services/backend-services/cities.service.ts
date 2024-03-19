import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Cities } from '../../models/cities';
import { AppConfigService } from '../local-services/app-config.service';
import { Region } from '../../models/regions';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class CitiesService extends BaseService<Cities> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Cities";
  

  }
  addRequest(model: Cities): Observable<Cities> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Cities>(this.baseUrl + "/Cities/insert", model, { headers: this.apiHeaders });
  }
}
