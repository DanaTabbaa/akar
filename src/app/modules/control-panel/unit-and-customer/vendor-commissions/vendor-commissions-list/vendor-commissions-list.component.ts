import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { VendorCommissions } from 'src/app/core/models/vendor-commissions';

import { VendorCommissionsService } from 'src/app/core/services/backend-services/vendor-commissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NgxSpinnerService } from 'ngx-spinner';

const PAGEID = 16; // from pages table in database seeding table
@Component({
  selector: 'app-vendor-commissions-list',
  templateUrl: './vendor-commissions-list.component.html',
  styleUrls: ['./vendor-commissions-list.component.scss']
})
export class VendorCommissionsListComponent implements OnInit {




  //#region Main Declarations
  vendorCommissions: VendorCommissions[] = [];
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-vendor-commission';
  updateUrl: string = '/control-panel/definitions/update-vendor-commission/';
  listUrl: string = '/control-panel/definitions/vendor-commissions-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-vendors-commissions",
    componentAdd: '',

  };


  //#endregion

  //#region Constructor
  constructor(
    private vendorCommissionsService: VendorCommissionsService,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,    
    private translate: TranslatePipe,
    private router: Router,
    private managerService: ManagerService,
    private spinner: NgxSpinnerService) { }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadVendorCommissions(),
    ]).then(a => {
      this.spinner.hide();
      this.vendorCommissions = this.managerService.getVendorCommissions();
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
  }
  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
  //#region Permissions
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
    this.router.navigate(['/control-panel/definitions/update-vendor-commission', id]);
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
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        let sub = this.vendorCommissionsService.deleteWithUrl("DeleteWithCheck?Id="+id).subscribe({
          next: (resonse) => {
            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              this.managerService.loadVendorCommissions().then(a => {
                this.spinner.hide();
                this.vendorCommissions = this.managerService.getVendorCommissions();
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
          },
          error:(err)=>{

          },
          complete:()=>{}
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
        this.lang == 'ar'
          ? { title: ' العمولة', field: 'nameAr' }
          : { title: ' Commission  ', field: 'nameEn' },
        // this.lang == 'ar'
        //   ? { title: ' المندوب', field: 'vendorNameAr' }
        //   : { title: ' vendor  ', field: 'vendorNameEn' },
        {
          title: this.lang == 'ar' ? 'القيمة ' : ' Value',
          field: 'value',
        },
        {
          title: this.lang == 'ar' ? 'نسبة' : ' Ratio',
          field: 'ratio',
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
        { field: 'nameEn', type: 'like', value: searchTxt },
        { field: 'nameAr', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openVendorCommissions() { }

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
