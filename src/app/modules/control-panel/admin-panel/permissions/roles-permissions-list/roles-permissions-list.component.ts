import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { RolesService } from 'src/app/core/services/backend-services/permissions/roles.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { Roles } from 'src/app/core/models/permissions/roles';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResult, ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 3;
@Component({
  selector: 'app-roles-permissions-list',
  templateUrl: './roles-permissions-list.component.html',
  styleUrls: ['./roles-permissions-list.component.scss']
})
export class RolesPermissionsListComponent implements OnInit, OnDestroy {





  //#region Main Declarations
  roles: Roles[] = [];
  subsList: Subscription[] = [];
  addUrl: string = '/control-panel/admin-panel/add-role-permissions';
  updateUrl: string = '/control-panel/admin-panel/update-role-permissions/';
  listUrl: string = '/control-panel/admin-panel/roles-permissions';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: this.listUrl,
    addPath: '',
    updatePath: this.updateUrl,
    componentList: 'component-names.list-roles-permissions',
    componentAdd: '',
  };


  //#endregion

  //#region Constructor
  constructor(
    private router: Router,
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private rolesPermissionsService: RolesPermissionsService,
    private rolesService: RolesService,
    private rolesPerimssionsService: RolesPermissionsService,
    private managerService: ManagerService

  ) { }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID), this.getAllRolesPermissions()]).then(a => {
      this.spinner.hide();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(e => {
      this.spinner.hide();
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
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         let userPermissions: UserPermission = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(userPermissions);
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

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data


  getAllRolesPermissions() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.rolesService.getWithResponse<Roles[]>("GetAll").subscribe({
        next: (res: ResponseResult<Roles[]>) => {
          resolve();
          if (res.data) {
            this.roles = res.data;
          }

        },
        error: (err: any) => {
          resolve();
          //reject(err);

        },
        complete: () => {

          this.spinner.hide();
        },
      });
      this.subsList.push(sub);
    });




  }


  //#endregion

  //#region CRUD Operations

  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    this.router.navigate(['/control-panel/admin-panel/update-role-permissions/', id]);
  }//#region Toolbar Service


  //#endregion

  //#region Helper Functions



  currentBtn!: string;

  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
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
  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  defineGridColumn() {
    let sub = this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [
        {
          title: this.lang == 'ar' ? 'الرقم' : ' Code ',
          field: 'id',
        },
        this.lang == 'ar'
          ? { title: ' الدور ', field: 'roleNameAr' }
          : { title: 'Role  ', field: 'roleNameEn' },


        {
          title: this.lang == 'ar' ? 'ملاحظات' : ' Remarks ',
          field: 'remark',
        },

        this.lang == "ar" ? {
          title: "حذف",
          field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
            this.showConfirmDeleteMessage(cell.getRow().getData().id);
          },
        } :
          {
            title: "Delete",
            field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
              this.showConfirmDeleteMessage(cell.getRow().getData().id);
            },
          }

        ,

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

      ];
    })
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
  columnNames: any[] = [];

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'roleNameAr', type: 'like', value: searchTxt },
        { field: 'roleNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }


  openAddRoles() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.showConfirmDeleteMessage(event.item.id);
      }
    }
  }

  //#endregion

  //#region Helper
  //#region Helper Functions

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.spinner.show();
        let sub = this.rolesService.deleteWithUrl("DeleteWithCheck?Id=" + id).subscribe(
          (resonse:ResponseResultNoraml) => {
            //reloadPage()
            // this.getAllRolesPermissions();
            // if (resonse.success == true) {
            //   this.spinner.show();
            //   this.showResponseMessage(
            //     resonse.success,
            //     AlertTypes.success,
            //     this.translate.transform("messages.delete-success")
            //   );
            // } else if (resonse.success == false) {
            //   this.showResponseMessage(
            //     resonse.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.delete-faild")
            //   );
            // }

            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              this.getAllRolesPermissions().then(a => {
                this.spinner.hide();

              }).catch(e => {
                this.spinner.hide();
              });

            } else if (resonse.success == false && resonse.isUsed == false) {
              this.spinner.hide();
              this.showResponseMessage(resonse.success, AlertTypes.error, this.translate.transform("messages.delete-faild"))
            }
            else if (resonse.isUsed) {
              this.spinner.hide();
              this.showResponseMessage(resonse.success, AlertTypes.error, this.translate.transform("messages.delete-faild") + resonse.message)
            } else {
              this.spinner.hide();
              this.showResponseMessage(resonse.success, AlertTypes.error, this.translate.transform("messages.delete-faild") + resonse.message)
            }
          });

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
  //#endregion

}
