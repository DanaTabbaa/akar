import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AreaUsers } from '../../models/area-users';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})


export class AreaUserService extends BaseService<AreaUsers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
      super(http);
      this.path="AreaUser";
    
  
    }
 
   
}