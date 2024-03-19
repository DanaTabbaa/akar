import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { Suppliers } from '../../models/suppliers';



@Injectable({
    providedIn: 'root'
})
export class SuppliersService extends BaseService<Suppliers> {

  private readonly baseUrl = AppConfigService.appCongif.url;
    constructor(http: HttpClient) {
    super(http);
    this.path="Suppliers";
  

  }
  addRequest(model: Suppliers): Observable<Suppliers> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<Suppliers>(this.baseUrl + "/Suppliers/insert", model, { headers: this.apiHeaders });
  }
}

