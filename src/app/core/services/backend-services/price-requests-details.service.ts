import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { PriceRequestsDetails } from '../../models/price-requests-details';



@Injectable({
    providedIn: 'root'
})
export class PriceRequestsDetailsService extends BaseService<PriceRequestsDetails> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="PriceRequestsDetails";
  

  }
  addRequest(model: PriceRequestsDetails): Observable<PriceRequestsDetails> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<PriceRequestsDetails>(this.baseUrl + "/PriceRequestsDetails/insert", model, { headers: this.apiHeaders });
  }
}