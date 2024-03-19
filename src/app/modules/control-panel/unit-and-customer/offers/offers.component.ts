import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AlertTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { Offers } from 'src/app/core/models/offers';
import { OffersListVm } from 'src/app/core/models/ViewModel/offers-vm';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { OffersService } from '../../../../core/services/backend-services/offers-service.service';
import { Subscription } from 'rxjs';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const PAGEID = 12; // from pages table in database seeding table
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-offer';
  updateUrl: string = '/control-panel/definitions/update-offer/';
  listUrl: string = '/control-panel/definitions/offers-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-offers',
    componentAdd: '',
  };
  offers: OffersListVm[] = [];
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };
  lang: string = '';
  columnNames: any[] = [];
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.columnNames = [
        this.lang == 'ar'
          ? {
            title: 'المالك',
            field: 'ownerNameAr',
          }
          : {
            title: 'Owner',
            field: 'ownerNameEn',
          },
        this.lang == 'ar'
          ? {
            title: 'المجموعة العقارية ',
            field: 'realestateNameAr',
          }
          : {
            title: 'Realestate ',
            field: 'realestateNameEn',
          },
        this.lang == 'ar' ? {
          title: 'المستأجر ',
          field: 'tenantNameAr',
        } : {
          title: 'Tenant ',
          field: 'tenantNameEn',
        },
        this.lang == 'ar' ? {
          title: 'المندوب ',
          field: 'vendorNameAr',
        } : {
          title: 'vendor ',
          field: 'vendorNameEn',
        },
        {
          title: this.lang == 'ar' ? 'مدة العقد' : 'offer Duration ', field: 'offerDuration',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ العرض' : 'offer Date ', field: 'offerDate',
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
    return "<i class='fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class=' fa fa-trash'></i>";
  };
  CheckBoxFormatIcon() { //plain text value
    return "<input id='yourID' type='checkbox' />";
  };
  direction: string = 'ltr';
  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'ownerNameAR', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'realestateNameAr', type: 'like', value: searchTxt },
        { field: 'realestateNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }
  openAddOffer() { }
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
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  //#endregion main variables declarations
  //#region Constructor
  constructor(
    private OffersService: OffersService,
    private modalService: NgbModal,
    private router: Router,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private rolesPerimssionsService: RolesPermissionsService
  ) { }
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getOffers();
    this.defineGridColumn();
  }
  //#endregion
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
  //#region Authentications
  //
  //
  //#endregion
  //#region Manage State
  //#endregion
  //#region Permissions
  ////#region Helper Functions
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
  //#region Basic Data
  ///Geting form dropdown list data
  getOffers() {
    const promise = new Promise<void>((resolve, reject) => {
      this.OffersService.getAll("GetAll").subscribe({
        next: (res: any) => {
          if (res.data != null) {
            this.offers = res.data.map((res: Offers[]) => {
              return res;
            });
            if (this.offers.length == 0) {
              this.offers = [];
            }
            resolve();
            //(('offers', this.offers);
          }
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
  //#region CRUD Operations
  edit(id: number) {
    this.router.navigate(['/control-panel/definitions/update-offer', id]);
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



  isListEmpty
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('messages.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        let deletedItem = this.offers.find(x => x.id == id) as OffersListVm ;
        let deletedVendorIndex =  this.offers.indexOf(deletedItem);
        let offersList= this.offers.splice(deletedVendorIndex,1);

        this.OffersService.deleteWithUrl("Delete?id=" + id).subscribe((resonse) => {
          //(('delet response', resonse);
          this.getOffers();
          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform('messages.delete-success')
            );
            if(this.offers.length==0)
            {
              this.isListEmpty=true
            }
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              this.translate.transform('messages.delete-faild')
            );
          }
        });
      }
    });
  }
  //#endregion
}
