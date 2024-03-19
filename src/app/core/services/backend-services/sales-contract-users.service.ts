import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { RentContractUser } from '../../models/rent-contract-users';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})
export class SalesContractUsersService  extends BaseService<RentContractUser> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractUser";
  

  }
}