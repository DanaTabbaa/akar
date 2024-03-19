import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegisterations } from '../../../core/models/user-registerations';
import { UserRegisterationsService } from 'src/app/core/services/backend-services/user-registerations.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertTypes, RegisterationTypeEnum, RegisterationTypeArEnum, UserTypeEnum, UserTypeArEnum } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from '../../../core/interfaces/ICustom-enum';
import { convertEnumToArray } from '../../../core/constants/enumrators/enums';
import { Countries } from '../../../core/models/countries';
import { CountriesService } from '../../../core/services/backend-services/countries.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsAlertsService } from '../../../core/services/local-services/notifications-alerts.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ResetPasswordVm } from 'src/app/core/models/ViewModel/reset-password-vm';
import { ForgetPasswordModel } from 'src/app/core/models/ViewModel/registeration/forget-password';
import { getOriginUrl } from 'src/app/core/helpers/helper';
import { AuthenticationService } from 'src/app/core/services/backend-services/authentication/authentication.service';
import { TokenStorageService } from 'src/app/core/services/backend-services/authentication/token-storage.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs'
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { RequestResult } from 'src/app/core/models/users-registerations/request-result';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissions } from 'src/app/core/models/permissions/roles-permissions';
import { AuthModel } from 'src/app/core/models/user-management/auth-model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { EMAIL_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { WebsiteService } from 'src/app/core/services/backend-services/website.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  closeDialog() {
    this.dialogRef.close();
  }

  digitalCodeIsSend = false;
  dataToResetPassword = {};
  //#region Main Declarations
  // UserRegisteration:UserRegisterations=new UserRegisterations();
  lang: string = '';
  errorMessage: any = "";
  subsList: Subscription[] = [];
  errorClass = ''
  userRegisterationForm!: FormGroup;
  userPermissions: RolesPermissions[] = [];
  userLoign!: FormGroup;
  psForgetForm!: FormGroup;
  psResetForm!: FormGroup;
  userTypes: ICustomEnum[] = [];
  registerationTypes: ICustomEnum[] = [];
  showOrganizationData: boolean = false;
  userRegisteration: UserRegisterations | undefined;
  dateType: number = 1;
  countries: Countries[] = [];
  //Response!: ResponseResult<UserRegisterations>;
  //userRole:Roles = new Roles() ;
  loading=false
  otp = '';
  isSubmitted = false;
  isForgetPasswordFailed = false;
  isForgetPasswordDone = false;
  showSuccess!: boolean;
  showError!: boolean;
  // letVerify = false
  forgetPassword = true
  isLoggedIn = false;
  isResetPasswordSuccess = false
  isLoginFailed = false;
  isResetPasswordDone = false;
  isResetPasswordFailed = false;
  resetPasswordUrlPath: string = "/security/resetpassword"
  commercialRegistrationIssueDate!:DateModel;
  isVerified = false 
  //#endregion main variables declarationss
  //#region Constructor
  constructor(
    private dialogRef: MatDialogRef<ForgetPasswordComponent>,
    private userRegisterationsService: UserRegisterationsService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private authService: AuthenticationService,
    private tokenStorageService: TokenStorageService,    
    private spinner: NgxSpinnerService,    
    private translate: TranslatePipe,
    private sharedServices: SharedService,
    private websiteService:WebsiteService,
    private rolesPermissionsService: RolesPermissionsService,
    private dateService:DateCalculation,
    private dialog: MatDialog
    
  ) {


    this.psForgetForm = this.fb.group({
      email: EMAIL_REQUIRED_VALIDATORS,
    });
  }
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    this.commercialRegistrationIssueDate = this.dateService.getCurrentDate();
    this.getLanguage();
    this.loadData();
  }
  backToLogin(){
    // this.dialog.open(DialogComponent, {
    // });
    this.closeDialog()
  }
  //#endregion
  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
  //#region Authentications
  //
  //
  //#endregion
  //#region Manage State
  //#endregion
  //#region Permissions
  //
  //#endregion
  //#region Basic Data
  ///Geting form dropdown list data
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }

  getUserTypes() {
    if (this.lang == 'en') {
      this.userTypes = convertEnumToArray(UserTypeEnum);
    }
    else {
      this.userTypes = convertEnumToArray(UserTypeArEnum);

    }

  }
  getUserRegisterType() {
    if (this.lang == 'en') {
      this.registerationTypes = convertEnumToArray(RegisterationTypeEnum)
    }
    else {
      this.registerationTypes = convertEnumToArray(RegisterationTypeArEnum)

    }
  }

  getUserRolePermissions(roleId) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.rolesPermissionsService.getAll("GetAll").subscribe({
        next: (res: any) => {


          this.userPermissions = res.data.filter(x => x.roleId == roleId).map((res: RolesPermissions[]) => {
            return res;
          });
          //(('res', res);
          //((' this.userPermissions', this.userPermissions);
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {
          //(('complete');
        },
      });
      this.subsList.push(sub);
    });

  }

  getUsers() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.authService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.countries = res.data.map((res: Countries[]) => {
            return res;
          });
          resolve();
          //(('res', res);
          //((' this.countries', this.countries);
        },
        error: (err: any) => {
          resolve();
          //reject(err);
        },
        complete: () => {
          //(('complete');
        },
      });
      this.subsList.push(sub);
    });

  }
  currentOriginUrl!: any;
  loadData() {
    this.getUserTypes();
    this.getUserRegisterType();
    this.spinner.show();
    this.websiteService.loadCountries().then(a => {
      this.countries = this.websiteService.getCountries();
      this.spinner.hide();
    }).catch(e => {
      this.spinner.hide();
    });
    this.currentOriginUrl = getOriginUrl();
  }

  verifyOtp(otp: string) {
    this.otp =  otp;
    // this.letVerify = true
  }
  onVerifyOtp(){
    // console.log('onVerifyOtp',this.otp);
    // TODO::api to verify digital code with this value 'this.otp' 
    this.isVerified = true
    this.digitalCodeIsSend = false
  }
  getStatusResetPassword(value: boolean) {
    this.isResetPasswordSuccess = value
    this.isVerified = false;
    this.forgetPassword = false
  }
  submited: boolean = false;

  onForgetPassword(): void {
    this.loading = true
    this.isSubmitted = true;
    this.isForgetPasswordFailed = this.isForgetPasswordDone = false;
    var forgotPassDto: ForgetPasswordModel = {
      email: this.psForgetForm.value.email,
      clientUrl: this.currentOriginUrl + this.resetPasswordUrlPath
    }
    if (this.psForgetForm.valid) {
      ;
      this.authService.forgetPassword(forgotPassDto).subscribe({
        next: result => {
          this.successMessage = this.translate.transform("messages.forget-password-success")
          this.tokenStorageService.saveToken(result.token);
          this.tokenStorageService.saveUser(result);
          this.isForgetPasswordFailed = false;
          this.isForgetPasswordDone = true;
          this.digitalCodeIsSend = true;
          this.forgetPassword = false
          this.loading = false
          console.log(result);
          this.dataToResetPassword = result.messageResult
          //this.userRole = this.tokenStorageService.getUser().role;
        },
        error: err => {
          this.errorClass = 'errorMessage';
          this.isForgetPasswordFailed = true;
          this.loading = false
          if (err.status == 0) {
            this.errorMessage = "Connection Error !";
          } else {
            this.errorMessage = this.translate.transform("login." + err?.error?.message ?? "email-not-found");
          }


        }
      });
    }
    else {
      this.isForgetPasswordFailed = true;
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));

    }
  }
  public validate(): void {
    if (this.psForgetForm.invalid) {
      for (const control of Object.keys(this.psForgetForm.controls)) {
        this.psForgetForm.controls[control].markAsTouched();
      }
      return;
    }




  }
  resetModel!: ResetPasswordVm;
  successMessage
  //#endregion
  //#region Helper Functions
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.userRegisterationForm.controls;
  }

  get psReset(): { [key: string]: AbstractControl } {
    return this.psForgetForm.controls;
  }
  get reset(): { [key: string]: AbstractControl } {
    return this.psResetForm.controls;
  }
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform('messageTitle.done'));
    } else if (responseStatus == true && AlertTypes.warning == alertType) {
      this.alertsService.showWarning(message, this.translate.transform('messageTitle.alert'));
    } else if (responseStatus == true && AlertTypes.info == alertType) {
      this.alertsService.showInfo(message, this.translate.transform('messageTitle.info'));
    } else if (responseStatus == false && AlertTypes.error == alertType) {
      this.alertsService.showError(message, this.translate.transform('messageTitle.wrong'));
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
 
  showRegiterationMessage(title: string, message: string) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.isYesNo = false;
  }
  checkDataResult!: RequestResult;
  checkData(email?, userName?, mobile?) {

    this.checkDataResult = new RequestResult();
    if (!stringIsNullOrEmpty(email) || !stringIsNullOrEmpty(userName) || !stringIsNullOrEmpty(mobile)) {
      const promise = new Promise<void>((resolve, reject) => {
        this.userRegisterationsService.checkUserRequestData("checkUserRequestData?email=" + email + "&userName=" + userName + "&mobile=" + mobile).subscribe({
          next: (res: any) => {
            this.checkDataResult = res;
            resolve();
            //(('res checkDataResult',this.checkDataResult );
          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {
            //(('complete');
          },
        });
      });
      return promise;
    }
    return
  }
  //#endregion

}
