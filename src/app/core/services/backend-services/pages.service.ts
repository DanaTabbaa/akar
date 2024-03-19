import { Injectable } from '@angular/core';
import { Pages } from '../../models/pages-permissions/pages';
import { BaseService } from './base.service';
import { AppConfigService } from '../local-services/app-config.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PagesService extends BaseService<Pages> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Pages";

  }
}
