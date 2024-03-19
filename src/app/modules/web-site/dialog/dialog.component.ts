import { Component,ElementRef, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  
})
export class DialogComponent implements OnInit {
  // isForgetPasswordDone = false;
  // isLoggedIn = false;
  isLoginActive = true;
  openDialogForget(): void {
    this.dialog.open(ForgetPasswordComponent, {
    });
    this.closeDialog()
  }
  closeDialog() {
    this.dialogRef.close();
  }

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

  isSubmitted = false;
  isForgetPasswordFailed = false;
  isForgetPasswordDone = false;
  showSuccess!: boolean;
  showError!: boolean;
  isLoggedIn = false;
  isLoginFailed = false;
  isResetPasswordDone = false;
  isResetPasswordFailed = false;
  resetPasswordUrlPath: string = "/security/resetpassword"
  commercialRegistrationIssueDate!:DateModel;
  //#endregion main variables declarationss
  //#region Constructor
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogComponent>,
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
    private elementRef: ElementRef,
  ) {
    this.userRegisterationForm = this.fb.group({
      nameAr: '',
      nameEn: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      userName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      email: EMAIL_REQUIRED_VALIDATORS,
      mobile: ['', Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{11}$")])],
      countryId: '',
      registerTypeId: '',
      registerationDate: '',
      userTypeId: '',
      commercialRegistrationNo: '',
      commercialRegistrationIssueDate: '',
      unifiedNumber: '',
      attachmentId: '',
      requestStatus: '',
      marketingLicenceNo:''
    });

    this.userRegisterationForm.controls['userTypeId'].setValue(1);
    this.userRegisterationForm.controls['registerTypeId'].setValue(4);
    this.userLoign = this.fb.group({
      userName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      rememberMe: [true] // Set the default value of "Remember Me"
    });
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

  onSelectCommRegIssueDate(e:DateModel)
  {
    this.commercialRegistrationIssueDate = e;
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

  //#endregion
  //#region CRUD Operations
  isLogin: boolean = false;
  onLogin(): void {
    /** spinner starts on init */

    this.isLogin = true;

    if (this.userLoign.valid) {
      this.spinner.show();
      let sub = this.authService.login(this.userLoign.value.userName, this.userLoign.value.password, this.userLoign.value.rememberMe).subscribe({
        next: (data: AuthModel) => {
          this.spinner.hide();
          if (data.isActive) {


            if (this.userLoign.value.rememberMe) {
              localStorage.removeItem('username');
              localStorage.removeItem('password');
              this.authService.setLoginState(true);
              localStorage.setItem('username', this.userLoign.value.userName);
              localStorage.setItem('password', this.userLoign.value.password);
            }
            this.tokenStorageService.saveToken(data.token);
            this.tokenStorageService.saveUser(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('UserId', data.userId);
            localStorage.setItem('RoleId', data.role.id);
            
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            // this.userRole = data.role;
            // this.showResponseMessage(data.isAuthenticated, AlertTypes.success, this.translate.transform('messages.login-success'));

            this.router.navigate(['/']).then(a => {
              this.spinner.hide();
              window.location.reload();
            });
          } else {
            this.showResponseMessage(data.isActive, AlertTypes.error, this.translate.transform('messages.user-is-not-activated'));
            this.spinner.hide();
          }

        },
        error: err => {
          this.spinner.hide();
          this.errorClass = 'errorMessage';
          this.isLoginFailed = true;
          if (err.status == 0) {
            this.errorMessage = this.translate.transform("validation-messages.connection-error");
          } else {
            this.errorMessage = this.translate.transform("validation-messages.faild-login");
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
      return this.userLoign.markAllAsTouched();
    }
  }
  submited: boolean = false;
  isRegisterFaild = false;
  onRegister() {
    this.submited = true;
    this.isRegisterFaild = false;

    if (this.userRegisterationForm.valid) {
      this.userRegisterationForm.patchValue({ requestStatus: 0 });
      this.userRegisterationForm.controls["commercialRegistrationIssueDate"].setValue(this.dateService.getDateForInsert(this.commercialRegistrationIssueDate));
      this.spinner.show();
      let sub = this.userRegisterationsService.addWithResponse("AddWithCheck?uniques=UserName&uniques=Email&unique=Mobile", this.userRegisterationForm.value).subscribe({
        next: (result: ResponseResult<UserRegisterations>) => {
          // if (result.success) {

          //   this.showResponseMessage(result.success, AlertTypes.success, this.translate.transform("messages.register-success"));
          //   this.userRegisterationForm.reset();
          //   this.submited = false;
          //   setTimeout(() => {
          //     this.navigateUrl('/login');
          //     this.spinner.hide();
          //   }, 500);
          // } else {
          //   this.showResponseMessage(result.success, AlertTypes.error, this.translate.transform("messages-register-faild"));
          //   this.errorMessage = result.message;
          //   this.isRegisterFaild = true;
          //   setTimeout(() => {
          //     this.spinner.hide();
          //   }, 500);
          // }
          console.log("reg result",result);
          this.spinner.hide();

          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
          this.userRegisterationForm.patchValue({});
          } else if (result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.add-failed")
            );
          }
        },
        error: err => {
          this.errorClass = 'errorMessage';
          this.isRegisterFaild = true;
          if (err.status == 0) {
            this.errorMessage = "Connection Error !";
            this.spinner.hide();
          } else {
            this.errorMessage = err.message;
            this.spinner.hide();
          }
        }
      });
      this.subsList.push(sub);
    } else {
      this.isRegisterFaild = true;
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.userRegisterationForm.markAllAsTouched();
    }
  }
  clickRegister():void {
    const targetSection = this.elementRef.nativeElement.querySelector('#register-tab');
    if (targetSection) {
      targetSection.click();
    }
  }
  onForgetPassword(): void {

    ;
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
          //this.userRole = this.tokenStorageService.getUser().role;
        },
        error: err => {
          this.errorClass = 'errorMessage';
          this.isForgetPasswordFailed = true;
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
  get login(): { [key: string]: AbstractControl } {
    return this.userLoign.controls;
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
  resetForms() {
    this.isForgetPasswordDone = false;
    this.isLoggedIn = false;
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

  onUserTypeChange(e: any) {
     
    let comRegControl = this.userRegisterationForm.get('marketingLicenceNo')
    if (e) {
      if (e.id == 4) {

        comRegControl?.clearValidators();
        comRegControl?.updateValueAndValidity();


      }
      else if (e.id == 2) {
        comRegControl?.setValidators(Validators.compose([Validators.required]));
      }
      
    }

  }
}