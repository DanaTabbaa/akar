import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserRegisterations } from 'src/app/core/models/user-registerations';
import { catchError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../local-services/app-config.service';
import { RequestResult } from '../../models/users-registerations/request-result';




@Injectable({
  providedIn: 'root'
})

export class UserRegisterationsService extends BaseService<UserRegisterations> {


  //#region Property
  private readonly baseUrl = AppConfigService.appCongif.url;
  //#endregion

  //#region Constructor
  constructor(http: HttpClient) {
    super(http);
    this.path = "UserRegisterations";

  }
  //#endregion

  //#region CRUD Operations
  register(model: UserRegisterations) {
    return this.addData("register", model);
  }
  getAllRequests() {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get(this.baseUrl + "/UserRegisterations",{ headers: this.apiHeaders });
  }

  addRequest(model: UserRegisterations) {
    return this.http.post<any>(this.baseUrl + "/UserRegisterations/Register", model, { headers: this.apiHeaders });
  }
  getRequestById(id: number) {
    return this.getById(id);
  }
  activateRequest(model: UserRegisterations) {
    model.requestStatus = 1;
    return this.updateWithUrl("Update",model);
  }
  cancelRequset(model: UserRegisterations) {
    
    model.requestStatus = 0;
    return this.updateWithUrl("Update",model);
  }

  deleteRequest(id: any) {
    return this.deleteWithUrl("Delete?id="+id);
  }



  checkUserRequestData(url: string) {

    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<RequestResult>(this.getFullURL(url), { headers: this.apiHeaders });
}



  //#endregion
}
