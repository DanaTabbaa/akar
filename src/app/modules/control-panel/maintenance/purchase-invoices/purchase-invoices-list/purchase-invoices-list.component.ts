import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';

import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { PurchaseOrdersService } from 'src/app/core/services/backend-services/purchase-orders.service';
import { PurchaseOrdersVM } from 'src/app/core/models/ViewModel/purchase-orders-vm';
import { MaintenancePurchaseBillsService } from 'src/app/core/services/backend-services/maintenance-purchase-bills.service';
import { MaintenancePurchaseBills } from 'src/app/core/models/maintenance-purchase-bills';
import { PurchaseBillsVM } from 'src/app/core/models/ViewModel/purchase-bills-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const PAGEID = 31; // from pages table in database seeding table
@Component({
  selector: 'app-purchase-invoices-list',
  templateUrl: './purchase-invoices-list.component.html',
  styleUrls: ['./purchase-invoices-list.component.scss']
})
export class PurchaseInvoicesListComponent implements OnInit {
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private maintenancePurchaseBillsService: MaintenancePurchaseBillsService) { }

    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getMaintenancePurchaseInvoices();
    this.defineGridColumn()
  }
  purchaseInvoices: PurchaseBillsVM[] = [];
  addUrl: string = '/control-panel/maintenance/add-purchase-invoice';
  updateUrl: string = '/control-panel/maintenance/update-purchase-invoice/';
  listUrl: string = '/control-panel/maintenance/purchase-invoices-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.purchase-invoices",
    componentAdd: '',
  };
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


  getMaintenancePurchaseInvoices() {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenancePurchaseBillsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.purchaseInvoices = res.data.map((res: PurchaseBillsVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.purchaseInvoices", this.purchaseInvoices);
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
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData)
    this.router.navigate(['/control-panel/maintenance/update-purchase-invoice', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }

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
        { title: this.lang == 'ar' ? 'رقم الفاتورة' : 'Bill Number', field: 'id' },
        { title: this.lang == 'ar' ? 'تاريخ الفاتورة' : 'Bill Date', field: 'date' },
        { title: this.lang == 'ar' ? 'رقم طلب الشراء' : 'Purchase Order Id', field: 'purchaseOrderId' },
        { title: this.lang == 'ar' ? 'رقم عرض سعر الصيانة' : 'Maintenance Price Offer Id', field: 'maintenanceOfferId' },
        { title: this.lang == 'ar' ? 'الاجمالى قبل الضريبة' : 'Total Before Tax', field: 'totalBeforeTax' },
        { title: this.lang == 'ar' ? 'اجمالى الضريبة' : 'Total Tax', field: 'totalTax' },
        { title: this.lang == 'ar' ? 'الاجمالى بعد الضريبة' : 'Total After Tax', field: 'totalAfterTax' },

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
        { field: 'maintenanceOfferId', type: 'like', value: searchTxt },
        { field: 'purchaseOrderId', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openPurchaseInvoices() { }

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
    modalRef.componentInstance.message = this.translate.transform("general.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("buttons.delete");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.maintenancePurchaseBillsService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {
          //(('delete response', resonse);
          this.getMaintenancePurchaseInvoices();
          let deletedItem = this.purchaseInvoices.find(x => x.id == id) as PurchaseBillsVM  ;
          let deletedVendorIndex =  this.purchaseInvoices.indexOf(deletedItem);
          let purchaseInvoicesList= this.purchaseInvoices.splice(deletedVendorIndex,1);
          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
          this.translate.transform("messages.delete-success")
            );
            if(this.purchaseInvoices.length==0)
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


