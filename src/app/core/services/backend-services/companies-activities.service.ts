import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import {  CompaniesActivities } from '../../models/companies-activities';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class CompaniesActivitiesService extends BaseService<CompaniesActivities> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="CompanyActivities";
  

  }
  addRequest(model: CompaniesActivities): Observable<CompaniesActivities> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<CompaniesActivities>(this.baseUrl + "/CompanyActivities/insert", model, { headers: this.apiHeaders });
  }
}

