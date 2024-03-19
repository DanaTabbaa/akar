import { Injectable } from '@angular/core';
import { EntryTypeUsersPermissions } from 'src/app/core/models/entry-type-roles-permissions';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../local-services/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class EntryTypeUsersPermissionsService extends BaseService<EntryTypeUsersPermissions> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="EntryTypeUsersPermissions";


  }
}
