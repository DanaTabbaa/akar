import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { AccountUser } from '../../models/account-user';

@Injectable({
  providedIn: 'root'
})
export class AccountUserService  extends BaseService<AccountUser> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="AccountsUsers";
  

  }
}