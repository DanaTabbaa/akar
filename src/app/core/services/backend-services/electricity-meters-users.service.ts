import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import {  ElectricityMetersUsers } from '../../models/electricity-meters-users';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})
export class ElectricityMetersUsersService extends BaseService<ElectricityMetersUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ElectricityMetersUsers";
  

  }
}
