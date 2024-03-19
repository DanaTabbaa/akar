import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { AccountsTypes } from '../../models/accounts-types';

@Injectable({
  providedIn: 'root'
})
export class AccountsTypesService extends BaseService<AccountsTypes> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="AccountTypes";
  

  }
  addRequest(model: AccountsTypes): Observable<AccountsTypes> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<AccountsTypes>(this.baseUrl + "/AccountTypes/insert", model, { headers: this.apiHeaders });
  }
}
