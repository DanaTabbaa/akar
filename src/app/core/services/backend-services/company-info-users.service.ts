import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import {  CompanyInfoUsers } from '../../models/company-info-users';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})
export class CompanyInfoUsersService extends BaseService<CompanyInfoUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="CompanyInfoUsers";
  

  }
}
