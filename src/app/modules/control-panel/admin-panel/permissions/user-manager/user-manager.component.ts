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
  EMAIL_VALIDATORS,
  MOBILE_VALIDATORS,
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
import { Users } from 'src/app/core/models/users';
import { UsersService } from 'src/app/core/services/backend-services/users.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 2; // from pages table in database seeding table
//#endregion
@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss'],
})
export class UserManagerComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  activeTab = 1;
  UserRegisterationForm!: FormGroup;
  userRegisteration: UserRegisterations = new UserRegisterations();
  submited: boolean = false;
  errorMessage: any = '';
  errorClass = '';
  countries: Countries[] = [];
  userRequest: UserRegisterations = {} as UserRegisterations;
  userTypes: ICustomEnum[] = [];
  registerationTypes: ICustomEnum[] = [];
  users: Users[] = [];
  userDate!: AuthModel;
  roles: Roles[] = [];
  currentUser!: Users;
  Response!: ResponseResult<UserRegisterations>;
  currnetUrl;
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
    componentAdd: 'component-names.add-user',
  };
  userRegisterations: UserRegisterations[] = [];

  //#endregion

  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private rolesServices: RolesService,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,


    private dateService: DateConverterService,
    private userService: UsersService,

    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private sharedServices: SharedService,
    private managerService: ManagerService
  ) {
    //this.createUserInfoForm();
    //this.Response = new ResponseResult<UserRegisterations>();
  }

  //#endregion
  sub: any;
  id: any;
  //#region ngOnInit
  ngOnInit(): void {
    this.spinner.show();
    this.defineGridColumn();

    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.getAllUsers(),
      this.getRoles(),

    ]).then(a => {
      this.spinner.hide();
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.listenToClickedButton();

    }).catch(e => {
      this.spinner.hide();
    });






  }
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      this.sharedServices.getLanguage().subscribe((res) => {
        resolve();
        this.lang = res;
      }, err => {
        resolve();
      });

    });

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
  //#endregion

  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data


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
          if (res.success) {
            this.roles = res.data ?? [];
          }          //((' this.countries', this.countries);
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
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }

  getAllUsers() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.userService.getWithResponse<Users[]>('GetAll').subscribe({
        next: (res: any) => {
          resolve();
          if (res.success) {
            this.users = res.data ?? [];
          }

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





  //#endregion

  changeActivateUserStatus(item: Users, isActive:boolean) {
    console.log("Activate User", item);
    this.spinner.show();

    return new Promise<void>((resolve, reject) => {
      let sub = this.userService.changeActivateUserStatus(item,isActive).subscribe({
        next: (res: any) => {
          resolve();
          let response = JSON.parse(JSON.stringify(res));

          //(("activateUser response   ", response)
          if (response.success) {
            this.getAllUsers().then(a => {
              this.spinner.hide();
            }).catch(e => {
              this.spinner.hide();
            })

            this.showResponseMessage(response.success, AlertTypes.info, this.translate.transform("messages.activate-user-success"))
          } else if (response.success == false) {
            this.spinner.hide();
            this.showResponseMessage(response.success, AlertTypes.warning, this.translate.transform("messages.existing-user"))
          }


        },
        error: (err: any) => {
          this.spinner.hide();
          reject(err);
        },
        complete: () => {



        },

      });
      this.subsList.push(sub);
    });

  }

  // cancelRequset(item: UserRegisterations) {
  //   this.userRigisterationService.cancelRequset(item).subscribe((response) => {
  //     //(("response Cancel Requset", response)
  //   });
  // }
  // deActivateUser(item: UserRegisterations) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.userService.changeActivateUserStatus(item, false).subscribe({
  //       next: (res: any) => {
  //         let response = JSON.parse(JSON.stringify(res));
  //         //(("cancelRequset response   ", response)
  //         ;
  //         if (response.success) {
  //           this.showResponseMessage(response.success, AlertTypes.info, this.translate.transform("messages.deactivate-user-success"))

  //         } else if (response.success == false) {
  //           this.showResponseMessage(response.success, AlertTypes.warning, this.translate.transform("messages.existing-user"))
  //         }
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },

  //     });
  //   });
  //   return promise.then(a => {
  //     this.getAllUsers();
  //   });
  // }

  changePassword(userId) {

    this.router.navigate([this.changePasswordUrl], { queryParams: { userId: userId } });

  }

  //#endregion

  //#region Helper Functions
  //form group
  get f(): { [key: string]: AbstractControl } {
    return this.UserRegisterationForm.controls;
  }
  ///
  showResponseMessage(responseStatus, alertType, message) {
    ;
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning == alertType) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info == alertType) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error == alertType) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }
  deletedStatus = 1;
  userHasRelationStatus = 2
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('messages.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.spinner.show();
        let sub = this.userService
          .deleteWithUrl('DeleteWithCheck?id=' + id)
          .subscribe((resonse) => {

            if (resonse.success == true) {
              this.getAllUsers().then(a => {
                this.spinner.hide();

              }).catch(e => {
                this.spinner.hide();
              });
              //   this.store.dispatch(OwnerActions.actions.setList({
              //     data: [...ownersList!]
              // }));

              this.showResponseMessage(resonse.success, AlertTypes.success, this.translate.transform("messages.delete-success"))
            } else if (resonse.success == false && !resonse.isUsed) {
              this.spinner.hide();
              let message = this.translate.transform("messages.delete-faild");
              this.showResponseMessage(resonse.success, AlertTypes.error, message);
            }
            else if (resonse.isUsed) {
              this.spinner.hide();
              let message = this.translate.transform("messages.delete-faild") + resonse.message;
              this.showResponseMessage(resonse.success, AlertTypes.error, message);
            }
            else {
              this.spinner.hide();
              let message = this.translate.transform("messages.delete-faild") + resonse.message;
              this.showResponseMessage(resonse.success, AlertTypes.error, message);
            }

          });
        this.subsList.push(sub);
      }
    });
  }
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
            //this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            // this.activeTab = 1;
            this.toolbarPathData.componentAdd = 'component-names.add-user';
            this.sharedServices.changeToolbarPath(this.toolbarPathData);

            this.router.navigateByUrl(this.addUrl);
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }




  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  //#endregion

  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  columnNames: any[] = [];
  defineGridColumn() {
    let sub = this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
      this.columnNames = [
        this.lang == 'ar'
          ? { title: ' الاسم', field: 'firstNameAr' }
          : { title: ' Name  ', field: 'firstNameEn' },
        {
          title: this.lang == 'ar' ? ' اسم المستخدم' : 'User Name',
          field: 'userName',
        },
        {
          title: this.lang == 'ar' ? 'البريد الإلكتروني ' : ' Email',
          field: 'email',
        },
        {
          title: this.lang == 'ar' ? 'رقم الهاتف' : ' Mobile',
          field: 'phoneNumber',
        },
        {
          title: this.lang == 'ar' ? 'حالة المستخدم' : ' User Status',
          field: 'isActive',
          formatter: this.printFormatter,
        },
        {
          title: this.lang == 'ar' ? 'تفعيل' : 'Activate',
          field: 'id',
          formatter: this.activeFormatIcon,
          cellClick: (e, cell) => {
            this.changeActivateUserStatus(cell.getRow().getData(), true);
          },
        },


        this.lang == "ar" ? {
          title: "إلغاء التفعيل",
          field: "", formatter: this.cancelFormatIcon, cellClick: (e, cell) => {
            this.changeActivateUserStatus(cell.getRow().getData(), false);
          },

        } :
          {
            title: "Cancel User Activation",
            field: "", formatter: this.cancelFormatIcon, cellClick: (e, cell) => {
              this.changeActivateUserStatus(cell.getRow().getData(), false);
            },

          },

        this.lang == "ar" ? {
          title: " تغير كلمة المرور",
          field: "", formatter: this.changePasswordFormatIcon, cellClick: (e, cell) => {
            this.changePassword(cell.getRow().getData().id);
          },

        } :
          {
            title: "Change Password",
            field: "", formatter: this.changePasswordFormatIcon, cellClick: (e, cell) => {
              this.changePassword(cell.getRow().getData().id);
            },

          },

        this.lang == 'ar'
          ? {
            title: 'تعديل',
            field: '',
            formatter: this.editFormatIcon,
            cellClick: (e, cell) => {
              this.edit(cell.getRow().getData().id);
            },
          }
          : {
            title: 'Edit',
            field: '',
            formatter: this.editFormatIcon,
            cellClick: (e, cell) => {
              this.edit(cell.getRow().getData().id);
            },
          }, this.lang == 'ar'
          ? {
            title: 'حذف',
            field: '',
            formatter: this.deleteFormatIcon,
            cellClick: (e, cell) => {
              this.delete(cell.getRow().getData().id);
            },
          }
          : {
            title: 'Delete',
            field: '',
            formatter: this.deleteFormatIcon,
            cellClick: (e, cell) => {
              this.delete(cell.getRow().getData().id);
            },
          }
      ];
    });

    this.subsList.push(sub);
  }
  cancelFormatIcon() { //plain text value
    return "<i class='text-danger fas fa-user-lock'></i>";
  };
  editFormatIcon() {
    //plain text value
    return "<i class='text-secondary fa fa-edit'></i>";
  }
  activeFormatIcon() {
    //plain text value
    return "<i class='text-success fas fa-user-check' ></i>";
  }
  changePasswordFormatIcon() {
    //plain text value
    return "<i class='text-secondary fas fa-key' ></i>";
  }

  deleteFormatIcon() {
    //plain text value
    return "<i class='text-danger fa fa-trash'></i>";
  }
  CheckBoxFormatIcon() {
    //plain text value
    return "<input id='yourID' type='checkbox' />";
  }
  printFormatter(cell, formatterParams, onRendered) {
    console.log(cell.getValue());
    return cell.getValue()
      ? "<i class='text-success fa fa-check' ></i>"
      : "<i class='text-danger fas fa-user-times'></i>";
  }

  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    } else {
      this.showResponseMessage(
        true,
        AlertTypes.warning,
        this.translate.transform('permissions.permission-denied')
      );
    }
  }
  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
    showActivate: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'firstNameEn', type: 'like', value: searchTxt },
        { field: 'firstNameAr', type: 'like', value: searchTxt },
        { field: 'userName', type: 'like', value: searchTxt },

        ,
      ],
    ];
  }
  edit(id: string) {
    this.sharedServices.changeButton({
      action: 'Update',
      componentName: 'List',
    } as ToolbarData);
    this.router.navigate([this.updateUrl, id]);
  }
  openUsers() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {

        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
        } as ToolbarData);
        this.activeTab = 1;

        this.edit(event.item.id);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      } else if (event.actionName == 'Activate') {
        this.changeActivateUserStatus(event.item, true);
      }
    }
  }

  //#endregion
}
