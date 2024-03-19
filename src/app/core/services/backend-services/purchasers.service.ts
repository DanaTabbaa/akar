import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Purchasers } from '../../models/purchasers';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class PurchasersService extends BaseService<Purchasers> {
Purchasers
  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Purchasers";
  

  }
  addRequest(model: Purchasers): Observable<Purchasers> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Purchasers>(this.baseUrl + "/Purchasers/insert", model, { headers: this.apiHeaders });
  }
}

