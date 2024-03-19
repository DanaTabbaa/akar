import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ProductsReceipt } from 'src/app/core/models/products-receipt';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { ProductsReceiptService } from 'src/app/core/services/backend-services/products-receipt.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 25; // from pages table in database seeding table
@Component({
  selector: 'app-products-receipt-list',
  templateUrl: './products-receipt-list.component.html',
  styleUrls: ['./products-receipt-list.component.scss']
})
export class ProductsReceiptListComponent implements OnInit, OnDestroy {

  productsReceipts: ProductsReceipt[] = [];
  //#region Main Declarations
  currnetUrl: any;
  queryParams: any;
  maintenanceRequestId: any;
  id: any;
  sub: any
  addUrl: string = '/control-panel/maintenance/add-products-receipt';

  updateUrl: string = '/control-panel/maintenance/update-products-receipt/';
  listUrl: string = '/control-panel/maintenance/products-receipt-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.products-receipts",
    componentAdd: '',
  };
  //#endregion
  //#region Constructor
  constructor(
    private productsReceiptService: ProductsReceiptService,
    private router: Router,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private route: ActivatedRoute


  ) { }
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    this.queryParams = this.route.queryParams.subscribe(params => {

      if (params['maintenanceRequestId'] != null) {
        this.maintenanceRequestId = params['maintenanceRequestId'];

      }

    })
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getProductsReceipt();
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
  getProductsReceipt() {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsReceiptService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.productsReceipts = res.data.map((res: ProductsReceipt[]) => {
            return res;
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

  //navigatetoupdate
  edit(id: string) {
    this.sharedServices.changeButton({ action: "Update" } as ToolbarData)
    this.router.navigate(['/control-panel/maintenance/update-products-receipt', id]);
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
      if (rs == 'Confirm') {
        this.getProductsReceipt();
        this.productsReceiptService.deleteWithUrl("Delete?id="+ id).subscribe((resonse) => {
          let deletedItem = this.productsReceipts.find(x => x.id == id) as ProductsReceipt ;
          let deletedVendorIndex =  this.productsReceipts.indexOf(deletedItem);
           let productsReceiptsList= this.productsReceipts.splice(deletedVendorIndex,1);


          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            if(this.productsReceipts.length==0)
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
          title: this.lang == 'ar' ? ' رقم سند الصرف' : 'Number',
          field: 'id',
        },

        {
          title: this.lang == 'ar' ? 'رقم طلب الصيانة' : 'Maintenance Request Number',
          field: 'maintenanceRequestId',
        },

        {
          title: this.lang == 'ar' ? 'تاريخ السند' : 'Products Receipt Date',
          field: 'date',
        },
        this.lang == 'ar'
          ? { title: 'المستأجر', field: 'tenantNameAr' }
          : { title: 'Tenant', field: 'tenantNameEn' },
        this.lang == 'ar'
          ? { title: 'الفنى', field: 'technicianNameAr' }
          : { title: 'Technician', field: 'technicianNameEn' },
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
        { field: 'maintenanceRequestId', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        { field: 'technicianNameAr', type: 'like', value: searchTxt },
        { field: 'technicianNameEn', type: 'like', value: searchTxt }
        ,
      ],
    ];
  }

  openAddProductsReceipt() { }

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

            if (this.maintenanceRequestId != '') {
              this.router.navigate([this.addUrl], { queryParams: { maintenanceRequestId: this.maintenanceRequestId } });

            }
            else {
              this.router.navigate([this.addUrl]);
            }


          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
}




