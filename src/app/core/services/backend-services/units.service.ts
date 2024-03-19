import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Unit } from '../../models/units';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { ResponseResult } from '../../models/ResponseResult';

@Injectable({
  providedIn: 'root'
})
export class UnitsService extends BaseService<Unit> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Units";
  

  }
  // addRequest(model: Unit): Observable<Unit> {
  //   this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

  //   return this.http.post<Unit>(this.baseUrl + "/Units/insert", model, { headers: this.apiHeaders });
  // }
  // _addRequest(model: Unit) {
  //   return this.addData("insert", model);
  // }

 
}
