import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';

import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { TranslatePipe } from '@ngx-translate/core';
import { MaintenanceBills } from 'src/app/core/models/maintenance-bills';
import { MaintenanceBillsService } from 'src/app/core/services/backend-services/maintenance-bills.service';
import { VwMaintenanceBills } from 'src/app/core/models/ViewModel/vw-maintenance-bills';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { NgxSpinnerService } from 'ngx-spinner';
const PAGEID = 32; // from pages table in database seeding table
@Component({
  selector: 'app-maintenance-bills-list',
  templateUrl: './maintenance-bills-list.component.html',
  styleUrls: ['./maintenance-bills-list.component.scss']
})
export class MaintenanceBillsListComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Main Declarations
  maintenanceBills: MaintenanceBills[] = [];
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-maintenance-bill';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-bill/';
  listUrl: string = '/control-panel/maintenance/maintenance-bills-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.maintenance-bills",
    componentAdd: '',

  };
  //#endregion

  //#region Constructor
  constructor(
    private maintenanceBillsService: MaintenanceBillsService,
    private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe
  ) { }


  //#endregion

  //#region ngOnInit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.defineGridColumn();

  }

  ngAfterViewInit(): void {
    this.listenToClickedButton();

    this.getMaintenanceBills();
    setTimeout(() => {
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
    }, 300);



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
  getMaintenanceBills() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceBillsService.getWithResponse<VwMaintenanceBills[]>("GetAllVM").subscribe({
        next: (res) => {
          //((res);
          this.spinner.show();
          //let data =
          //   res.data.map((res: PeopleOfBenefitsVM[]) => {
          //   return res;
          // });
          if (res.success) {
            this.maintenanceBills = JSON.parse(JSON.stringify(res.data));
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 500);

          resolve();

        },
        error: (err: any) => {
          reject(err);
          this.spinner.hide();
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
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }

  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/maintenance/update-maintenance-bill', id]);

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
  openMaintenanceBills() { }


  isListEmpty
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        let sub = this.maintenanceBillsService.deleteWithResponse("Delete?Id=" + id).subscribe(
          (resonse) => {
            //reloadPage()
            this.getMaintenanceBills();
            let deletedItem = this.maintenanceBills.find(x => x.id == id) as MaintenanceBills ;
            let deletedVendorIndex =  this.maintenanceBills.indexOf(deletedItem);
            let maintenanceBillsList= this.maintenanceBills.splice(deletedVendorIndex,1);
            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              if(this.maintenanceBills.length==0)
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
    this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [

        {
          title: this.lang == 'ar' ? ' رقم ' : 'Number',
          field: 'id',
        },
        {
          title: this.lang == 'ar' ? ' تاريخ الفاتورة ' : 'Bill Date',
          field: 'date',
        },
        {
          title: this.lang == 'ar' ? 'رقم طلب الصيانة' : 'Maintenance Request Id',
          field: 'maintenanceRequestId',
        },

        this.lang == 'ar'
          ? { title: 'المستأجر', field: 'tenantNameAr' }
          : { title: 'Tenant', field: 'tenantNameEn' },

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
        { field: 'tenantNameEn', type: 'like', value: searchTxt }

        ,
      ],
    ];
  }

  openPeopleOfBenefits() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        ;
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
          submitMode: false
        } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        // this.router.navigate(['control-panel/maintenance/update-maintenance-bill/'+event.item.id])

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
        //currentBtn;
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

