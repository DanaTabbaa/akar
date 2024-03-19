import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { BillsDues } from '../../models/bills-dues';




@Injectable({
    providedIn: 'root'
})
export class BillsDuesService extends BaseService<BillsDues> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="BillsDues";



  }


 


}
