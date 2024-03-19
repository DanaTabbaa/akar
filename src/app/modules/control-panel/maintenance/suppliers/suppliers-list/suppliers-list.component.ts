import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import { SuppliersService } from 'src/app/core/services/backend-services/suppliers.service';
import { SuppliersVM } from 'src/app/core/models/ViewModel/suppliers-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { SuppliersActions } from 'src/app/core/stores/actions/suppliers.actions';
import { Store } from '@ngrx/store';
import { Suppliers } from 'src/app/core/models/suppliers';

const PAGEID = 23; // from pages table in database seeding table
@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit, OnDestroy,OnChanges {
@Input() changeSuppliersFlag:number=0;
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-supplier';
  updateUrl: string = '/control-panel/maintenance/update-supplier/';
  listUrl: string = '/control-panel/maintenance/suppliers-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.suppliers",
    componentAdd: '',
  };
  suppliers: SuppliersVM[] = [];
  //#endregion
  //#region Constructor
  constructor(
    private suppliersService: SuppliersService,
    private translate: TranslatePipe,
    private router: Router,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private store: Store<any>


  ) { }
  //#endregion
  //#region ngOnInit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID);
    this.listenToClickedButton();
    //this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getSuppliers();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeSuppliersFlag)
    {
      this.getSuppliers();
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
  getSuppliers() {
    const promise = new Promise<void>((resolve, reject) => {
      this.suppliersService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.suppliers = res.data.map((res: SuppliersVM[]) => {
            return res;
          });
          resolve();
          //(('res', res);
          //((' this.suppliers', this.suppliers);
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
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/maintenance/update-supplier', id]);
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
    modalRef.componentInstance.message =
      modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {

        this.suppliersService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {
          let deletedItem = this.suppliers.find(x => x.id == id) as SuppliersVM ;
          let deletedVendorIndex =  this.suppliers.indexOf(deletedItem);
           let suppliersList= this.suppliers.splice(deletedVendorIndex,1);



          this.getSuppliers();
          if (resonse.success == true) {
            this.store.dispatch(SuppliersActions.actions.delete({
              data: JSON.parse(JSON.stringify({ ...deletedItem }))
            }));
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            if(this.suppliers.length==0)
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
        this.lang == 'ar'
          ? { title: ' الاسم', field: 'supplierNameAr' }
          : { title: ' Name  ', field: 'supplierNameEn' },
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
          field: 'identityNumber',
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
        { field: 'supplierNameAr', type: 'like', value: searchTxt },
        { field: 'supplierNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openAddSuppliers() { }

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

