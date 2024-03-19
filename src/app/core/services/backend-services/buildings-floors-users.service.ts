import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BuildingFloorUser } from '../../models/buildings-floors-users';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})


export class BuildingFloorUserService extends BaseService<BuildingFloorUser> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
      super(http);
      this.path="BuildingFloorUser";
    
  
    }
 
   
}