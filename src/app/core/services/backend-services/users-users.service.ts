import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { UsersUsers } from '../../models/usersusers';




@Injectable({
    providedIn: 'root'
})
export class UsersUsersService extends BaseService<UsersUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="UsersUsers";



  }





}
