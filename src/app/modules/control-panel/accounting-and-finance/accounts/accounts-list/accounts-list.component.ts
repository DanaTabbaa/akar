import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { accountType, accountTypeAr, AlertTypes, convertEnumToArray, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { Accounts } from 'src/app/core/models/accounts';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { AccountService } from 'src/app/core/services/backend-services/account.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Store } from '@ngrx/store';
import { AccountsActions } from 'src/app/core/stores/actions/accounts.actions';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 61;
@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  lang: string = '';
  accounts: Accounts[] = [];
  accountTypes: ICustomEnum[] = [];

  addUrl: string = '/control-panel/accounting/add-account';
  updateUrl: string = '/control-panel/accounting/update-account/';
  listUrl: string = '/control-panel/accounting/accounts-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.accounts",
    componentAdd: "accounts.add-account",
  };

  //#endregion
  //#region Constructor

  constructor(
    private accountService: AccountService,
    private router: Router,
    private sharedService: SharedService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private rolesPerimssionsService: RolesPermissionsService,
    private modalService: NgbModal,
    private store: Store<any>,
    private alertsService: NotificationsAlertsService,
    private managerService: ManagerService) { }
  //#endregion

  //#region ngOnInit

  ngOnInit(): void {
    localStorage.setItem("PageId", PAGEID.toString());
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadAccounts(),
    ]).then(a => {
      this.spinner.hide();
      this.accounts = this.managerService.getAccounts();
      this.sharedService.changeButton({ action: 'List' } as ToolbarData);
      this.sharedService.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(err => {
      this.spinner.hide();
    });
    //this.getPagePermissions(PAGEID)



  }
  //#endregion
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }
  //#endregion
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedService.getLanguage().subscribe(
        {
          next: res => {
            resolve();
            this.lang = res
          },
          error: (err) => {
            console.log(err);
            resolve();
          }
        });
      this.subsList.push(sub);
    });


  }
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
  //#region methods

  // getAccounts() {

  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.accountService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.accounts = res.data.map((res: Accounts[]) => {
  //           return res
  //         });
  //         resolve();
  //         //(("res", res);
  //         //((" this.accounts", this.accounts);
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
  // getAccountTypes() {
  //   if (this.lang == 'en') {
  //     this.accountTypes = convertEnumToArray(accountType);
  //   }
  //   else {
  //     this.accountTypes = convertEnumToArray(accountTypeAr);

  //   }
  // }
  //#endregion


  delete(id: any) {
    if (this.managerService.getUserPermissions().isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  //navigatetoupdate
  navigatetoupdate(id: string) {
    this.router.navigate(['/control-panel/accounting/update-account', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  edit(id: string) {
    this.sharedService.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate([this.updateUrl, id]);
  }
  isListEmpty
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('messages.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        var deletedItem = this.accounts.find(x => x.id == id);
        let sub = this.accountService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe(
          {
            next: (resonse: ResponseResultNoraml) => {
              if (resonse.success == true) {
                this.managerService.loadOwners().then(a => {
                  this.spinner.hide();
                  this.accounts = this.managerService.getAccounts();
                }).catch(e => {
                  this.spinner.hide();
                });

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


            }, error: (err) => {
              this.spinner.hide();
            }
          }

        );
        this.subsList.push(sub);

      }
    });
  }
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
  //#region Tabulator
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  columnNames: any[] = [];
  defineGridColumn() {
    let sub = this.sharedService.getLanguage().subscribe(res => {
      this.lang = res
      this.columnNames = [
        {
          title: this.lang == 'ar' ? ' الكود' : 'Code',
          field: 'accCode',
        },
        this.lang == 'ar'
          ? { title: 'أسم الحساب', field: 'accArName' }
          : { title: 'Account Name', field: 'accEnName' },

        this.lang == 'ar'
          ? { title: 'حالة الحساب', field: 'accountStateAr' }
          : { title: 'Account State', field: 'accountStateEn' },

        this.lang == 'ar'
          ? { title: 'تصنيف الحساب', field: 'classificationArName' }
          : { title: 'Account Classification', field: 'classificationEnName' },
        this.lang == "ar" ? {
          title: "تعديل",
          field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
            this.edit(cell.getRow().getData().id);
          }
        }
          :
          {
            title: "Edit",
            field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
              this.edit(cell.getRow().getData().id);
            }
          },
        this.lang == "ar" ? {
          title: "حذف",
          field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
            this.delete(cell.getRow().getData().id);
          },
        } :
          {
            title: "Delete",
            field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
              this.delete(cell.getRow().getData().id);
            },
          }

      ];
    });
    this.subsList.push(sub);
  }
  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class=' fa fa-trash'></i>";
  };
  CheckBoxFormatIcon() { //plain text value
    return "<input id='yourID' type='checkbox' />";
  };
  openAddAccounts() { }

  direction: string = 'ltr';
  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'accCode', type: 'like', value: searchTxt },
        { field: 'accArName', type: 'like', value: searchTxt },
        { field: 'accEnName', type: 'like', value: searchTxt },
        { field: 'classificationEnName', type: 'like', value: searchTxt },
        { field: 'classificationArName', type: 'like', value: searchTxt }

        ,
      ],
    ];
  }
  openAddUnitServices() { }

  //#endregion
  //#region Toolbar Service
  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {
    let sub = this.sharedService.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
          } else if (currentBtn.action == ToolbarActions.New) {
            this.router.navigate([this.addUrl]);
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
  //#region Helper Functions

}
