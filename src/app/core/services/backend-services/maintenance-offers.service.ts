import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { MaintenanceOffers } from '../../models/maintenance-offers';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceOffersService extends BaseService<MaintenanceOffers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceOffers";
  

  }
  insert(model: MaintenanceOffers) {

    return this.addData("insert", model);
  }
  addRequest(model: MaintenanceOffers): Observable<MaintenanceOffers> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<MaintenanceOffers>(this.baseUrl + "/MaintenanceOffers/insert", model, { headers: this.apiHeaders });
  }
 
}