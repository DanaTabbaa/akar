import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { getDataFromUrl, getTokenFromUrl } from 'src/app/core/helpers/helper';
import { AuthenticationService } from 'src/app/core/services/backend-services/authentication/authentication.service';
import { TokenStorageService } from 'src/app/core/services/backend-services/authentication/token-storage.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';


import Validation from 'src/app/core/helpers/confirm-password-validation';
import { ResetPasswordVm } from 'src/app/core/models/ViewModel/reset-password-vm';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UsersService } from 'src/app/core/services/backend-services/users.service';
import { Subscription } from 'rxjs';
import { Users } from 'src/app/core/models/users';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
const PAGEID = 2;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {

  //#region Main Declarations
  // UserRegisteration:UserRegisterations=new UserRegisterations();
  errorMessage: any = "";
  errorClass = ''
  resetPasswordForm!: FormGroup;
  showSuccess!: boolean;
  showError!: boolean;
  isSubmitted: boolean = true;
  isResetPasswordDone = false;
  isResetPasswordFailed = false;
  resetPasswordUrlPath: string = ""
  roles: any;
  changePasswordUrl: string = '/control-panel/admin-panel/change-password';
  addUrl: string = '/control-panel/admin-panel/add-sub-user';
  updateUrl: string = '/control-panel/admin-panel/update-user/';
  listUrl: string = '/control-panel/admin-panel/user-manager';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-users-manager',
    componentAdd: 'component-names.change-password',
  };
  //#endregion main variables declarationss

  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private AlertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private usersService: UsersService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService


  ) {

    this.createChangePasswordForm();
    this.resetPasswordForm.reset();
    //this.user=new Users()



  }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.loadData();

  }
  //#endregion
  createChangePasswordForm() {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }
  //#region ngOnDestroy
  ngOnDestroy() {

  }
  //#endregion

  //#region Authentications
  //#region Permissions
  //  rolePermission!: RolesPermissionsVm;
  //  userPermissions!: UserPermission;
  user: Users = new Users();
  //  getPagePermissions(pageId) {
  //    const promise = new Promise<void>((resolve, reject) => {
  //      this.rolesPerimssionsService
  //        .getAll('GetPagePermissionById?pageId=' + pageId)
  //        .subscribe({
  //          next: (res: any) => {
  //            this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //            this.userPermissions = JSON.parse(
  //              this.rolePermission.permissionJson
  //            );
  //            this.sharedService.setUserPermissions(this.userPermissions);
  //            resolve();
  //          },
  //          error: (err: any) => {
  //            reject(err);
  //          },
  //          complete: () => {},
  //        });
  //    });
  //    return promise;
  //  }
  getUserById(id: any) {

    return new Promise<void>((resolve, reject) => {
      this.usersService
        .getWithResponse<Users>('GetById?id=' + id)
        .subscribe({
          next: (res: ResponseResult<Users>) => {
            //((' getById getUserRequestById this.res', res);
            resolve();
            if (res.data) {
              this.user = res.data;
            }



          },
          error: (err: any) => {
            resolve();
            //reject(err);
            //this.spinner.hide()
          },
          complete: () => {
            //(('complete');
            //this.spinner.hide()
          },
        });
    });

  }

  //#endregion
  //#endregion

  //#region Manage State
  //#endregion

  //#region Permissions
  //
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  userId: any;
  currentUserId: any = localStorage.getItem("UserId");
  isNotCurrentUser: boolean = false;
  loadData() {
    this.spinner.show();

    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),

    ]).then(a => {
      this.getRouteData();
      this.sharedService.changeToolbarPath(this.toolbarPathData);
      this.sharedService.changeButton({ action: 'ChangePassword' } as ToolbarData)
      this.listenToClickedButton();
    }).catch(e => {
      this.spinner.hide();
    })




  }

  getRouteData() {
    let sub = this.route.queryParams.subscribe({
      next: (params) => {

        if (Number(params['userId'])) {
          this.isNotCurrentUser = true;
          this.userId = Number(params['userId']);
          this.getUserById(this.userId).then(a => {
            this.spinner.hide();
          }).catch((e => {
            this.spinner.hide();
          }))
        } else {
          this.currentUserId = localStorage.getItem("UserId");
          if (this.currentUserId ?? false) {
            this.isNotCurrentUser = false;
            this.getUserById(this.currentUserId).then(a => {
              this.spinner.hide();
            }).catch(e => {
              this.spinner.hide();
            })
          }

        }
      }
    })

    this.subsList.push(sub);
  }
  //  userData:any;
  //   setResetToken() {
  //     let accessToken;

  //     accessToken = getTokenFromUrl();
  //     if (accessToken != null) {
  //       localStorage.getItem('email');
  //       this.userData = getDataFromUrl();

  //     }
  //     //(("userdata", this.userData)

  //   }

  //#endregion

  //#region CRUD Operations







  resetModel!: ResetPasswordVm;
  successMessage



  onChangePassword() {

    if (this.resetPasswordForm.valid) {
      this.resetModel = { ...this.resetPasswordForm.value }
      this.resetModel.userId = this.userId ?? this.currentUserId;
      this.resetModel.email = localStorage.getItem('email')!;
      this.spinner.show();
      let sub = this.usersService.changePassword(this.resetModel).subscribe({
        next: data => {
          this.spinner.hide();
          this.showResponseMessage(data.isAuthenticated, AlertTypes.success, this.translate.transform("messages.password-changed-successfully"));
          if (this.userId ?? false) {
            this.router.navigate([this.listUrl]);
          } 
        },
        error: err => {
          this.spinner.hide()
          this.errorClass = 'errorMessage';
          if (err.status == 0) {
            this.errorMessage = this.translate.transform("validation-messages.connection-error");
          } else {
            this.errorMessage = err.error.message;
          }
        }
      });
      this.subsList.push(sub);
    }
    else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.AlertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.resetPasswordForm.markAllAsTouched();
    }


  }








  //#endregion

  //#region Helper Functions
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }



  get f(): { [key: string]: AbstractControl } {
    return this.resetPasswordForm.controls;
  }
  showResponseMessage(responseStatus, alertType, message) {
    ;
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.AlertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning == alertType) {
      this.AlertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info == alertType) {
      this.AlertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error == alertType) {
      this.AlertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }

  reloadPage(): void {
    window.location.reload();
  }



  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedService.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (
            currentBtn.action == ToolbarActions.ChangePassword &&
            currentBtn.submitMode
          ) {
            this.onChangePassword();
          }
        }
      },
    });
    this.subsList.push(sub);
  }

}
