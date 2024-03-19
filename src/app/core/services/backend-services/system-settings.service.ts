import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { SystemSettings } from '../../models/system-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService extends BaseService<SystemSettings> {
  showDecimalPoint:any;
  showThousandsComma:any;
  showRoundingFractions:any;
  numberOfFraction:any;
  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="SystemSettings";
    this.getSystemSettings();

  }
  addRequest(model: SystemSettings): Observable<SystemSettings> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<SystemSettings>(this.baseUrl + "/SystemSettings/insertOrUpdate", model, { headers: this.apiHeaders });
  }
  _addRequest(model: SystemSettings) {
    return this.addData("insertOrUpdate", model);
  }

  setDecimalNumber(number:any)
  {
   
    let decimalNumber =number;
    if(typeof(number)!=typeof(Number))
    {
       decimalNumber= Number(number);
    }
    if((this.showDecimalPoint??false) && (this.numberOfFraction??0)>0)
    {
      return Math.round(number).toFixed(this.numberOfFraction)
    }else{
      return number;
    }
  }


  setDecimalNumberSetting(number:any,showDecimalPoint:boolean, numberOfFraction:number )
  {   
    let decimalNumber =number;
    if(typeof(number)!=typeof(Number))
    {
       decimalNumber= Number(number);
    }
    if((showDecimalPoint??false) && (numberOfFraction??0)>0)
    {
      return decimalNumber.toFixed(numberOfFraction)
    }else{
      return number;
    }
  }

  getSystemSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.getAll("GetAll").subscribe({
        next: (res: any) => {
          //(("result data", res.data);
          this.showDecimalPoint = res.data[0].showDecimalPoint
          this.showThousandsComma = res.data[0].showThousandsComma
          this.showRoundingFractions = res.data[0].showRoundingFractions
          this.numberOfFraction = res.data[0].numberOfFraction
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }


}
