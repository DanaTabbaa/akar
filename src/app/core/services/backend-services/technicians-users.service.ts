import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { TechniciansUsers } from '../../models/technicians-users';



@Injectable({
    providedIn: 'root'
})
export class TechniciansUsersService extends BaseService<TechniciansUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="TechniciansUsers";
  

  }
}
