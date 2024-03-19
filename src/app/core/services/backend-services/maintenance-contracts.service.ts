import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { MaintenanceContracts } from '../../models/maintenance-contracts';



@Injectable({
    providedIn: 'root'
})
export class MaintenanceContractsService extends BaseService<MaintenanceContracts> {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="MaintenanceContracts";


  }
  generateEntry(maintenanceContractId:any) {
    return this.addData("generateEntry", maintenanceContractId);
  }
  deleteMaintenanceContractAndRealtives(contractId:any)
  {
    return this.addData("deleteMaintenanceContractAndRelation",contractId );

  }
  deleteMaintenanceContractAndRealtivesForUpdate(contractId:any)
  {
    return this.addData("deleteMaintenanceContractAndRelationForUpdate",contractId );

  }

}
