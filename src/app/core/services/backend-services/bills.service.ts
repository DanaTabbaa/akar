import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Bill } from '../../models/bill';

@Injectable({
  providedIn: 'root'
})
export class BillsService extends BaseService<Bill> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Bills";
  }
  deleteBillAndRelations(billId:any)
  {
    return this.addData("deleteBillAndRelations",billId );

  }
  
}
