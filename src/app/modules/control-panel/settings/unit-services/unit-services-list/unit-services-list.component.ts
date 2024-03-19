import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { UnitServices } from 'src/app/core/models/unit-services';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UnitServicesService } from 'src/app/core/services/backend-services/unit-services.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 36; // from pages table in database seeding table
@Component({
  selector: 'app-unit-services-list',
  templateUrl: './unit-services-list.component.html',
  styleUrls: ['./unit-services-list.component.scss']
})
export class UnitServicesListComponent implements OnInit, OnDestroy,OnChanges {
  //#region Main Declarations
  @Input() changeUnitServicesFlag:number= 0;
  unitServices: UnitServices[] = [];
  addUrl: string = '/control-panel/settings/add-unit-service';
  updateUrl: string = '/control-panel/settings/update-unit-service/';
  listUrl: string = '/control-panel/settings/unit-services-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.unit-services",
    componentAdd: "unit-services.add-unit-service",
  };

  //#endregion

  //#region Constructor

  constructor(private router: Router, private UnitServicesService: UnitServicesService,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private rolesPerimssionsService: RolesPermissionsService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private managerService:ManagerService
  ) { }
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }
  //
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeUnitServicesFlag){
      this.getUnitServices();
    }

  }
  //#region ngOnInit
  ngOnInit(): void {


    
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'SinglePage' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.defineGridColumn();
    this.getUnitServices();
  }
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

  //#endregion
  getUnitServices() {
    this.spinner.show();
    const promise = new Promise<void>((resolve, reject) => {
      this.UnitServicesService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.unitServices = res.data.map((res: UnitServices[]) => {
            return res
          });
          resolve();
          this.spinner.hide();
          //(("res", res);
          //((" this.UnitServices", this.UnitServices);
        },
        error: (err: any) => {
          this.spinner.hide();
          console.log(err)
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

  navigatetoupdate(id: string) {
    this.router.navigate([this.updateUrl, id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate([this.updateUrl, id]);
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
        this.spinner.show();

        this.UnitServicesService.deleteWithUrl("delete?id=" + id).subscribe((resonse) => {
          //(('delete response', resonse);

          this.getUnitServices();
          let deletedItem = this.unitServices.find(x => x.id == id) as UnitServices ;
          let deletedVendorIndex =  this.unitServices.indexOf(deletedItem);
          let unitServicesList= this.unitServices.splice(deletedVendorIndex,1);

          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            if(this.unitServices.length==0)
            {
              this.isListEmpty=true
            }

          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-faild")
            );
          }

        });
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
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
          title: this.lang == 'ar' ? ' الكود' : 'Id',
          field: 'id',
        },
        this.lang == 'ar'
          ? { title: ' الاسم', field: 'unitServiceArName' }
          : { title: ' Name  ', field: 'unitServiceEnName' },
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

      ];
    })
  }
  editFormatIcon() { //plain text value
    return "<i class='fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class='fa fa-trash'></i>";
  };
  CheckBoxFormatIcon() { //plain text value
    return "<input id='yourID' type='checkbox' />";
  };

  direction: string = 'ltr';
  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'nameAr', type: 'like', value: searchTxt },
        { field: 'nameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }
  openAddUnitServices() { }

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
}
