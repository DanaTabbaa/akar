import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BuildingFloor } from '../../models/buildings-floors';
import { AppConfigService } from '../local-services/app-config.service';




@Injectable({
    providedIn: 'root'
})
export class BuildingsFloorsService  extends BaseService<BuildingFloor> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="BuildingFloors";
  

  }

}
