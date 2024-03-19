import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { VoucherDetail } from '../../models/voucher-detail';

@Injectable({
  providedIn: 'root'
})
export class VoucherDetailsService extends BaseService<VoucherDetail> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="VoucherDetails";
  

  }
 
}