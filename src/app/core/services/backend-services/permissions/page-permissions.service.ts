import { Injectable } from '@angular/core';
import { PagePermission } from 'src/app/core/models/pages-permissions/page-permissions';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { AppConfigService } from '../../local-services/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class PagePermissionsService extends BaseService<PagePermission> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PagesPermissions";


  }
}
