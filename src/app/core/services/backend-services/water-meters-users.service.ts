import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { WaterMetersUsers } from '../../models/water-meters-users';
import { AppConfigService } from '../local-services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WaterMetersUsersService  extends BaseService<WaterMetersUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="WaterMetersUsers";
  

  }
}