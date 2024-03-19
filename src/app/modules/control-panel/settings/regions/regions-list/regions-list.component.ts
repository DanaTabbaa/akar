import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { VwRegionVM } from 'src/app/core/models/ViewModel/vw-regions-vm';
import { RegionsService } from 'src/app/core/services/backend-services/regions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { Store } from '@ngrx/store';
import { RegionActions } from 'src/app/core/stores/actions/region.actions';
const PAGEID = 38; // from pages table in database seeding table
@Component({
  selector: 'app-regions-list',
  templateUrl: './regions-list.component.html',
  styleUrls: ['./regions-list.component.scss']
})
export class RegionsListComponent implements OnInit, OnDestroy,OnChanges {
  @Input() changeDistrictsFlag:number= 0;
  constructor(private router: Router,
    private modalService: NgbModal,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private store: Store<any>,
    private regionsService: RegionsService) { }

  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
   // this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getRegions();
    this.defineGridColumn();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeDistrictsFlag){
      this.getRegions();
    }

  }

  regions: VwRegionVM[] = [];
  addUrl: string = '/control-panel/settings/add-region';
  updateUrl: string = '/control-panel/settings/update-region/';
  listUrl: string = '/control-panel/settings/regions-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-regions",
    componentAdd: '',
  };
  errorMessage = '';
  errorClass = '';
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
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
  getRegions() {

    const promise = new Promise<void>((resolve, reject) => {
      this.regionsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.regions = res.data.map((res: VwRegionVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.regions", this.regions);
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



  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/settings/add-region'], { queryParams: { typeOfComponent: typeOfComponent } });
  }
  //navigatetoupdate
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    this.router.navigate(['/control-panel/settings/update-region', id]);
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
        { title: this.lang == 'ar' ? 'رقم' : 'Id', field: 'id' },
        this.lang == "ar"
          ? { title: ' البلد', field: 'countryNameAr' }
          : { title: ' Country  ', field: 'countryNameEn' },
        this.lang == "ar"
          ? { title: ' المنطقة', field: 'regionNameAr' }
          : { title: ' Region  ', field: 'regionNameEn' },
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
    return "<i class='fa fa-edit'></i>";
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
        { field: 'countryNameAr', type: 'like', value: searchTxt },
        { field: 'countryNameAr', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openRegions() { }

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
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }
  isListEmpty:boolean=false;

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        let deletedItem = this.regions.find(x => x.id == id) as VwRegionVM ;
        let deletedVendorIndex =  this.regions.indexOf(deletedItem);
        let regionsList= this.regions.splice(deletedVendorIndex,1);

        this.regionsService.deleteWithUrl("Delete?id=" + id).subscribe((resonse) => {
          this.getRegions();
          if (resonse.success == true) {
            this.store.dispatch(RegionActions.actions.delete({
              data: JSON.parse(JSON.stringify({ ...deletedItem }))
            }));
            if(this.regions.length==0)
            {
              this.isListEmpty=true
            }

            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
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
