import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { VwDistrictsVM } from 'src/app/core/models/ViewModel/vw-districts-vm';
import { DistrictsService } from 'src/app/core/services/backend-services/district.service';
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
import { DistrictActions } from 'src/app/core/stores/actions/district.actions';
const PAGEID = 40;
@Component({
  selector: 'app-districts-list',
  templateUrl: './districts-list.component.html',
  styleUrls: ['./districts-list.component.scss']
})
export class DistrictsListComponent implements OnInit, OnDestroy,OnChanges {
  @Input() changeDistrictsFlag:number= 0;
  constructor(private router: Router,
    private modalService: NgbModal,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private store: Store<any>,
    private rolesPerimssionsService: RolesPermissionsService,
    private districtsService: DistrictsService) { }

  ngOnInit(): void {
    this.getPagePermissions(PAGEID);
    this.listenToClickedButton();
   // this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getDistricts();
    this.defineGridColumn();
  }


  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
  districts: VwDistrictsVM[] = [];
  addUrl: string = '/control-panel/settings/add-district';
  updateUrl: string = '/control-panel/settings/update-district/';
  listUrl: string = '/control-panel/settings/districts-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-districts",
    componentAdd: '',
  };
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeDistrictsFlag){
      this.getDistricts();
    }

  }

  getDistricts() {

    const promise = new Promise<void>((resolve, reject) => {
      this.districtsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.districts = res.data.map((res: VwDistrictsVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.districts", this.districts);
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
          complete: () => { },
        });
    });
    return promise;
  }
  //#endregion

  //navigatetoupdate
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData)
    this.router.navigate(['/control-panel/settings/update-district', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

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
    this.sharedServices.getLanguage().subscribe((res) => {

      this.lang = res;
      this.columnNames = [
        { title: this.lang == 'ar' ? 'رقم' : 'Id', field: 'id' },
        this.lang == "ar"
          ? { title: ' المدن', field: 'cityNameAr' }
          : { title: ' City  ', field: 'cityNameEn' },
        this.lang == "ar"
          ? { title: ' الحي', field: 'districtNameAr' }
          : { title: ' District  ', field: 'districtNameEn' },
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
        { field: 'cityNameAr', type: 'like', value: searchTxt },
        { field: 'cityNameEn', type: 'like', value: searchTxt },
        { field: 'districtNameAr', type: 'like', value: searchTxt },
        { field: 'districtNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openDistricts() { }

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
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        var deletedItem = this.districts.find(x => x.id == id);
        this.districtsService.deleteWithUrl("Delete?id=" + id).subscribe((resonse) => {
          this.getDistricts();
          if (resonse.success == true) {
            this.store.dispatch(DistrictActions.actions.delete({
              data: JSON.parse(JSON.stringify({ ...deletedItem }))
            }));
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
        },500);
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
