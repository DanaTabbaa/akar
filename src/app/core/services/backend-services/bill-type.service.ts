import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { BillType } from '../../models/bill-type';



@Injectable({
    providedIn: 'root'
})
export class  BillTypeService extends BaseService<BillType> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="BillTypes";
  

  }
}