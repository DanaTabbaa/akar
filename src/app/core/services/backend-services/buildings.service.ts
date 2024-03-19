import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Building } from '../../models/buildings';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';




@Injectable({
    providedIn: 'root'
})
export class BuildingsService extends BaseService<Building> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Buildings";



  }


  addRequest(model: Building): Observable<Building> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Building>(this.baseUrl + "/Buildings/insert", model, { headers: this.apiHeaders });
  }


}
