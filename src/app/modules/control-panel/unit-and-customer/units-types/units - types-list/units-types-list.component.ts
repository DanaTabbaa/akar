import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UnitsTypesVM } from 'src/app/core/models/ViewModel/units-types-vm';
import { UnitsTypesService } from 'src/app/core/services/backend-services/units-types.service';

import { UnitsTypes } from 'src/app/core/models/units-types';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import {
  AlertTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { Subscription } from 'rxjs';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { LIST_ACTION } from 'src/app/core/constants/constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 35; // from pages table in database seeding table
@Component({
  selector: 'app-units-types-list',
  templateUrl: './units-types-list.component.html',
  styleUrls: ['./units-types-list.component.scss'],
})
export class UnitsTypesListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  unitsTypes: UnitsTypesVM[] = [];
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-unit-type';
  updateUrl: string = '/control-panel/definitions/update-unit-type/';
  listUrl: string = '/control-panel/definitions/units-types-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-units-types',
    componentAdd: '',
  };
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;

  //#endregion

  //#region Constructor

  constructor(
    private unitsTypesService: UnitsTypesService,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private rolesPerimssionsService: RolesPermissionsService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private router: Router,
    private managerService: ManagerService
  ) { }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();

    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID), this.managerService.loadUnitTypes()]).then(a => {
      this.unitsTypes = this.managerService.getUnitTypes();
      this.spinner.hide();
      this.listenToClickedButton();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
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

    this.managerService.destroy();
  }

  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions

  // getPagePermissions(pageId) {
  //   return new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(this.userPermissions);
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });


  // }
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data

  // getUnitsTypes() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.unitsTypesService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.unitsTypes = res.data.map((res: UnitsTypesVM[]) => {
  //           return res;
  //         });
  //         resolve();
  //         //(('res', res);
  //         //((' this.unitsTypes', this.unitsTypes);
  //       },
  //       error: (err: any) => {
  //         resolve();
  //         //reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //     this.subsList.push(sub);
  //   });

  // }

  //#endregion

  //#region CRUD Operations

  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }

  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    this.router.navigate(['/control-panel/definitions/update-unit-type', id]);
  }

  //#endregion

  //#region Helper Functions

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
        let sub = this.unitsTypesService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe({
          next: (resonse: ResponseResultNoraml) => {
            if (resonse.success == true) {
              this.managerService.loadUnitTypes().then(a => {
                this.unitsTypes = this.managerService.getUnitTypes();
                this.spinner.hide();
              }).catch(e => {
                this.spinner.hide();
              });
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
            } else if (resonse.isUsed) {
               
              this.spinner.hide();
              this.showResponseMessage(
                resonse.success,
                AlertTypes.error,
                this.translate.transform("messages.delete-faild") + resonse.message
              );
            }
            else
            {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.error,
                this.translate.transform("messages.delete-faild")
              );
              this.spinner.hide();
            }
          },
          error: (err) => {
            this.spinner.hide();
          }
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
    let sub = this.sharedServices.getLanguage().subscribe((res) => {

      this.lang = res;
      this.columnNames = [
        this.lang == 'ar'
          ? { title: ' نوع الوحدة', field: 'typeNameAr' }
          : { title: ' Unit Type  ', field: 'typeNameEn' },
        {
          title: this.lang == 'ar' ? 'المساحة ' : ' Area',
          field: 'addArea', formatter: this.printFormatter
        },
        {
          title: this.lang == 'ar' ? 'عدد الغرف' : ' No of rooms',
          field: 'addNoOfRooms', formatter: this.printFormatter
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
  printFormatter(cell, formatterParams, onRendered) {
    //console.log(cell.getValue())
    return cell.getValue() ? "<i class='text-success fa fa-check' ></i>" : "<i class='text-danger fas fa-times'></i>";
  }
  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openUnitsTypes() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
        } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      }
    }
  }

  //#endregion

  //#region Toolbar Service
  currentBtn!: string;
  subsList: Subscription[] = [];
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
}
