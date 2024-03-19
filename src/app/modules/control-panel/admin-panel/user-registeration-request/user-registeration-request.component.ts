import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRegisterations } from 'src/app/core/models/user-registerations';
import { UserRegisterationsService } from 'src/app/core/services/backend-services/user-registerations.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { AuthenticationService } from 'src/app/core/services/backend-services/authentication/authentication.service';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { CompanyInformation } from 'src/app/core/models/company-information';
import { CompanyInformationService } from 'src/app/core/services/backend-services/company-information.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { showResponseMessage } from 'src/app/helper/helper';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 1; // from pages table in database seeding table

@Component({
  selector: 'app-user-registeration-request',
  templateUrl: './user-registeration-request.component.html',
  styleUrls: ['./user-registeration-request.component.scss']
})
export class UserRegisterationRequestComponent implements OnInit {

  //#region Main Declarations
  userRegisterationList: UserRegisterations[] = [];
  userRegisteration: UserRegisterations = new UserRegisterations();
  subsList: Subscription[] = [];
  companyInformationResponse!: ResponseResult<CompanyInformation>;
  addUrl: string = '/control-panel/admin-panel/user-registeration-request';
  updateUrl: string = '/control-panel/settings/user-registeration-request/';
  listUrl: string = '/control-panel/settings/user-registeration-request';
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.users-registerations",
    componentAdd: "component-names.blank",
  };
  ///
  //#endregion

  //#region Constructor
  constructor(
    private userRegisterationsService: UserRegisterationsService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService,
    private translate: TranslatePipe,
    private companyInformationService: CompanyInformationService,
    private router: Router,
    private managerService: ManagerService) { }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.getAllRegisterationsRequests(),

    ]).then(a => {
      this.spinner.hide();
      this.sharedService.changeToolbarPath(this.toolbarPathData);
      this.sharedService.changeButton({ action: 'Disactive', submitMode: false } as ToolbarData)
    }).catch(e => {
      this.spinner.hide();
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

  }
  //#endregion

  //#region Authentications
  //
  //
  //#endregion

  //#region Permissions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedService.setUserPermissions(this.userPermissions);
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });
  //   return promise;

  // }
  //#endregion


  //#region Basic Data
  //Get all registeration requests
  getAllRegisterationsRequests() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.userRegisterationsService.getWithResponse<UserRegisterations[]>("GetAll").subscribe({
        next: (res: ResponseResult<UserRegisterations[]>) => {
          resolve();
          if (res.data) {
            this.userRegisterationList = [...res.data]
          }
          //(("res", res);
          //((" this.userRegisterationList", this.userRegisterationList);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
      this.subsList.push(sub);
    });

  }
  //#endregion


  createUser(item: UserRegisterations) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.authenticationService.createUser(item, false, item.id).subscribe({
        next: (res: any) => {
          resolve();
          if (res.success) {
            this.showResponseMessage(res.success, AlertTypes.success, this.translate.transform("messages.create-user-success"));

            this.getAllRegisterationsRequests().then(b => {
              this.spinner.hide();
            }).catch(d => {
              this.spinner.hide();
            });

          } else if (res.success == false) {
            this.showResponseMessage(res.success, AlertTypes.warning, this.translate.transform("messages.existing-user"))
          }

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
      this.subsList.push(sub);
    });
    // return promise.then(a => {
    //   this.getAllRegisterationsRequests();
    // });
  }


  //#region CRUD Operations
  //Appove user request / create user profile
  // updateRequestStatus(item: UserRegisterations) {
  //
  //   if (item != null) {
  //     ;
  //     this.authenticationService.createUser(item).subscribe(result => {
  //       if (result != null) {
  //         //(("result createUser ", result)
  //         item.requestStatus = 1;
  //         this.userRegisterationsService.activateRequest(item).subscribe(response => {
  //           //(("response updaet ", response)
  //         });
  //       }
  //     });

  //   }

  // }
  updateRequestStatus(item: UserRegisterations) {
    //let response;
    this.spinner.show();

    return new Promise<void>((resolve, reject) => {
      let sub = this.authenticationService.createUser(item, true, item.id).subscribe({
        next: (res: any) => {
          resolve();
          //(("createUser response  createUser ", response)          
          if (res.success) {
            this.showResponseMessage(res.success, AlertTypes.success, this.translate.transform("messages.create-user-success"));

            this.getAllRegisterationsRequests().then(b => {
              this.spinner.hide();
            }).catch(d => {
              this.spinner.hide();
            });

          } else if (res.success == false) {
            this.showResponseMessage(res.success, AlertTypes.warning, this.translate.transform("messages.existing-user"))
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
    })
    // .then(a => {
    //   if (response.success) {
    //     this.activateUser(item);
    //     this.createCompanyInformation();
    //   }



    //});

  }
  createCompanyInformation() {

    let companyInfromation: CompanyInformation = new CompanyInformation();
    companyInfromation.userId = localStorage.getItem("UserId");
    const promise = new Promise<void>((resolve, reject) => {
      this.companyInformationService.addWithUrl(
        "Add?checkAll=false",
        companyInfromation
      ).subscribe({
        next: (result: any) => {

          this.spinner.show();
          this.companyInformationResponse = { ...result.response };


          setTimeout(() => {
            this.spinner.hide();
            showResponseMessage(this.translate, this.alertsService,
              this.companyInformationResponse.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            //  navigateUrl(this.listUrl, this.router);
          }, 500);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }

  // activateUser(item: UserRegisterations) {
  //   item.requestStatus = 1;
  //   this.userRegisterationsService.activateRequest(item).subscribe(response => {
  //     //(("response update status", response)
  //   });
  // }

  activateUser(item: UserRegisterations) {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      this.userRegisterationsService.activateRequest(item).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          resolve();
          let response = JSON.parse(JSON.stringify(res));
          //(("activateUser response   ", response)
          if (response.success) {
            this.showResponseMessage(response.success, AlertTypes.info, this.translate.transform("messages.activate-user-success"))
          } else if (response.success == false) {
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
    });
    // return promise.then(a => {
    //   this.getAllRegisterationsRequests();
    // });
  }
  cancelRequset(item: UserRegisterations) {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      this.userRegisterationsService.cancelRequset(item).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          let response = JSON.parse(JSON.stringify(res));
          //(("cancelRequset response   ", response)
          if (response.success) {
            this.showResponseMessage(response.success, AlertTypes.warning, this.translate.transform("messages.deactivate-user-success"))
            this.getAllRegisterationsRequests();
          } else if (response.success == false) {
            this.showResponseMessage(response.success, AlertTypes.warning, this.translate.transform("messages.existing-user"))
          }
          resolve();

        },
        error: (err: any) => {
          this.spinner.hide();
          reject(err);
        },
        complete: () => {



        },

      });
    });

  }
  //Cancel user request
  // cancelRequset(item: UserRegisterations) {
  //   this.userRegisterationsService.cancelRequset(item).subscribe(response => {
  //     //(("response Cancel Requset", response);

  //   });

  // }
  //Delete user request


  deleteRequset(id: number) {
    this.showConfirmDeleteMessage(id);
  }



  //#endregion

  //
  //#region Helper Functions
  showResponseMessage(responseStatus, alertType, message) {
    if (AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (AlertTypes.warning == alertType) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (AlertTypes.info == alertType) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error == alertType) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.spinner.show();
        let sub = this.userRegisterationsService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe((resonse) => {
          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            this.getAllRegisterationsRequests().then(a => {
              this.spinner.hide();
            }).catch(e => {
              this.spinner.hide();
            });
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              this.translate.transform("messages.delete-faild")+" "+resonse.message
            );
            this.spinner.hide();
          }
        }, err => {
          this.spinner.hide();
        });

        this.subsList.push(sub);
      }
    });
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
    this.sharedService.getLanguage().subscribe(res => {
      this.lang = res
      this.columnNames = [
        this.lang == 'ar'
          ? { title: ' الاسم', field: 'nameAr' }
          : { title: ' Name  ', field: 'nameEn' },
        {
          title: this.lang == 'ar' ? 'أسم المستخدم' : 'Username',
          field: 'userName',
        },
        {
          title: this.lang == 'ar' ? 'البريد الالكترونى' : 'Email',
          field: 'email',
        },
        {
          title: this.lang == 'ar' ? 'رقم الهاتف' : ' Mobile No',
          field: 'mobile',
        },
        {
          title: this.lang == 'ar' ? 'حالة الطلب' : 'Request Status',
          field: 'requestStatus', formatter: this.requestStatusFormatter,
        },
        this.lang == "ar" ? {
          title: "الموافقة و انشاء المستخدم",
          field: "", formatter: this.approveFormatIcon, cellClick: (e, cell) => {
            this.updateRequestStatus(cell.getRow().getData());
          }
        }
          :
          {
            title: "Approve & Create user",
            field: "", formatter: this.approveFormatIcon, cellClick: (e, cell) => {
              this.updateRequestStatus(cell.getRow().getData());
            }
          },
        this.lang == "ar" ? {
          title: "تنشيط ",
          field: "", formatter: this.activateUserFormatIcon, cellClick: (e, cell) => {
            this.activateUser(cell.getRow().getData());
          }
        }
          :
          {
            title: "Activate",
            field: "", formatter: this.activateUserFormatIcon, cellClick: (e, cell) => {
              this.activateUser(cell.getRow().getData());
            }
          },
        this.lang == "ar" ? {
          title: "الغاء",
          field: "", formatter: this.cancelFormatIcon, cellClick: (e, cell) => {
            this.cancelRequset(cell.getRow().getData());
          },

        } :
          {
            title: "Cancel User Activation",
            field: "", formatter: this.cancelFormatIcon, cellClick: (e, cell) => {
              this.cancelRequset(cell.getRow().getData());
            },

          },
        this.lang == "ar" ? {
          title: "حذف",
          field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
            this.deleteRequset(cell.getRow().getData().id);
          },

        } :
          {
            title: "Delete",
            field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
              this.deleteRequset(cell.getRow().getData().id);
            },

          }
        ,

      ];
    })
  }
  requestStatusFormatter(cell, formatterParams, onRendered) {
    console.log(cell.getValue())
    return cell.getValue() ? "<i class='text-success fa fa-check' ></i>" : "<i class='text-danger fas fa-user-times'></i>";
  }
  approveFormatIcon() { //plain text value
    return "<i class='text-success  fas fa-user-plus'></i>";
  };
  activateUserFormatIcon() { //plain text value
    return "<i class='text-success fas fa-user-check' ></i>";
  };
  cancelFormatIcon() { //plain text value
    return "<i class='text-danger fas fa-user-lock'></i>";
  };
  editFormatIcon() { //plain text value
    return "<i class='text-secondary fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class='text-danger fa fa-trash'></i>";
  };
  CheckBoxFormatIcon() { //plain text value
    return "<input id='yourID' type='checkbox' />";
  };

  direction: string = 'ltr';
  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'nameAr', type: 'like', value: searchTxt },
        { field: 'nameEn', type: 'like', value: searchTxt },
        { field: 'userName', type: 'like', value: searchTxt },
        { field: 'email', type: 'like', value: searchTxt },
        { field: 'mobile', type: 'like', value: searchTxt },

        ,
      ],
    ];
  }
  openAddOwners() { }

  //#endregion
  //#region Toolbar Service
  currentBtn!: string;
  listenToClickedButton() {
    let sub = this.sharedService.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            // this.router.navigate(['/control-panel/definitions/buildings']);
          } else if (currentBtn.action == ToolbarActions.New) {
            // this.router.navigate([this.addUrl]);
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
  openAddUserRegisterationRequests() { }

  //#region Helper Functions


}
