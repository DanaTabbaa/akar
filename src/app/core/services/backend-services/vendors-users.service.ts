import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { VendorsUser } from '../../models/vendors-users';
import { AppConfigService } from '../local-services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class VendorsUsersService extends BaseService<VendorsUser> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="VendorsUser";
  

  }
}