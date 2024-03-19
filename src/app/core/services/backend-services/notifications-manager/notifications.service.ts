import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../local-services/app-config.service';
import { BaseService } from '../base.service';
import { NotificationsManagementSettings } from 'src/app/core/models/notifications-manager/notifications-management-settings';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseService<NotificationsManagementSettings>  {

  private readonly baseUrl = AppConfigService.appCongif.url;
  
  constructor(http:HttpClient) {
    super(http);
    this.path="NotificationManagementSettings";
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


