import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { RentContract } from '../../models/rent-contracts';
import { AppConfigService } from '../local-services/app-config.service';
import { Observable } from 'rxjs';
import { RentContractDueVM } from '../../models/ViewModel/rent-contract-due-vm';
import { ContractStaisticsVM } from '../../models/ViewModel/contract-staistics-vm';
import { VouchersRentContractsDuesVM } from '../../models/ViewModel/vouchers-rent-contracts-dues-vm';



@Injectable({
    providedIn: 'root'
})
export class RentContractsService extends BaseService<RentContract> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="RentContracts";


  }
  addRequest(model: RentContract): Observable<RentContract> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<RentContract>(this.baseUrl + "/RentContracts/insert", model, { headers: this.apiHeaders });
  }

  insertOrUpdate(model: RentContract) {
    return this.addData("insertOrUpdate", model);
  }
  contractIssued(model: RentContract) {
    return this.addData("contractIssued", model);
  }
  generateEntryToDue(dueId:any) {
    return this.addData("GenerateEntryOnDue", dueId);
  }

  getLastContractCode(settingId:any)
  {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<any>(this.baseUrl + "/RentContracts/GetLastContractCode?settingId="+settingId, { headers: this.apiHeaders });
  }
  deleteRentContractAndRealtives(contractId:any)
  {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<any>(this.baseUrl + "/RentContracts/delete?id="+contractId, { headers: this.apiHeaders });
  }
  getVoucherRentContractDues(typeId: any) {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<VouchersRentContractsDuesVM[]>(this.baseUrl + '/RentContracts/GetVoucherRentContractDues?typeId=' + typeId , { headers: this.apiHeaders });
    
  }
  getRentContractAndMonths() {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<ContractStaisticsVM[]>(this.baseUrl + '/RentContracts/GetRentContractAndMonths' , { headers: this.apiHeaders });

   
  }
}
