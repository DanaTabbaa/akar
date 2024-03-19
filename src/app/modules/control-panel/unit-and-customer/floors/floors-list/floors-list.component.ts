import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { Floor } from 'src/app/core/models/floors';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { FloorsService } from 'src/app/core/services/backend-services/floors.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 6; // from pages table in database seeding table
@Component({
  selector: 'app-floors-list',
  templateUrl: './floors-list.component.html',
  styleUrls: ['./floors-list.component.scss']
})
export class FloorsListComponent implements OnInit, OnDestroy {


  //#region Main Declarations
  floors: Floor[] = [];
  addUrl: string = '/control-panel/definitions/add-floor';
  updateUrl: string = '/control-panel/definitions/update-floor/';
  listUrl: string = '/control-panel/definitions/floors-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-floors",
    componentAdd: '',
  };
  //#endregion

  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private floorService: FloorsService,
    private managerService: ManagerService,
  ) { }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.loadData();
  }
  //#endregion

  //#region ngOnDestroy
  subsList: Subscription[] = [];
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

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  loadData() {
    this.defineGridColumn();
    //this.getPagePermissions(PAGEID)
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadFloors(),
    ]).then(a => {
      this.spinner.hide();
      this.floors = this.managerService.getFloors();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();

    }).catch(e => {
      this.spinner.hide();
    });



    //this.getFloors();
  }
  // getFloors() {
  //   this.spinner.show();
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.floorService.getAll<ResponseResult<Floor[]>>("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.floors = JSON.parse(JSON.stringify(res.data))
  //         resolve();
  //         setTimeout(() => {
  //           this.spinner.hide();
  //         }, 500);

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //         this.spinner.hide();
  //       },
  //       complete: () => {
  //         this.spinner.hide();
  //       },
  //     });
  //   });
  //   return promise;
  // }

  //#endregion

  //#region CRUD Operations


  //#endregion

  //#region Helper Functions
  //#region Toolbar

  currentBtn!: string;

  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {

          } else if (currentBtn.action == ToolbarActions.New) {
            this.navigateUrl(this.addUrl);
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }


  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.success, this.translate.transform("permissions.permission-denied"))

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
    let sub = this.sharedServices.getLanguage().subscribe((res) => {

      this.lang = res;
      this.columnNames = [
        { title: this.lang == 'ar' ? 'الرقم' : 'id', field: 'id' },
        this.lang == 'ar' ? { title: ' الاسم', field: 'floorNameAr' } : { title: ' Name  ', field: 'floorNameEn' },

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
        { field: 'floorNameAr', type: 'like', value: searchTxt },
        { field: 'floorNameEn', type: 'like', value: searchTxt },
        { field: 'id', type: 'like', value: searchTxt },

        ,
      ],
    ];
  }
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update', componentName: 'List', } as ToolbarData);
    this.router.navigate([this.updateUrl, id,]);
  }
  openFloors() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {

        localStorage.setItem("RecordId", event.item.id);
        this.edit(event.item.id);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.showConfirmDeleteMessage(event.item.id);
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
        let sub = this.floorService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe((resonse) => {
          //(('delet response', resonse);
         

         

          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
            this.managerService.loadFloors().then(a => {
              this.spinner.hide();
              this.floors = this.managerService.getFloors();
  
            })

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

        });

        this.subsList.push(sub);
      }
    });
  }

  //#endregion

}
