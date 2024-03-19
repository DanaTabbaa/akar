import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { Accounts } from '../../models/accounts';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseService<Accounts> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Accounts";
  

  }
  addRequest(model: Accounts): Observable<Accounts> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Accounts>(this.baseUrl + "/Accounts/insert", model, { headers: this.apiHeaders });
  }
}
