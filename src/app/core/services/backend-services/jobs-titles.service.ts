import { Injectable } from '@angular/core';
import { JobsTiltes } from '../../models/jobs-titles';
import { BaseService } from './base.service';
import { AppConfigService } from '../local-services/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobsTitlesService  extends BaseService<JobsTiltes> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="CompaniesActivitiesUsers";

  }
  }
