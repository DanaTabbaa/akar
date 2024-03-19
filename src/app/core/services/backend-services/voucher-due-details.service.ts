import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { VoucherDueDetails } from '../../models/voucher-due-details';

@Injectable({
  providedIn: 'root'
})
export class VoucherDueDetailsService extends BaseService<VoucherDueDetails> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="VoucherDueDetails";
  

  }
 
}
