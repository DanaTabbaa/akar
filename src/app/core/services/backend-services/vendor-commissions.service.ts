import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { VendorCommissions } from '../../models/vendor-commissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorCommissionsService extends BaseService<VendorCommissions> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="VendorCommissions";
  

  }
  addRequest(model: VendorCommissions): Observable<VendorCommissions> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<VendorCommissions>(this.baseUrl + "/VendorCommissions/insert", model, { headers: this.apiHeaders });
  }
}
