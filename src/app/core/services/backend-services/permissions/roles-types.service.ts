import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { RolesTypes } from 'src/app/core/models/permissions/roles-types';
import { AppConfigService } from '../../local-services/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolesTypesService extends BaseService<RolesTypes>  {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RolesTypes";

  }
}
