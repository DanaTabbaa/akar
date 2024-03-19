import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AlertTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { MaintenanceRequestsVM } from 'src/app/core/models/ViewModel/maintenance-requests-vm';
import { MaintenanceRequestsService } from 'src/app/core/services/backend-services/maintenance-requests.service';
import { MaintenanceRequests } from 'src/app/core/models/maintenance-requests';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { MaintenanceRequestsActions } from 'src/app/core/stores/actions/maintenancerequests.actions';

const PAGEID = 24; // from pages table in database seeding table
@Component({
  selector: 'app-maintenance-requests-list',
  templateUrl: './maintenance-requests-list.component.html',
  styleUrls: ['./maintenance-requests-list.component.scss'],
})
export class MaintenanceRequestsListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-maintenance-request';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-request/';
  listUrl: string = '/control-panel/maintenance/maintenance-requests-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.maintenance-requests',
    componentAdd: '',
  };
  maintenanceRequests: MaintenanceRequestsVM[] = [];
  //#endregion
  //#region Constructor
  constructor(
    private maintenanceRequestsService: MaintenanceRequestsService,
    private router: Router,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private store: Store<any>
  ) {}
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem('PageId', PAGEID.toString());
    this.getPagePermissions(PAGEID);
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getMaintenanceRequests();
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
      this.rolesPerimssionsService
        .getAll('GetPagePermissionById?pageId=' + pageId)
        .subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
            this.userPermissions = JSON.parse(
              this.rolePermission.permissionJson
            );
            this.sharedServices.setUserPermissions(this.userPermissions);
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {},
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
  getMaintenanceRequests() {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceRequestsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          console.log('getMaintenanceRequests', res);
          this.maintenanceRequests = res.data.map(
            (res: MaintenanceRequestsVM[]) => {
              return res;
            }
          );
          resolve();
          //(('res', res);
          //((' this.maintenanceRequests', this.maintenanceRequests);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    } else {
      this.showResponseMessage(
        true,
        AlertTypes.warning,
        this.translate.transform('permissions.permission-denied')
      );
    }
  }

  //navigatetoupdate

  edit(id: string) {
    // this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate([
      '/control-panel/maintenance/update-maintenance-request',
      id,
    ]);
    this.sharedServices.changeButton({
      action: 'Update',
      componentName: 'List',
    } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //navigatetodetails
  details(id: string) {
    this.router.navigate([
      '/control-panel/maintenance/maintenance-request-details',
      id,
    ]);
  }
  //#endregion

  //navigatetoproductsreceipt
  productsReceipt(id: string) {
    this.router.navigate(['/control-panel/maintenance/products-receipt-list'], {
      queryParams: { maintenanceRequestId: id },
    });
  }
  //#endregion
  //navigatetopriceRequest
  priceRequest(id: string) {
    this.router.navigate(['/control-panel/maintenance/add-price-request'], {
      queryParams: { maintenanceRequestId: id },
    });
  }
  //#endregion
  //#region Helper Functions
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        message,
        this.translate.transform('messages.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        message,
        this.translate.transform('messages.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        message,
        this.translate.transform('messages.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        message,
        this.translate.transform('messages.error')
      );
    }
  }

  isListEmpty;
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();

        this.maintenanceRequestsService
          .deleteWithUrl('Delete?id=' + id)
          .subscribe((resonse) => {
            let deletedItem = this.maintenanceRequests.find(
              (x) => x.id == id
            ) as MaintenanceRequestsVM;
            let deletedVendorIndex =
              this.maintenanceRequests.indexOf(deletedItem);
            let maintenanceRequestsList = this.maintenanceRequests.splice(
              deletedVendorIndex,
              1
            );

            this.getMaintenanceRequests();
            if (resonse.success == true) {
              this.store.dispatch(
                MaintenanceRequestsActions.actions.delete({
                  data: JSON.parse(JSON.stringify({ ...deletedItem })),
                })
              );
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform('messages.delete-success')
              );

              if (this.maintenanceRequests.length == 0) {
                this.isListEmpty = true;
              }
            } else if (resonse.success == false) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.error,
                this.translate.transform('messages.delete-faild')
              );
            }
          });
        setTimeout(() => {
          this.spinner.hide();
        },500);
      }
    });
  }

  showConfirmCloseRequestMessage(model: MaintenanceRequests) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'maintenance-requests.confirm-close-request'
    );
    modalRef.componentInstance.title = this.translate.transform(
      'maintenance-requests.close-request'
    );
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform(
      'maintenance-requests.close-request'
    );
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        model.requestStatus = 8;
        this.maintenanceRequestsService.update(model).subscribe((resonse) => {
          this.getMaintenanceRequests();
          if (resonse.success == true) {
            this.store.dispatch(
              MaintenanceRequestsActions.actions.update({
                data: JSON.parse(JSON.stringify({ ...resonse.data })),
              })
            );
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              resonse.message
            );
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              resonse.message
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
          title: this.lang == 'ar' ? ' رقم الطلب' : 'Request Id',
          field: 'id',
        },
        this.lang == 'ar'
          ? { title: ' المستأجر', field: 'tenantNameAr' }
          : { title: ' Tenant  ', field: 'tenantNameEn' },
        this.lang == 'ar'
          ? { title: ' الوحدة  ', field: 'unitNameAr' }
          : { title: ' Unit  ', field: 'unitNameEn' },
        this.lang == 'ar'
          ? { title: ' خدمة الصيانة  ', field: 'serviceNameAr' }
          : { title: 'Maintenance Service  ', field: 'serviceNameEn' },
        this.lang == 'ar'
          ? { title: 'الفنى', field: 'technicianNameAr' }
          : { title: 'Technician', field: 'technicianNameEn' },
        this.lang == 'ar'
          ? { title: 'نوع الطلب', field: 'requestTypeAr' }
          : { title: 'Request Type', field: 'requestTypeEn' },

        this.lang == 'ar'
          ? { title: 'حالة الطلب', field: 'requestStatusAr' }
          : { title: 'Request Status', field: 'requestStatusEn' },
        {
          title:
            this.lang == 'ar' ? ' تاريخ انشاء الطلب' : 'Request Creation Date',
          field: 'createDate',
        },
        {
          title:
            this.lang == 'ar'
              ? ' تاريخ أخر تعديل للطلب'
              : 'Last Modification Date',
          field: 'modificationDate',
        },

        this.lang == 'ar'
          ? {
              title: 'حذف',
              field: '',
              formatter: this.deleteFormatIcon,
              cellClick: (e, cell) => {
                this.delete(cell.getRow().getData().id);
              },
            }
          : {
              title: 'Delete',
              field: '',
              formatter: this.deleteFormatIcon,
              cellClick: (e, cell) => {
                this.delete(cell.getRow().getData().id);
              },
            },
        this.lang == 'ar'
          ? {
              title: 'تعديل',
              field: '',
              formatter: this.editFormatIcon,
              cellClick: (e, cell) => {
                this.edit(cell.getRow().getData().id);
              },
            }
          : {
              title: 'Edit',
              field: '',
              formatter: this.editFormatIcon,
              cellClick: (e, cell) => {
                this.edit(cell.getRow().getData().id);
              },
            },
      ];
    });
  }
  editFormatIcon() {
    //plain text value
    return "<i class='fa fa-edit'></i>";
  }
  deleteFormatIcon() {
    //plain text value
    return "<i class=' fa fa-trash'></i>";
  }
  CheckBoxFormatIcon() {
    //plain text value
    return "<input id='yourID' type='checkbox' />";
  }

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
    showDetermineTheTechnician: true,
    showRequestDetails: true,
    showProductReceipt: true,
    showPriceRequest: true,
    showCloseRequest: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'id', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },

        { field: 'unitNameAr', type: 'like', value: searchTxt },
        { field: 'unitNameEn', type: 'like', value: searchTxt },

        { field: 'serviceNameAr', type: 'like', value: searchTxt },
        { field: 'serviceNameEn', type: 'like', value: searchTxt },

        { field: 'technicianNameAr', type: 'like', value: searchTxt },
        { field: 'technicianNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openAddMaintenanceRequests() {}

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (
        event.actionName == 'Edit' ||
        event.actionName == 'DetermineTheTechnician'
      ) {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
        } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'RequestDetails') {
        this.details(event.item.id);
      } else if (event.actionName == 'ProductReceipt') {
        this.productsReceipt(event.item.id);
      } else if (event.actionName == 'PriceRequest') {
        this.priceRequest(event.item.id);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      } else if (event.actionName == 'CloseRequest') {
        this.showConfirmCloseRequestMessage(event.item);
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
