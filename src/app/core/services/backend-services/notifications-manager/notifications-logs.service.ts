import { Injectable } from '@angular/core';
import { AppConfigService } from '../../local-services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsManagementLogs, VwNotificationManagementLogs } from 'src/app/core/models/notifications-manager/notifications-logs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsLogsService extends BaseService<NotificationsManagementLogs>  {

  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http:HttpClient) {
    super(http);
    this.path="NotificationsManagementLogs";
  }


  //#region Main Declarations


  //#endregion main variables declarationss

  //#region Constructor


  //#endregion

  //#region Authentications
  //
  //
  //#endregion

  //#region Manage State
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data


  //#endregion

  //#region CRUD Operations


  //#endregion

  //#region Helper Functions




  //#endregion
}
