import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { MaintenanceOffersDetails } from '../../models/maintenance-offers-details';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceOffersDetailsService extends BaseService<MaintenanceOffersDetails> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceOffersDetails";
  

  }
  addRequest(model: MaintenanceOffersDetails): Observable<MaintenanceOffersDetails> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<MaintenanceOffersDetails>(this.baseUrl + "/MaintenanceOffersDetails/insert", model, { headers: this.apiHeaders });
  }
}