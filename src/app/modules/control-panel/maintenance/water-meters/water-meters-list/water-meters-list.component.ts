import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { WaterMetersVM } from 'src/app/core/models/ViewModel/water-meters-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { WaterMetersService } from 'src/app/core/services/backend-services/water-meters.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 27; // from pages table in database seeding table
@Component({
  selector: 'app-water-meters-list',
  templateUrl: './water-meters-list.component.html',
  styleUrls: ['./water-meters-list.component.scss']
})
export class WaterMetersListComponent implements OnInit, OnDestroy,OnChanges {
  @Input() changeWaterMetersFlag:number=0;
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-water-meter';
  updateUrl: string = '/control-panel/maintenance/update-water-meter/';
  listUrl: string = '/control-panel/maintenance/water-meters-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.water-meters",
    componentAdd: '',
  };
  waterMeters: WaterMetersVM[] = [];
  //#endregion
  //#region Constructor
  constructor(
    private waterMetersService: WaterMetersService,
    private router: Router,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe
  ) { }
  //#endregion
  //#region ngOnInit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    //this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getWaterMeters();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeWaterMetersFlag)
    {
      this.getWaterMeters();
    }
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
  //#region  State Management
  //#endregion
  //#region Basic Data
  ///Geting form dropdown list data
  //#endregion
  //#region CRUD Operations
  getWaterMeters() {
    const promise = new Promise<void>((resolve, reject) => {
      this.waterMetersService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.waterMeters = res.data.map((res: WaterMetersVM[]) => {
            return res;
          });

          resolve();
          //(('res', res);
          //((' this.waterMeters', this.waterMeters);
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
  //navigatetoupdate
  edit(id: string) {
    this.router.navigate(['/control-panel/maintenance/update-water-meter', id]);
    this.sharedServices.changeButton({
      action: 'Update',
      componentName: 'List',
    } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //#endregion
  //#region Helper Functions
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
  isListEmpty
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.waterMetersService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {
          //(('delete response', resonse);
          this.getWaterMeters();

          let deletedItem = this.waterMeters.find(x => x.id == id) as WaterMetersVM ;
          let deletedVendorIndex =  this.waterMeters.indexOf(deletedItem);
           let offersList= this.waterMeters.splice(deletedVendorIndex,1);


          if (resonse.success == true) {


            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            if(this.waterMeters.length==0)
            {
              this.isListEmpty=true
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
          title: this.lang == 'ar' ? 'رقم العداد' : 'Meter Number',
          field: 'meterNumber',
        },

        this.lang == 'ar'
          ? { title: 'المبنى', field: 'buildingNameAr' }
          : { title: 'Building', field: 'buildingNameEn' },
        this.lang == 'ar'
          ? { title: 'الوحدة', field: 'unitNameAr' }
          : { title: 'Unit', field: 'unitNameEn' },
        {
          title: this.lang == 'ar' ? 'رقم الحساب' : 'Account Number',
          field: 'accountNumber',
        },

        {
          title: this.lang == 'ar' ? 'رقم الاشتراك' : 'Subscription Number',
          field: 'subscriptionNumber',
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
    return "<i class=' fa fa-edit'></i>";
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
        { field: 'meterNumber', type: 'like', value: searchTxt },
        { field: 'accountNumber', type: 'like', value: searchTxt },
        { field: 'subscriptionNumber', type: 'like', value: searchTxt },
        { field: 'buildingNameAr', type: 'like', value: searchTxt },
        { field: 'buildingNameEn', type: 'like', value: searchTxt }



      ],
    ];
  }

  openAddWaterMeters() { }

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


