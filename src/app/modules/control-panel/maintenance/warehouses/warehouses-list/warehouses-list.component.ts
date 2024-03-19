import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MaintenanceWarehouses } from 'src/app/core/models/maintenance-warehouses';
import { MaintenanceWarehousesService } from 'src/app/core/services/backend-services/maintenance-warehouses.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const PAGEID = 19; // from pages table in database seeding table
@Component({
  selector: 'app-warehouses-list',
  templateUrl: './warehouses-list.component.html',
  styleUrls: ['./warehouses-list.component.scss']
})
export class WarehousesListComponent implements OnInit, OnDestroy,OnChanges {
@Input() changeWarehousesFlag:number=0;
  maintenanceWarehouses: MaintenanceWarehouses[] = [];

  _search: any;
  addUrl: string = '/control-panel/maintenance/add-maintenance-warehouse';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-warehouse/';
  listUrl: string = '/control-panel/maintenance/maintenance-warehouses-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: this.listUrl,
    addPath: '',
    updatePath: this.updateUrl,
    componentList: "menu.warehouses",
    componentAdd: '',
  };
  maintenanceWarehouseSearchForm!: FormGroup;
  constructor(private MaintenanceWarehousesService: MaintenanceWarehousesService,
    private modalService: NgbModal,

    private alertsService: NotificationsAlertsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private router: Router, private fb: FormBuilder) {
    this.maintenanceWarehouseSearchForm = this.fb.group({
      _search: ''
    }
    )
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
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
   // this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getMaintenanceWarehouses();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeWarehousesFlag){
      this.getMaintenanceWarehouses();
    }
  }
  getMaintenanceWarehouses() {
    const promise = new Promise<void>((resolve, reject) => {
      this.MaintenanceWarehousesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.maintenanceWarehouses = res.data.map((res: MaintenanceWarehouses[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.maintenanceWarehouses", this.maintenanceWarehouses);
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
  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
          this.sharedServices.setUserPermissions(this.userPermissions);
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
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  //#region Helper Functions
  isListEmpty
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        let deletedItem = this.maintenanceWarehouses.find(x => x.id == id) as MaintenanceWarehouses;
        let deletedOwnerIndex =  this.maintenanceWarehouses.indexOf(deletedItem);
        let maintenanceWarehousesList= this.maintenanceWarehouses.splice(deletedOwnerIndex,1);
        this.MaintenanceWarehousesService.delete(id).subscribe((resonse) => {
          //(('delete response', resonse);
          this.getMaintenanceWarehouses();
          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            if (this.maintenanceWarehouses.length == 0) {
              this.isListEmpty = true;
            }
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              this.translate.transform("messages.delete-faild")
            );
          }
        });
      }
    });
  }
  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/maintenance/add-maintenance-warehouse'], { queryParams: { typeOfComponent: typeOfComponent } });
  }
  //navigatetoupdate
  edit(id: string) {
    this.router.navigate(['/control-panel/maintenance/update-maintenance-warehouse', id]);
    this.sharedServices.changeButton({ action: 'Update', componentName: "List" } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform('messages.done'));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform('messages.alert'));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform('messages.info'));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform('messages.error'));
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
            // this.router.navigate(['/control-panel/definitions/buildings']);
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
  columnNames: any[] = [];
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe((res) => {

      this.lang = res;
      this.columnNames = [
        {
          title: this.lang == 'ar' ? 'رقم' : 'Id',
          field: 'id',
        },
        {
          title: this.lang == 'ar' ? 'أسم المستودع باللغة العربية' : ' Warehouse Name In Arabic',
          field: 'warehouseNameAr',
        },

        {
          title: this.lang == 'ar' ? 'أسم المستودع باللغة الانجليزية' : ' Warehouse Name In English',
          field: 'warehouseNameEn',
        },
        {
          title: this.lang == 'ar' ? 'أسم المالك باللغة العربية' : 'Owner Name In Arabic',
          field: 'ownerNameAr',
        },
        {
          title: this.lang == 'ar' ? 'أسم المالك باللغة الانجليزية' : 'Owner Name In English',
          field: 'ownerNameEn',
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
  }
  editFormatIcon() { //plain text value
    return "<i class='fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class=' fa fa-trash'></i>";
  };
  CheckBoxFormatIcon() { //plain text value
    return "<input id='yourID' type='checkbox' />";
  };

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'warehouseNameAr', type: 'like', value: searchTxt },
        { field: 'warehouseNameEn', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },

        ,
      ],
    ];
  }


  openAddMaintenanceWarehouse() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update', componentName: "List" } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      }
    }
  }

  //#endregion

}

