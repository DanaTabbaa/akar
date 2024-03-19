import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { PeopleOfBenefit } from '../../models/people-of-benefits';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class PeopleOfBenefitsService extends BaseService<PeopleOfBenefit> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PeopleOfBenefits";


  }

}
