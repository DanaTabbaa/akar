import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { WaterMeters } from '../../models/water-meters';

@Injectable({
  providedIn: 'root'
})
export class WaterMetersService extends BaseService<WaterMeters> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="WaterMeters";
  

  }
}
