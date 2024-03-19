import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Offers } from '../../models/offers';
import { AppConfigService } from '../local-services/app-config.service';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OffersService extends BaseService<Offers>{

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
  super(http);
  this.path="offers";

}

}
