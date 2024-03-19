import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MaintenanceOffersVM } from 'src/app/core/models/ViewModel/maintenance-offers-vm';
import { MaintenanceOffersService } from 'src/app/core/services/backend-services/maintenance-offers.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
const PAGEID = 30; // from pages table in database seeding table
@Component({
  selector: 'app-maintenance-offers-list',
  templateUrl: './maintenance-offers-list.component.html',
  styleUrls: ['./maintenance-offers-list.component.scss']
})
export class MaintenanceOffersListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-maintenance-offer';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-offer/';
  listUrl: string = '/control-panel/maintenance/maintenance-offers-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.maintenance-offers",
    componentAdd: "maintenance-offers.add-maintenance-offer",
  };
  maintenanceOffers: MaintenanceOffersVM[] = [];

  //#endregion

  //#region Constructor

  constructor(
    private maintenanceOffersService: MaintenanceOffersService,
    private sharedServices: SharedService,
    private router: Router,
    private translate: TranslatePipe,
    private rolesPerimssionsService: RolesPermissionsService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService
  ) { }

  //#endregion

  //#region ngOnInit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getMaintenanceOffers();
    this.defineGridColumn();
  }

  //#endregion

  //#region ngOnDestory
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
  getMaintenanceOffers() {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceOffersService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.maintenanceOffers = res.data.map((res: MaintenanceOffersVM[]) => {
            return res;
          });
          resolve();
          //(('res', res);
          //((' this.maintenanceOffers', this.maintenanceOffers);
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

  //#region CRUD Operations
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }

  //#endregion

  //#region Helper Functions

  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/maintenance/add-maintenance-offer'], {
      queryParams: { typeOfComponent: typeOfComponent },
    });
  }
  edit(id: string) {

    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData)
    this.router.navigate(['/control-panel/maintenance/update-maintenance-offer', id]);
  }

  isListEmpty

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {

        this.maintenanceOffersService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {
          //(('delete response', resonse);
          this.getMaintenanceOffers();
          let deletedItem = this.maintenanceOffers.find(x => x.id == id) as MaintenanceOffersVM ;
          let deletedVendorIndex =  this.maintenanceOffers.indexOf(deletedItem);
          let maintenanceOffersList= this.maintenanceOffers.splice(deletedVendorIndex,1);
          if (resonse.success == true) {

            this.showResponseMessage(resonse.success, AlertTypes.success,
              this.translate.transform("messages.delete-success")
               )
          } else if (resonse.success == false) {
            this.showResponseMessage(resonse.success, AlertTypes.error,

              this.translate.transform("messages.delete-faild"))
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
    this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [
        {
          title: this.lang == 'ar' ? 'رقم العرض' : 'Offer Price Number',
          field: 'id',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ العرض' : 'Offer Date',
          field: 'date',
        },
        {
          title: this.lang == 'ar' ? 'رقم طلب الشراء' : 'Purchase Order Number',
          field: 'purchaseOrderId',
        },
        this.lang == 'ar'
          ? { title: ' المورد', field: 'supplierNameAr' }
          : { title: ' Supplier  ', field: 'supplierNameEn' },
        {
          title: this.lang == 'ar' ? ' مدة العرض' : 'Offer Duration',
          field: 'offerDuration',
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
        { field: 'id', type: 'like', value: searchTxt },
        { field: 'purchaseOrderId', type: 'like', value: searchTxt },
        { field: 'supplierNameAr', type: 'like', value: searchTxt },
        { field: 'supplierNameEn', type: 'like', value: searchTxt },
        { field: 'offerDuration', type: 'like', value: searchTxt }



      ],
    ];
  }

  openAddMaintenanceOffers() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update', componentName: 'List' } as ToolbarData);
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

  //#endregion
}
