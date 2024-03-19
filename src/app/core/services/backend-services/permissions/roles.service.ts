import { Injectable } from '@angular/core';
import { Roles } from 'src/app/core/models/permissions/roles';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../local-services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService<Roles> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Roles";

  }
}
