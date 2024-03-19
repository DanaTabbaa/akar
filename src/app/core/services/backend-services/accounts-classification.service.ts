import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { AccountsClassification } from '../../models/accounts-classification';

@Injectable({
  providedIn: 'root'
})
export class AccountsClassificationService extends BaseService<AccountsClassification> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="AccountsClassification";
  

  }
  addRequest(model: AccountsClassification): Observable<AccountsClassification> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<AccountsClassification>(this.baseUrl + "/AccountsClassification/insert", model, { headers: this.apiHeaders });
  }
}
