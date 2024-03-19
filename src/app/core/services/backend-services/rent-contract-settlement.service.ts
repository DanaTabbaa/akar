import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RentContractSettlement } from '../../models/rent-contract-settlement';
import { AppConfigService } from '../local-services/app-config.service';
import { SettelmentDetailsVM, SettlementDetailsNewVM } from '../../view-models/settlement-details-vm';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class RentContractSettlementService extends BaseService<RentContractSettlement> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContractSettlement";
  

  }
  calculateContractSettelment(contractid: any, opDate: any) {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    
    return this.http.get<SettelmentDetailsVM[]>(this.baseUrl + '/RentContractSettlement/CalculateContractSettelment?contractId=' + contractid +
      "&opDate=" + opDate, { headers: this.apiHeaders });
    
  }

  createContractSettlement(model: SettlementDetailsNewVM): Observable<SettlementDetailsNewVM> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<SettlementDetailsNewVM>(this.baseUrl + "/RentContractSettlement/createContractSettlement", model, { headers: this.apiHeaders });
  }
  deleteContractSettlement(id: number) {
    
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.delete<any>(this.baseUrl + '/RentContractSettlement/deleteContractSettelment?contractId='+id
    , { headers: this.apiHeaders }
    );

  }
}