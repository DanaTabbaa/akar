import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Realestate } from 'src/app/core/models/realestates';
import { RealestateVM } from 'src/app/core/models/ViewModel/realestates-vm';
import { RealestatesService } from 'src/app/core/services/backend-services/realestates.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RealestateActions } from 'src/app/core/stores/actions/realestate.actions';
import { Store } from '@ngrx/store';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 5; // from pages table in database seeding table
@Component({
  selector: 'app-real-estate-groups-list',
  templateUrl: './real-estate-groups-list.component.html',
  styleUrls: ['./real-estate-groups-list.component.scss']
})
export class RealEstateGroupsListComponent implements OnInit, OnDestroy {
  _search: any;
  realestates: Realestate[] = [];
  addUrl: string = '/control-panel/definitions/add-real-estate-group';
  updateUrl: string = '/control-panel/definitions/update-real-estate-group/';
  listUrl: string = '/control-panel/definitions/real-estate-groups-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: this.listUrl,
    addPath: '',
    updatePath: this.updateUrl,
    componentList: "component-names.list-realestates",
    componentAdd: '',
  };
  realestateSearchForm!: FormGroup;
  constructor(private realestatesService: RealestatesService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private managerService: ManagerService

  ) {
    this.realestateSearchForm = this.fb.group({
      _search: ''
    }
    )
  }

  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    this.managerService.destroy();
  }

  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID), this.managerService.loadRealestate()]).then(a => {
      this.realestates = this.managerService.getRealestates();
      this.spinner.hide();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(err => {
      this.spinner.hide();
    });



  }

  
  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
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
        // var deletedItem = this.realestates.find(x => x.id == id);
        let sub = this.realestatesService.deleteWithUrl("DeleteWithCheck?Id=" + id).subscribe(
          (resonse: ResponseResultNoraml) => {
            if (resonse.success) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );

              this.managerService.loadRealestate().then(a => {
                this.realestates = this.managerService.getRealestates();
                this.spinner.hide();
              }).catch(e => {
                this.spinner.hide();
              });

             
            }
            else if (resonse.success == false && resonse.isUsed == false) {
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

  //navigatetoupdate
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/definitions/update-real-estate-group', id]);
  }

  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }

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

  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.columnNames = [
        {
          title: this.lang == 'ar' ? ' عدد الوحدات' : ' Realestate Number ',
          field: 'realestateNumber',
        },
        this.lang == 'ar'
          ? { title: ' المجموعة العقارية ', field: 'realestateNameAr' }
          : { title: ' Realestate  ', field: 'realestateNameEn' },
        {
          title: this.lang == 'ar' ? ' الايجار السنوي' : ' Annual Rent ',
          field: 'annualRent',
        },
        {
          title: this.lang == 'ar' ? ' سعر العرض' : ' Offer Price',
          field: 'offerPrice',
        },
        {
          title: this.lang == 'ar' ? ' قيمة التأمين ' : ' Insurance Value ',
          field: 'insuranceValue',
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
  columnNames: any[] = [];

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'realestateNameAr', type: 'like', value: searchTxt },
        { field: 'realestateNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }


  openAddRealestate() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update', componentName: "List" } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.showConfirmDeleteMessage(event.item.id);
      }
    }
  }

  //#endregion

}
