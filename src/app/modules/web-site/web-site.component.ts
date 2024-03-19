import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { WEBSITE } from 'src/app/core/constants/constant';
import { AlertTypes } from 'src/app/core/constants/enumrators/enums';
import { selectLang } from 'src/app/core/helpers/style-helper';
import { AuthModel } from 'src/app/core/models/user-management/auth-model';
import { AuthenticationService } from 'src/app/core/services/backend-services/authentication/authentication.service';
import { TokenStorageService } from 'src/app/core/services/backend-services/authentication/token-storage.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
declare var webFunction :any;
@Component({
  selector: 'app-web-site',
  templateUrl: './web-site.component.html',
  styleUrls: ['./web-site.component.scss']
})
export class WebSiteComponent implements OnInit, OnDestroy {
  supportlanguages=['ar','en'];
  subsList:Subscription[] = [];
  errorMessage
  errorClass
  isLoggedIn
  isLoginFailed
  isLogin: boolean = false;

  constructor(private translateService:TranslateService,
    private tokenStorageService: TokenStorageService,
    private spinner:NgxSpinnerService,
    private translate:TranslatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private alertsService:NotificationsAlertsService,
    private authService: AuthenticationService) {
    this.translateService.addLangs(this.supportlanguages);
     this.translateService.use(localStorage.getItem("language")??'ar');
  }

  ngOnInit() {
     webFunction();
    selectLang(localStorage.getItem("language")??'ar',this.translateService,WEBSITE);
    
    this.route.url.subscribe(console.log);
    if (this.authService.isLoggedInStatus) {

       //this.onLoginRememberMe();
    }



  }

  ngOnDestroy(): void {
    this.subsList.forEach(s=>{
      if(s){
        s.unsubscribe();
      }
    });
  }

  onLoginRememberMe(): void {
    /** spinner starts on init */

    this.isLogin = true;
    const username = localStorage.getItem('username')!;
    const password = localStorage.getItem('password')!;
    if (this.authService.isLoggedInStatus) {      
     let sub =  this.authService.login(username,password,this.isLogin).subscribe({
        next: (data: AuthModel) => {
          this.spinner.show();
          if (this.isLogin) {
            this.authService.setLoginState(true);
            localStorage.setItem('username',username);
            localStorage.setItem('password', password);
          }
          this.tokenStorageService.saveToken(data.token);
          this.tokenStorageService.saveUser(data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('UserId', data.userId);
          localStorage.setItem('RoleId', data.role.id);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          // this.userRole = data.role;
         // this.showResponseMessage(data.isAuthenticated, AlertTypes.success, this.translate.transform('messages.login-success'));


          this.router.navigate(['/control-panel']).then(a => {
            this.spinner.hide();
           // window.location.reload();
          });

        },
        error: err => {
          this.spinner.hide();
          this.errorClass = 'errorMessage';
          this.isLoginFailed = true;
          if (err.status == 0) {
            this.errorMessage = this.translate.transform("validation-messages.connection-error");
          } else {
            this.errorMessage =this.translate.transform("validation-messages.faild-login");
          }
        }
      });
      this.subsList.push(sub);
    }
    else {
      this.isLoginFailed = true;
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));

    }
  }
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform('messageTitle.done'));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform('messageTitle.alert'));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform('messageTitle.info'));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform('messageTitle.wrong'));
    }
  }


}
