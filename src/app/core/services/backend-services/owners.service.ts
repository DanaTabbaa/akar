import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Owner } from '../../models/owners';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class OwnersService  extends BaseService<Owner> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Owners";
  

  }
  addRequest(model: Owner): Observable<Owner> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Owner>(this.baseUrl + "/Owners/insert", model, { headers: this.apiHeaders });
  }

  updateRequest(model: Owner): Observable<Owner> {
    ;
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.put<Owner>(this.baseUrl + "/Owners/update", model, { headers: this.apiHeaders });
  }
  _addRequest(model: Owner) {
    return this.addData("insert", model);
  }
  
}
