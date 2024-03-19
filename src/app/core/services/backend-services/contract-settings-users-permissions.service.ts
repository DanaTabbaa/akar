import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { ContractSettingsRolePermissions } from '../../models/contract-settings-role-permissions';


@Injectable({
    providedIn: 'root'
})
export class ContractSettingsUsersPermissionsService extends BaseService<ContractSettingsRolePermissions> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="ContractSettingsUsersPermissions";

  }

}
