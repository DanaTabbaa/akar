import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { ContractsSettings } from '../../models/contracts-settings';

@Injectable({
  providedIn: 'root'
})
export class ContractsSettingsService extends BaseService<ContractsSettings> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ContractsSettings";
  

  }
  addRequest(model: ContractsSettings): Observable<ContractsSettings> {
    ;
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<ContractsSettings>(this.baseUrl + "/ContractsSettings/insert", model, { headers: this.apiHeaders });
  }
  

}
