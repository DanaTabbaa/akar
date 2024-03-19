import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { District } from '../../models/district';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistrictsService extends BaseService<District> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Districts";
  

  }
  addRequest(model: District): Observable<District> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<District>(this.baseUrl + "/Districts/insert", model, { headers: this.apiHeaders });
  }
}
