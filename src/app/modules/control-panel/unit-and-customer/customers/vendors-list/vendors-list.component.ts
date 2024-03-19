import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, CheckTableRelationsStatus, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Vendors } from 'src/app/core/models/vendors';
import { VendorsVM } from 'src/app/core/models/ViewModel/vendors-vm';
import { VendorsService } from 'src/app/core/services/backend-services/vendors.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { Store } from '@ngrx/store';
import { VendorActions } from 'src/app/core/stores/actions/vendor.actions';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 11; // from pages table in database seeding table
@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: ['./vendors-list.component.scss'],
})
export class VendorsListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  vendors: Vendors[] = [];
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-vendor';
  updateUrl: string = '/control-panel/definitions/update-vendor/';
  listUrl: string = '/control-panel/definitions/vendors-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-vendors",
    componentAdd: "component-names.add-vendor",
  };
  //#endregion

  //#region Constructor
  constructor(
    private vendorsService: VendorsService,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    //private rolesPerimssionsService: RolesPermissionsService,
    //private store: Store<any>,
    private router: Router,
    private managerService:ManagerService
  ) { }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadVendors()

    ]).then(a=>{
      this.spinner.hide();
      this.vendors = this.managerService.getVendors();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(e=>{
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
  //#region Helper Functions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(this.userPermissions);
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
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  // getVendors() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.vendorsService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.vendors = res.data.map((res: VendorsVM[]) => {
  //           return res;
  //         });
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

  //#region CRUD Operations

  //#endregion

  //#region Helper Functions
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
    this.router.navigate(['/control-panel/definitions/update-vendor', id]);
  }
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        let sub = this.vendorsService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe((resonse) => {
          
          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            this.managerService.loadVendors().then(a => {
              this.vendors = this.managerService.getVendors();
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
          }else
          {
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

        this.lang == 'ar'
          ? { title: ' الاسم', field: 'nameAr' }
          : { title: ' Name  ', field: 'nameEn' },
        {
          title: this.lang == 'ar' ? ' رقم الجوال' : 'Mobile',
          field: 'mobile',
        },
        {
          title: this.lang == 'ar' ? 'رقم الهاتف' : ' phone',
          field: 'phone',
        },
        {
          title: this.lang == 'ar' ? 'رقم الهوية' : ' Identity No',
          field: 'identityNo',
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
    return "<i class='fa fa-trash'></i>";
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
        { field: 'nameEn', type: 'like', value: searchTxt },
        { field: 'nameAr', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openAddVendors() { }

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
        this.showConfirmDeleteMessage(event.item.id);
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
}
