import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { UnitsTypes } from '../../models/units-types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitsTypesService extends BaseService<UnitsTypes> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="UnitTypes";
  

  }
  addRequest(model: UnitsTypes): Observable<UnitsTypes> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<UnitsTypes>(this.baseUrl + "/UnitTypes/insert", model, { headers: this.apiHeaders });
  }
}
