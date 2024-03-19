import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Voucher } from '../../models/voucher';

@Injectable({
  providedIn: 'root'
})
export class VouchersService extends BaseService<Voucher> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Vouchers";
  }
  // deleteVoucherAndRealtives(voucherId:any)
  // {
  //   return this.addData("deleteVoucherAndRelation",voucherId );

  // }
  
}
