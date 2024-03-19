import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { EquipmentsUsers } from '../../models/equipments-users';
import { AppConfigService } from '../local-services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsUsersService  extends BaseService<EquipmentsUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="EquipmentsUsers";
  

  }
}