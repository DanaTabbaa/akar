import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { GroundVM } from 'src/app/core/models/ViewModel/grounds-vm';
import { GroundsService } from 'src/app/core/services/backend-services/grounds.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { Ground } from 'src/app/core/models/grounds';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 9; // from pages table in database seeding table
@Component({
  selector: 'app-grounds-list',
  templateUrl: './grounds-list.component.html',
  styleUrls: ['./grounds-list.component.scss']
})
export class GroundsListComponent implements OnInit, OnDestroy {

  addUrl: string = '/control-panel/definitions/add-ground';
  updateUrl: string = '/control-panel/definitions/update-ground/';
  listUrl: string = '/control-panel/definitions/grounds-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: this.listUrl,
    addPath: '',
    updatePath: this.updateUrl,
    componentList: this.translate.transform("component-names.list-grounds"),
    componentAdd: '',
  };

  constructor(private groundsService: GroundsService,
    private router: Router,
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private rolesPerimssionsService: RolesPermissionsService,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService
  ) { }
  //Properties
  grounds: Ground[] = [];
  //
  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();

    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID), this.managerService.loadGrounds()]).then(a => {
      this.grounds = this.managerService.getGrounds();
      this.spinner.hide();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();

    }).catch(e => {
      this.spinner.hide();
    });




  }
  //
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }
  //#endregion
  //#region Helper Functions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         resolve();
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(this.userPermissions);


  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //     this.subsList.push(sub);
  //   });


  // }
  //#endregion
  //#region Basic Data


  //#endregion

  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/definitions/update-ground', id]);
  }//#region Toolbar Service

  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {

          } else if (currentBtn.action == ToolbarActions.New) {
            this.router.navigate(['/control-panel/definitions/add-ground']);
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion


  //#region Tabulator
  buildings: GroundVM[] = [];
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  defineGridColumn() {
    let sub = this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [

        this.lang == 'ar'
          ? { title: 'أسم الأرض', field: 'groundNameAr' }
          : { title: 'Ground', field: 'groundNameEn' },
        this.lang == 'ar'
          ? { title: ' المالك السابق ', field: 'previousOwnerNameAr' }
          : { title: ' Previous Owner  ', field: 'previousOwnerNameEn' },
        this.lang == 'ar'
          ? { title: ' المالك ', field: 'ownerNameAr' }
          : { title: ' Owner  ', field: 'ownerNameEn' },

        {
          title: this.lang == 'ar' ? ' المساحة' : ' Area Size  ',
          field: 'areaSize',
        },
        {
          title: this.lang == 'ar' ? 'سعر المتر' : 'Meter Price ',
          field: 'meterPrice',
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
    });
    this.subsList.push(sub);
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
  columnNames: any[] = [];

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'groundNameAr', type: 'like', value: searchTxt },
        { field: 'groundNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }


  openAddGround() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      }
    }
  }

  //#endregion

  //#region Helper
  //#region Helper Functions

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.spinner.show();
        let sub = this.groundsService.deleteWithUrl("DeleteWithCheck?Id=" + id).subscribe(
          (resonse: ResponseResultNoraml) => {

            //reloadPage()            

            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              this.managerService.loadGrounds().then(a => {
                this.grounds = this.managerService.getGrounds();
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

  //#endregion
}
