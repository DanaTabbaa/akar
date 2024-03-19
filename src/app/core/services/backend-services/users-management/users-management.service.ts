import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { UsersUsers } from 'src/app/core/models/user-management/users-management';
import { HttpClient } from '@angular/common/http';
import { UserRegisterations } from 'src/app/core/models/user-registerations';
import { AppConfigService } from '../../local-services/app-config.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersManagementService extends BaseService<UsersUsers> {
  private readonly baseUrl = AppConfigService.appCongif.url;
  constructor(http: HttpClient) {
    super(http);
    this.path="Users";
  }
  // createSubUser(model: UserRegisterations): Observable<any> {
  //   this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
  //   return this.http.post<any>(this.baseUrl + '/Users/security/createsubuser', model, { headers: this.apiHeaders });
  // }
  activateUser(model): Observable<any> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(this.baseUrl + '/Users/security/activateUser', model, { headers: this.apiHeaders });
  }
  deActivateUser(model): Observable<any> {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.put<any>(this.baseUrl + '/Users/security/deActivateUser', model, { headers: this.apiHeaders });
  }


}
