import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { ContractsSettings } from '../../models/contracts-settings';
import { ContractsSettingsDetails } from '../../models/contracts-settings-details';

@Injectable({
  providedIn: 'root'
})
export class RentContractsSettingsDetailsService extends BaseService<ContractsSettingsDetails> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path = "RentContractsSettingsDetails";


  }
  addRequest(model: ContractsSettingsDetails): Observable<ContractsSettingsDetails> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<ContractsSettingsDetails>(this.baseUrl + "/RentContractsSettingsDetails/insert", model, { headers: this.apiHeaders });
  }

  getObjectBySettingId(settingid: bigint) {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<ContractsSettingsDetails>(this.baseUrl + "/RentContractsSettingsDetails/GetBySettingId"+ "/" + `${settingid}`, { headers: this.apiHeaders });
  }
}
