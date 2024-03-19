import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable,BehaviorSubject } from 'rxjs';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { Users } from 'src/app/core/models/users';
import { AppConfigService } from '../../local-services/app-config.service';
import { BaseService } from '../base.service';
import { ForgetPasswordModel } from 'src/app/core/models/ViewModel/registeration/forget-password';
import { ResetPasswordVm } from 'src/app/core/models/ViewModel/reset-password-vm';
import { UserRegisterations } from 'src/app/core/models/user-registerations';
import { TokenStorageService } from './token-storage.service';
import { AuthModel } from 'src/app/core/models/user-management/auth-model';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService extends BaseService<Users> {
  // isLoggedIn: boolean = false;
  httpOptions = null;
  rememberMe: boolean = false;
  private currentUserSubject!: BehaviorSubject<Users>;
  public currentUser!: Observable<Users>;
  //#region Property
  private readonly baseUrl = AppConfigService.appCongif.url;
  //#endregion
  //#region Constructor
  constructor(http: HttpClient, private tokenService: TokenStorageService) {
    super(http);
    this.path = "Users";
  }
  //#endregion
  //#region Operations
  login(username: string, password: string,rememberMe:boolean): Observable<any> {
    const body = { username, password,rememberMe };
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post<AuthModel>(this.baseUrl + '/Users/security/login',body, { headers: headers })

  }
  forgetPassword(modol:ForgetPasswordModel): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Users/security/forgetpassword',  modol, { headers: this.apiHeaders });
  }
  resetPassword(resetModel:ResetPasswordVm): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/Users/security/resetpassword',  resetModel, { headers: this.apiHeaders });
  }
  createUser(model: UserRegisterations, isActivate:boolean, requestId:number): Observable<any> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(this.baseUrl + '/Users/security/createuser?activate='+isActivate+"&requestId="+requestId, model, { headers: this.apiHeaders });
  }
  isLoggedIn() {
    let isLoggedIn
    if (!this.tokenService.getToken()) {
      isLoggedIn = false;
    } else {
      isLoggedIn = true
    }
    return isLoggedIn;
  }
   setLoginState(isLoggedIn: boolean) {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }
  get isLoggedInStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn === 'true';
  }

  //#endregion
}
