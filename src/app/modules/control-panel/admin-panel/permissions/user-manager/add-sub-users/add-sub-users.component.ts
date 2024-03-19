//#region Import
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  AlertTypes,
  convertEnumToArray,
  RegisterationTypeArEnum,
  RegisterationTypeEnum,
  ToolbarActions,
  UserTypeEnum,
  UserTypeArEnum,
} from 'src/app/core/constants/enumrators/enums';
import {
  EMAIL_REQUIRED_VALIDATORS,
  EMAIL_VALIDATORS,
  MOBILE_REQUIRED_VALIDATORS,
  MOBILE_VALIDATORS,
  NAME_REQUIRED_VALIDATORS,
  Phone_REQUIRED_VALIDATORS,
  REQUIRED_VALIDATORS,
} from 'src/app/core/constants/input-validators';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Countries } from 'src/app/core/models/countries';
import { AuthModel } from 'src/app/core/models/user-management/auth-model';
import { UserRegisterations } from 'src/app/core/models/user-registerations';
import { TokenStorageService } from 'src/app/core/services/backend-services/authentication/token-storage.service';
import { CountriesService } from 'src/app/core/services/backend-services/countries.service';
import { UserRegisterationsService } from 'src/app/core/services/backend-services/user-registerations.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { UsersManagementService } from 'src/app/core/services/backend-services/users-management/users-management.service';
import { RequestResult } from 'src/app/core/models/users-registerations/request-result';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { RolesService } from 'src/app/core/services/backend-services/permissions/roles.service';
import { Roles } from 'src/app/core/models/permissions/roles';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { UsersService } from 'src/app/core/services/backend-services/users.service';
import { Users } from 'src/app/core/models/users';
import { RolesTypesService } from 'src/app/core/services/backend-services/permissions/roles-types.service';
import { RolesTypes } from 'src/app/core/models/permissions/roles-types';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID = 2; // from pages table in database seeding table
//#endregion
@Component({
  selector: 'app-add-sub-users',
  templateUrl: './add-sub-users.component.html',
  styleUrls: ['./add-sub-users.component.scss'],
})
export class AddSubUsersComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  activeTab = 1;
  userForm!: FormGroup;

  userRegisteration: UserRegisterations = new UserRegisterations();
  submited: boolean = false;
  errorMessage: any = '';
  errorClass = '';
  countries: Countries[] = [];
  userRequest: UserRegisterations = {} as UserRegisterations;
  userTypes: ICustomEnum[] = [];
  registerationTypes: ICustomEnum[] = [];
  users: UserRegisterations[] = [];
  userData!: AuthModel;
  roles: Roles[] = [];
  currentUser: UserRegisterations = new UserRegisterations();
  //Response!: ResponseResult<UserRegisterations>;
  currnetUrl;
  addUrl: string = '/control-panel/admin-panel/add-sub-user';
  updateUrl: string = '/control-panel/admin-panel/update-user/';
  listUrl: string = '/control-panel/admin-panel/user-manager';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-users-manager',
    componentAdd: 'component-names.add-user',
  };
  userRegisterations: UserRegisterations[] = [];
  //#endregion

  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private countriesService: CountriesService,
    private rolesServices: RolesService,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private tokenStorageService: TokenStorageService,
    private rolesPerimssionsService: RolesPermissionsService,
    private dateService: DateConverterService,
    private userService: UsersService,
    private userRigisterationService: UserRegisterationsService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private sharedServices: SharedService,
    private rolesTypesService: RolesTypesService,
    private managerService: ManagerService
  ) {
    this.createUserInfoForm();
    //this.Response = new ResponseResult<UserRegisterations>();
  }

  //#endregion
  sub: any;
  id: any;
  //#region ngOnInit
  ngOnInit(): void {
     
    this.getUserRegisterType();
    this.getUserTypes();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.getRoles(),
      this.getRolesType(),
      this.getAllUsers(),
      this.getUserRegisterations(),
      this.managerService.loadCountries(),
      this.managerService.loadPagePermissions(PAGEID)]).then(a => {
         
        this.getRouteData();
        this.changePath();
        this.listenToClickedButton();
      }).catch(e => {
         
        this.spinner.hide();
      })





  }

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {

        this.getUserById(Number(params['id'])).then(a => {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
          localStorage.setItem("RecordId", this.id);
        }).catch(e => {
          this.spinner.hide();
        });

      } else {
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
      }
    });

    this.subsList.push(sub);
  }
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      this.sharedServices.getLanguage().subscribe((res) => {
        resolve();
        this.lang = res;
      }, err => {
        resolve()
      });
    })

  }

  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }

  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
  //#region Permissions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService
  //       .getAll('GetPagePermissionById?pageId=' + pageId)
  //       .subscribe({
  //         next: (res: any) => {
  //           this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //           this.userPermissions = JSON.parse(
  //             this.rolePermission.permissionJson
  //           );
  //           this.sharedServices.setUserPermissions(this.userPermissions);
  //           resolve();
  //         },
  //        error: (err: any) => {
  //           this.spinner.hide();
  //           reject(err);
  //         },
  //         complete: () => {},
  //       });
  //   });
  //   return promise;
  // }
  // //#endregion

  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data

  // loadData() {
  //   this.sharedServices.changeButton({action:'List'} as ToolbarData)
  //   this.getAllUsers();
  //   this.createUserInfoForm();
  //   this.getUserTypes();
  //   this.getCountries();
  //   this.getUserRegisterType();
  //   this.getUserRegisterations();
  //   this.getRoles();
  //   this.activeTab = 2;
  // }
  createUserInfoForm() {
    this.userForm = this.fb.group({
      id: 0,
      userName: NAME_REQUIRED_VALIDATORS,
      email: EMAIL_REQUIRED_VALIDATORS,
      phoneNumber: Phone_REQUIRED_VALIDATORS,
      firstNameAr: NAME_REQUIRED_VALIDATORS,
      firstNameEn: NAME_REQUIRED_VALIDATORS,
      isActive: false,
      roleId: REQUIRED_VALIDATORS,
      defaultLanguage: this.lang,
    });
  }

  getUserTypes() {
    if (this.lang == 'en') {
      this.userTypes = convertEnumToArray(UserTypeEnum);
    } else {
      this.userTypes = convertEnumToArray(UserTypeArEnum);
    }
  }
  getUserRegisterType() {
    if (this.lang == 'en') {
      this.registerationTypes = convertEnumToArray(RegisterationTypeEnum);
    } else {
      this.registerationTypes = convertEnumToArray(RegisterationTypeArEnum);
    }
  }
  getRoles() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.rolesServices.getWithResponse<Roles[]>('GetAll').subscribe({
        next: (res: ResponseResult<Roles[]>) => {
          resolve();
          if (res.data) {
            this.roles = res.data;
          }


          //((' this.countries', this.countries);
        },
        error: (err: any) => {
          //reject(err);
          resolve();
        },
        complete: () => {
          //(('complete');
        },
      });
      this.subsList.push(sub);
    });

  }
  rolesTypes: RolesTypes[] = [];
  getRolesType() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.rolesTypesService.getWithResponse<RolesTypes[]>('GetAllData').subscribe({
        next: (res: ResponseResult<RolesTypes[]>) => {
          resolve();
          if (res.data) {
            this.rolesTypes = res.data;
          }


        },
        error: (err: any) => {
          // reject(err);
          resolve();
        },
        complete: () => {
          //(('complete');
        },
      });

      this.subsList.push(sub);
    });

  }
  // getCountries() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.countriesService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         this.countries = res.data.map((res: Countries[]) => {
  //           return res;
  //         });
  //         resolve();
  //         //((' this.countries', this.countries);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {},
  //     });
  //   });
  //   return promise;
  // }
  // setUserData() {
  //   this.userForm.patchValue({
  //     countryId: this.currentUser.countryId,
  //     registerTypeId: this.currentUser.registerTypeId,
  //     registerationDate: this.currentUser.registerationDate,
  //     userTypeId: this.currentUser.userTypeId,
  //     commercialRegistrationNo: this.currentUser.commercialRegistrationNo,
  //     commercialRegistrationIssueDate:
  //       this.currentUser.commercialRegistrationNo,
  //     unifiedNumber: this.currentUser.unifiedNumber,
  //     attachmentId: this.currentUser.attachmentId,
  //     requestStatus: this.currentUser.requestStatus,
  //     // email: this.currentUser.email,
  //     mobile: this.currentUser.mobile,
  //   });
  // }
  getAllUsers() {
    this.userData = this.tokenStorageService.getUser();
    return new Promise<void>((resolve, reject) => {
      let sub = this.userRigisterationService.getWithResponse<[]>('GetAll').subscribe({
        next: (res: ResponseResult<UserRegisterations[]>) => {
          resolve();
          if (this.userData != null) {
            if (res.data) {
              this.users = res.data
              this.currentUser = this.users.find(
                (x) => x.email == this.userData.email
              )!;
              if (this.currentUser != null) {
                // this.setUserData();
              }
            }




          } else {
            if (res.data) {
              this.users = res.data;
            }

          }


        },
        error: (err: any) => {
          resolve();
          //reject(err);
        },
        complete: () => {
          //(('complete');
        },
      });
      this.subsList.push(sub)
    });

  }

  setFormValue() {
    this.userForm.patchValue({
      id: this.user?.id,
      userName: this.user?.userName,
      firstNameAr: this.user?.firstNameAr,
      firstNameEn: this.user?.firstNameEn,
      email: this.user?.email,
      isActive: this.user.isActive,
      isAdmin: this.user.isAdmin,
      isSuperAdmin: this.user.isSuperAdmin,
      phoneNumber: this.user?.phoneNumber,
      roleId: this.user.roleId,
      defaultLanguage: this.user.defaultLanguage,
    });
  }

  isUpdateClicked: boolean = false;
  user!: Users;
  getUserById(id: any) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.userService.getWithResponse<Users>('GetById?id=' + id).subscribe({
        next: (res: ResponseResult<Users>) => {
          resolve();
          if (res.success) {
            this.user = JSON.parse(JSON.stringify(res.data));
            this.setFormValue();
          }


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

  getUserRegisterations() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.userRigisterationService.getWithResponse<UserRegisterations[]>('GetAll').subscribe({
        next: (res: ResponseResult<UserRegisterations[]>) => {
          resolve();
          if (res.data) {
            this.userRegisterations = res.data
          }


        },
        error: (err: any) => {
          resolve();
          // reject(err);
        },
        complete: () => { },
      });
      this.subsList.push(sub);
    });

  }
  //#endregion

  // changeActivateUserStatus(item: UserRegisterations) {
  //    new Promise<void>((resolve, reject) => {
  //     this.userService.activateUser(item).subscribe({
  //       next: (res: any) => {
  //         let response = JSON.parse(JSON.stringify(res));
  //         //(("activateUser response   ", response)
  //         if (response.success) {
  //           this.showResponseMessage(
  //             response.success,
  //             AlertTypes.info,
  //             this.translate.transform('messages.activate-user-success')
  //           );
  //         } else if (response.success == false) {
  //           this.showResponseMessage(
  //             response.success,
  //             AlertTypes.warning,
  //             this.translate.transform('messages.existing-user')
  //           );
  //         }
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }
  // deActivateUser(item: UserRegisterations) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.userService.deActivateUser(item).subscribe({
  //       next: (res: any) => {
  //         let response = JSON.parse(JSON.stringify(res));
  //         //(("activateUser response   ", response)
  //         if (response.success) {
  //           this.showResponseMessage(
  //             response.success,
  //             AlertTypes.info,
  //             this.translate.transform('messages.deactivate-user-success')
  //           );
  //         } else if (response.success == false) {
  //           this.showResponseMessage(
  //             response.success,
  //             AlertTypes.warning,
  //             this.translate.transform('messages.existing-user')
  //           );
  //         }
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }

  submitCount = 0;
  //#region CRUD Operations
  onSave() {


    if (this.userForm.valid) {
      // this.submitCount++;
      // this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      this.userForm.value.id = 0;
      this.spinner.show();
      this.confirmSave().then(a=>{
        this.spinner.hide();
      }).catch(e=>{
        this.spinner.hide();
      });
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.userForm.markAllAsTouched();
    }
  }

  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.userService.addWithResponse<Users>("AddWithCheck?uniques=Email&uniques=UserName",this.userForm.value).subscribe({
        next: (result: ResponseResult<Users>) => {
           
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            navigateUrl(this.listUrl, this.router);
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
        error: (err: any) => {
          //reject(err);
          resolve();
          
        },
        complete: () => {
          //(('complete');

          this.spinner.hide();
        },
      });
      this.subsList.push(sub);
    });

  }

  onUpdate() {
    if (this.userForm.value != null && this.userForm.valid) {
      this.spinner.show();
      new Promise<void>((resolve, reject) => {
        let sub = this.userService
          .updateWithUrl('UpdateWithCheck?uniques=UserName&uniques=Email', this.userForm.value)
          .subscribe({
            next: (result: ResponseResult<Users>) => {
              this.spinner.hide();
              if (result.success && !result.isFound) {
                this.showResponseMessage(
                  result.success, AlertTypes.success, this.translate.transform("messages.add-success")
                );
                navigateUrl(this.listUrl, this.router);
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
                  this.translate.transform("messages.update-failed")
                );
              }

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
      
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.userForm.markAllAsTouched();
    }
  }
  //#endregion

  //#region Helper Functions
  //form group
  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  ///
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }
  // showConfirmDeleteMessage(id: number) {
  //   const modalRef = this.modalService.open(MessageModalComponent);
  //   modalRef.componentInstance.message = this.translate.transform(
  //     'messages.confirm-delete'
  //   );
  //   modalRef.componentInstance.title =
  //     this.translate.transform('messages.delete');
  //   modalRef.componentInstance.isYesNo = true;
  //   modalRef.result.then((rs) => {
  //     //((rs);
  //     if (rs == 'Confirm') {
  //       this.spinner.show();
  //       this.userRigisterationService
  //         .deleteWithUrl('Delete?id=' + id)
  //         .subscribe((resonse) => {
  //           //(('delet response', resonse);
  //           this.getUserRegisterations();
  //           setTimeout(() => {
  //             if (resonse.success == true) {
  //               this.showResponseMessage(
  //                 resonse.success,
  //                 AlertTypes.success,
  //                 this.translate.transform('messages.delete-success')
  //               );
  //             } else if (resonse.success == false) {
  //               this.showResponseMessage(
  //                 resonse.success,
  //                 AlertTypes.error,
  //                 this.translate.transform(
  //                   'messages.cant-delete-current-loged-user'
  //                 )
  //               );
  //             }
  //             this.spinner.hide();
  //           }, 500);
  //         });
  //     }
  //   });
  // }
  //#endregion

  //#region Date Picker
  commercialRegistrationIssueDate!: DateModel;
  isCommercialRegistrationIssueDateExpired: boolean = false;
  onSelectCommercialRegistrationIssueDate: boolean = false;

  getCommercialRegistrationIssueDate(selectedDate: DateModel) {
    this.isCommercialRegistrationIssueDateExpired =
      this.dateService.checkDocomentDateIsValid(selectedDate);
    if (this.isCommercialRegistrationIssueDateExpired == false) {
      this.onSelectCommercialRegistrationIssueDate = true;
      this.commercialRegistrationIssueDate = selectedDate;
    } else {
      this.onSelectCommercialRegistrationIssueDate = false;
    }
  }

  //#endregion
  //#region Toolbar
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.router.navigateByUrl(this.listUrl);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            // this.activeTab = 1;
            this.toolbarPathData.componentAdd = 'component-names.add-user';
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.createUserInfoForm();
            this.getAllUsers();
            this.router.navigateByUrl(this.addUrl);
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }

  onSelcetList() {
    this.getUserRegisterations();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.listenToClickedButton();
  }
  onSelcetAdd() {
    this.sharedServices.changeButton({
      action: 'Save',
      submitMode: false,
    } as ToolbarData);
    this.listenToClickedButton();
  }

  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  //#endregion

  //#region Tabulator
  lang: string = '';

  checkEmailResult!: RequestResult;
  checkMobileResult!: RequestResult;
  checkUserNameResult!: RequestResult;
  responseMessageEmail;
  responseMessageMobile;
  responseMessageUserName;
  checkExistingEmail(email) {
    this.checkEmailResult = new RequestResult();
    if (!stringIsNullOrEmpty(email)) {
      const promise = new Promise<void>((resolve, reject) => {
        this.userService
          .checkUserRequestData('checkUserEmail?email=' + email)
          .subscribe({
            next: (res: any) => {
              this.checkEmailResult = res;
              if (res.isEmailExist) {
                this.responseMessageEmail = this.translate.transform(
                  'messages.email-is-exist'
                );
              }

              resolve();
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              //(('complete');
            },
          });
      });
      return promise;
    }
    return;
  }
  checkExistingMobile(mobile?) {
    this.checkMobileResult = new RequestResult();
    if (!stringIsNullOrEmpty(mobile)) {
      const promise = new Promise<void>((resolve, reject) => {
        this.userService
          .checkUserRequestData('checkUserMobile?mobile=' + mobile)
          .subscribe({
            next: (res: any) => {
              this.checkMobileResult = res;
              if (res.isUserMobileExist) {
                this.responseMessageMobile = this.translate.transform(
                  'messages.mobile-is-exist'
                );
              }
              resolve();
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              //(('complete');
            },
          });
      });
      return promise;
    }
    return;
  }
  checkExistingUserName(userName) {
    this.checkUserNameResult = new RequestResult();
    if (!stringIsNullOrEmpty(userName)) {
      const promise = new Promise<void>((resolve, reject) => {
        this.userService
          .checkUserRequestData('checkUserName?userName=' + userName)
          .subscribe({
            next: (res: any) => {
              this.checkUserNameResult = res;
              if (res.isUserNameExist) {
                this.responseMessageUserName = this.translate.transform(
                  'messages.user-name-is-exist'
                );
              }
              resolve();
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              //(('complete');
            },
          });
      });
      return promise;
    }
    return;
  }

  //#endregion
}
