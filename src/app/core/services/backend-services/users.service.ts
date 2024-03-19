import { Injectable } from '@angular/core';
import { Users } from '../../models/users';
import { AppConfigService } from '../local-services/app-config.service';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { UserRegisterations } from '../../models/user-registerations';
import { RequestResult } from '../../models/users-registerations/request-result';
import { ResetPasswordVm } from '../../models/ViewModel/reset-password-vm';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService<Users> {

  //#region Property
  private readonly baseUrl = AppConfigService.appCongif.url;
  //#endregion


  //#region Constructor
  constructor(http: HttpClient) {
    super(http);
    this.path = "Users";

  }
  //#endregion



  //#region Operations
  getPublicContent(): Observable<any> {
    return this.http.get(this.baseUrl + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(this.baseUrl + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(this.baseUrl + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.baseUrl + 'admin', { responseType: 'text' });
  }
  createSubUser(model: Users): Observable<any> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(this.baseUrl + '/Users/security/createsubuser', model, { headers: this.apiHeaders });
  }

  changeActivateUserStatus(model, isActive:boolean): Observable<any> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(this.baseUrl + '/Users/security/ChangeActivateUserStatus?isActive='+isActive, model, { headers: this.apiHeaders });
  }
  // deActivateUser(model): Observable<any> {
  //   this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
  //   return this.http.put<any>(this.baseUrl + '/Users/security/deActivateUser', model, { headers: this.apiHeaders });
  // }

  checkUserRequestData(url: string) {

    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<RequestResult>(this.getFullURL(url), { headers: this.apiHeaders });
}

changePassword(resetModel:ResetPasswordVm): Observable<any> {
  return this.http.put<any>(this.baseUrl + '/Users/security/changepassword',  resetModel, { headers: this.apiHeaders });
}
  //#endregion
}
