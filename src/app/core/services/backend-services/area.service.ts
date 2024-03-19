import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Area } from '../../models/area';
import { AppConfigService } from '../local-services/app-config.service';



@Injectable({
    providedIn: 'root'
})


export class AreaService extends BaseService<Area> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
      super(http);
      this.path="Area";
    
  
    }
 
   
}