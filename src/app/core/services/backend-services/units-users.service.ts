import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { UnitsUsers } from '../../models/units-users';
import { AppConfigService } from '../local-services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UnitsUsersService extends BaseService<UnitsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="UnitsUsers";
  

  }
}
