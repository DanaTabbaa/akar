import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Realestate } from '../../models/realestates';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class RealestatesService extends BaseService<Realestate> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Realestates";
  

  }
  addRequest(model: Realestate): Observable<Realestate> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Realestate>(this.baseUrl + "/Realestates/insert", model, { headers: this.apiHeaders });
  }
  _addRequest(model: Realestate) {
    return this.addData("insert", model);
  }
  updateRequest(model: Realestate) {
    return this.updateData("Update", model);
  }

  

  

  

  
}