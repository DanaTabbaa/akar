import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Attributes } from '../../models/attributes';

@Injectable({
  providedIn: 'root'
})
export class AttributeService extends BaseService<Attributes> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Attributes";
  

  }
 
}
