import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../local-services/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class ApiConnectionService {
  //#region Property
  private readonly baseUrl = AppConfigService.appCongif.url;
  //#endregion
  constructor(private httpClient: HttpClient) { }
  checkIfCoreApiIsAvailable() {
    var pingUrl = this.baseUrl + "/countries";
    //(("this.httpClient.get(pingUrl);",this.httpClient.get(pingUrl))
    return this.httpClient.get(pingUrl);
}
}
