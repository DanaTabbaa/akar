import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { EquipmentsVM } from 'src/app/core/models/ViewModel/equipments-vm';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { EquipmentsService } from 'src/app/core/services/backend-services/equipments.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 28; // from pages table in database seeding table
@Component({
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss']
})
export class EquipmentsListComponent implements OnInit, OnDestroy {

  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-equipment';
  updateUrl: string = '/control-panel/maintenance/update-equipment/';
  listUrl: string = '/control-panel/maintenance/equipments-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.equipments",
    componentAdd: '',
  };
  equipments: EquipmentsVM[] = [];
  //#endregion
  //#region Constructor
  constructor(
    private equipmentsService: EquipmentsService,
    private router: Router,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe


  ) { }
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getEquipments();
    this.defineGridColumn();
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
  getEquipments() {
    const promise = new Promise<void>((resolve, reject) => {
      this.equipmentsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.equipments = res.data.map((res: EquipmentsVM[]) => {
            return res;
          });
          resolve();
          //(('res', res);
          //((' this.equipments', this.equipments);
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
    this.router.navigate(['/control-panel/maintenance/update-equipment', id]);
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
        this.getEquipments();
        this.equipmentsService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {
          let deletedItem = this.equipments.find(x => x.id == id) as EquipmentsVM ;
          let deletedVendorIndex =  this.equipments.indexOf(deletedItem);
          let equipmentsList= this.equipments.splice(deletedVendorIndex,1);


          if (resonse.success == true) {
            this.showResponseMessage(
              true,
              AlertTypes.success,
              this.translate.transform('messages.delete-success')
            );

            if(this.equipments.length==0)
            {
              this.isListEmpty=true
            }
          } else if (resonse.success == false) {
            this.showResponseMessage(
              false,
              AlertTypes.error,
              this.translate.transform('messages.delete-faild')
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
          title: this.lang == 'ar' ? ' رقم المعدة' : 'Equipment Number',
          field: 'equipmentNumber',
        },
        this.lang == 'ar'
          ? { title: ' أسم المعدة', field: 'equipmentNameAr' }
          : { title: ' Equipment Name  ', field: 'equipmentNameEn' },

        this.lang == 'ar'
          ? { title: 'المالك', field: 'ownerNameAr' }
          : { title: ' Owner', field: 'ownerNameEn' },
        {
          title: this.lang == 'ar' ? ' سنة الصنع' : 'Manufacture Year',
          field: 'manufactureYear',
        },
        {
          title: this.lang == 'ar' ? 'موديل' : ' Model',
          field: 'model',
        },
        {
          title: this.lang == 'ar' ? 'الشركة المصنعة' : 'Manufacturing Company',
          field: 'manufacturingCompany',
        },
        {
          title: this.lang == 'ar' ? 'الشركة الموردة' : 'Supplying Company',
          field: 'supplyingCompany',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ التركيب' : 'Installation Date',
          field: 'installationDate',
        },
        {
          title: this.lang == 'ar' ? 'مكان التركيب' : 'Installation Place',
          field: 'installationPlace',
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
        { field: 'equipmentNumber', type: 'like', value: searchTxt },
        { field: 'equipmentNameAr', type: 'like', value: searchTxt },
        { field: 'equipmentNameEn', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'manufactureYear', type: 'like', value: searchTxt },
        { field: 'model', type: 'like', value: searchTxt },



        ,
      ],
    ];
  }

  openAddEquipments() { }

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


