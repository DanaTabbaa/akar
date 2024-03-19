import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { BillTypeUsersPermissions } from '../../models/bill-type-users-permissions';


@Injectable({
    providedIn: 'root'
})
export class BillTypeUsersPermissionsService extends BaseService<BillTypeUsersPermissions> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="BillTypeUsersPermissions";

  }

}
