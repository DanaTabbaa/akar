import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CompanyInformation } from '../../models/company-information';
import { AppConfigService } from '../local-services/app-config.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CompanyInformationService extends BaseService<CompanyInformation> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="CompanyInformation";


  }
}
