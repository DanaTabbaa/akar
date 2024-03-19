import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Nationality } from '../../models/nationality';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NationalityService extends BaseService<Nationality> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Nationalities";
  

  }
  addRequest(model: Nationality): Observable<Nationality> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Nationality>(this.baseUrl + "/Nationalities/insert", model, { headers: this.apiHeaders });
  }
}
