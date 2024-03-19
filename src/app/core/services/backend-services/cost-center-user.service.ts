import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { CostCenters } from '../../models/cost-centers';
import { AppConfigService } from '../local-services/app-config.service';
import { CostCentersUsers } from '../../models/cost-centers-users';

@Injectable({
  providedIn: 'root'
})
export class CostCenterUserService extends BaseService<CostCentersUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="CostCentersUsers";
  

  }
}
