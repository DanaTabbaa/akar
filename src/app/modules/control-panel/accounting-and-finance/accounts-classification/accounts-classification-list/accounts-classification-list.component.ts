import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { AccountsClassification } from 'src/app/core/models/accounts-classification';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { AccountsClassificationService } from 'src/app/core/services/backend-services/accounts-classification.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 62;
@Component({
  selector: 'app-accounts-classification-list',
  templateUrl: './accounts-classification-list.component.html',
  styleUrls: ['./accounts-classification-list.component.scss']
})
export class AccountsClassificationListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  accountsClassification: AccountsClassification[] = [];
  subsList: Subscription[] = [];

  addUrl: string = '/control-panel/accounting/add-account-classification';
  updateUrl: string = '/control-panel/accounting/update-account-classification/';
  listUrl: string = '/control-panel/accounting/accounts-classification-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "sidebar.accounts-classification",
    componentAdd: "accounts-classification.add-account-classification",
  };

  //#endregion
  //#region Constructor
  constructor(private router: Router, private AccountsClassificationService: AccountsClassificationService,
    private sharedService: SharedService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private rolesPerimssionsService: RolesPermissionsService,
    private modalService: NgbModal,
    private store: Store<any>,
    private alertsService: NotificationsAlertsService) { }
  //#endregion
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedService.changeButton({ action: 'List' } as ToolbarData);
    this.sharedService.changeToolbarPath(this.toolbarPathData)
    this.getAccountsClassification()
    this.defineGridColumn();

  }

  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
  //#region methods
  getAccountsClassification() {
    const promise = new Promise<void>((resolve, reject) => {
      this.AccountsClassificationService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.accountsClassification = res.data.map((res: AccountsClassification[]) => {
            return res
          });
          resolve();
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

  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }
  }
  navigatetoupdate(id: string) {
    this.router.navigate(['/control-panel/accounting/update-account-classification', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  edit(id: string) {
    this.sharedService.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate([this.updateUrl, id]);
  }
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
        ;
        this.AccountsClassificationService.deleteWithUrl("delete?id=" + id).subscribe((resonse) => {
          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              resonse.message
            );
          }
        });
        setTimeout(() => {
          this.spinner.hide();
          this.getAccountsClassification();
        }, 500);
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
  //#endregion

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
          this.sharedService.setUserPermissions(this.userPermissions);
          resolve();

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


        { title: this.lang == 'ar' ? 'أسم تصنيف الحساب' : 'Account classification name', field: this.lang == 'ar' ? 'classificationArName' : 'classificationEnName' },

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
    })
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
        { field: 'classificationArName', type: 'like', value: searchTxt },
        { field: 'classificationEnName', type: 'like', value: searchTxt }

      ],
    ];
  }
  openAddAccountsClassification() { }

  //#endregion
  //#region Toolbar Service
  currentBtn!: string;
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
