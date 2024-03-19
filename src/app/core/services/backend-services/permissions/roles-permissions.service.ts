import { Injectable } from '@angular/core';
import { RolesPermissions } from '../../../models/permissions/roles-permissions';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../local-services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService extends BaseService<RolesPermissions>  {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RolesPermissions";

  }
}
