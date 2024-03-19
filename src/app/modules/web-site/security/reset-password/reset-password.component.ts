import { Component, OnInit , Input, EventEmitter, Output} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import Validation from 'src/app/core/helpers/confirm-password-validation';
import { getDataFromUrl, getOriginUrl, getTokenFromUrl } from 'src/app/core/helpers/helper';
import { ForgetPasswordModel } from 'src/app/core/models/ViewModel/registeration/forget-password';
import { ResetPasswordVm } from 'src/app/core/models/ViewModel/reset-password-vm';
import { AuthenticationService } from 'src/app/core/services/backend-services/authentication/authentication.service';
import { TokenStorageService } from 'src/app/core/services/backend-services/authentication/token-storage.service';


import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @Input() dataEmail: any;
  @Output() isResetPasswordSuccess = new EventEmitter<boolean>();
  //#region Main Declarations
  // UserRegisteration:UserRegisterations=new UserRegisterations();
  errorMessage: any = "";
  errorClass = ''
  psResetForm!: FormGroup;
  showSuccess!: boolean;
  showError!: boolean;
  isSubmitted: boolean = true;
  isResetPasswordDone = false;
  isResetPasswordFailed = false;
  resetPasswordUrlPath: string = ""
  roles: any;
  //#endregion main variables declarationss

  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private AlertsService: NotificationsAlertsService,
    private authenticationService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private translateService: TranslateService,


  ) {


    this.psResetForm = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );

  }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.loadData();

  }
  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {
    ;
    localStorage.removeItem('token')
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

  loadData() {
    this.setResetToken();
    this.route.queryParams.subscribe({next:(params)=>{
    //(("parmas",params)
    }})
  }
 userData:any;
  setResetToken() {
    let accessToken;

    accessToken = getTokenFromUrl();
    if (accessToken != null) {
      localStorage.setItem('token', accessToken);
      this.userData = getDataFromUrl();

    }
    //(("userdata", this.userData)

  }

  //#endregion

  //#region CRUD Operations







  resetModel!: ResetPasswordVm;
  successMessage



  onResetPassword() {
    ;
    this.isSubmitted = true;
    
    this.isResetPasswordFailed = this.isResetPasswordDone = false;
    if (this.psResetForm.valid) {
      this.resetModel = { ...this.psResetForm.value }
      this.resetModel.email = this.dataEmail.reciever;
      console.log(this.dataEmail.reciever);
      
      this.authenticationService.resetPassword(this.resetModel).subscribe({
        next: data => {
          ;
          this.successMessage = 'The link has been sent, please check your email to reset your password.'
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);
          this.isResetPasswordFailed = false;
          this.isResetPasswordSuccess.emit(true);
          this.isResetPasswordDone = true;
          this.roles = this.tokenStorage.getUser().roles;
          setTimeout(() => {
            this.router.navigate(['/home']);

          },500);


        },
        error: err => {
          ;
          this.errorClass = 'errorMessage';
          this.isResetPasswordFailed = true;
          if (err.status == 0) {
            this.errorMessage = "Connection Error !";
          } else {
            this.errorMessage = err.error.message;
          }
        }
      });
    }
    else {
      this.isResetPasswordFailed = true;
      this.errorMessage = "Please enter valid data !";
      this.errorClass = 'errorMessage';
      this.AlertsService.showError(this.errorMessage, "خطأ");
      return this.psResetForm.markAllAsTouched();
    }


  }








  //#endregion

  //#region Helper Functions
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }



  get reset(): { [key: string]: AbstractControl } {
    return this.psResetForm.controls;
  }
  showResponseMessage(responseStatus, message) {
    if (responseStatus != false) {
      this.AlertsService.showSuccess(message, "نجاح")
    } else {
      this.AlertsService.showError(message, "خطأ")

    }

  }

  reloadPage(): void {
    window.location.reload();
  }

  showRegiterationMessage() {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = "تم التسجيل بنجاح";
    modalRef.componentInstance.title = "طلب تسجيل";
    modalRef.componentInstance.isYesNo = false;

  }

}
