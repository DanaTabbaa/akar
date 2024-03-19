import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { PeopleOfBenefitsUsers } from '../../models/people-of-benefits-users';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})
export class PeopleOfBenefitsUsersService  extends BaseService<PeopleOfBenefitsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PeopleOfBenefitsUsers";
  

  }

 
}