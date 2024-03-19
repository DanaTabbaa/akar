import { Injectable } from '@angular/core';
import { ResponsiblePersons } from '../../models/responsible-persons';
import { BaseService } from './base.service';
import { AppConfigService } from '../local-services/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResponsiblePersonsService  extends BaseService<ResponsiblePersons> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="ResponsiblePersons";


  }

}
