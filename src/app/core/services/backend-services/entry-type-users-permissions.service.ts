import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { EntryTypeRolesPermissions } from '../../models/entry-type-roles-permissions';


@Injectable({
    providedIn: 'root'
})
export class EntryTypeUsersPermissionsService extends BaseService<EntryTypeRolesPermissions> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="EntryTypeRolesPermissions";



  }





}
