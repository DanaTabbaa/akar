import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, EntryTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { EntryTypeService } from 'src/app/core/services/backend-services/entry-type.service';
import { Voucher } from 'src/app/core/models/voucher';
import { VouchersService } from 'src/app/core/services/backend-services/vouchers.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { EntryType } from 'src/app/core/models/entry-type';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 17; // from pages table in database seeding table
@Component({
  selector: 'app-entry-type-list',
  templateUrl: './entry-type-list.component.html',
  styleUrls: ['./entry-type-list.component.scss']
})
export class EntryTypeListComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Main Declarations
  entryTypes: EntryType[] = [];
  currnetUrl: any;
  voucher: Voucher[] = [];
  errorMessage = '';
  errorClass = '';
  addUrl: string = '/control-panel/accounting/add-entry-type';
  updateUrl: string = '/control-panel/accounting/update-entry-type/';
  listUrl: string = '/control-panel/accounting/entry-type-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.entry-types",
    componentAdd: '',

  };
  //#endregion

  //#region Constructor
  constructor(
    private entryTypeService: EntryTypeService,
    private vouchersService: VouchersService,
    private router: Router,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    //private store: Store<any>,
    private managerService: ManagerService,
    private spinner: NgxSpinnerService
  ) { }


  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadEntryTypes()
    ]).then(a => {
      this.spinner.hide();
      this.entryTypes = this.managerService.getEntryTypes();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(e => {
      this.spinner.hide();
    });



  }

  ngAfterViewInit(): void {
  }


  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }



  delete(id: any) {
    if (this.managerService.getUserPermissions().isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }

  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate([
      '/control-panel/accounting/update-entry-type',
      id,
    ]);
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
  isListEmpty: boolean = false;
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        let sub = this.entryTypeService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe(
          {
            next:(resonse:ResponseResultNoraml) => {
              if (resonse.success == true) {
                this.managerService.loadEntryTypes().then(a => {
                  this.spinner.hide();
                  this.entryTypes = this.managerService.getEntryTypes();              
                }).catch(e => {
                  this.spinner.hide();
                });
                this.showResponseMessage(resonse.success, AlertTypes.success, this.translate.transform("messages.delete-success"))
              } else if (resonse.success == false && !resonse.isUsed) {
                this.spinner.hide();
                let message = this.translate.transform("messages.delete-faild");
                this.showResponseMessage(resonse.success, AlertTypes.error, message);
              }
              else if (resonse.isUsed) {
                this.spinner.hide();
                let message = this.translate.transform("messages.delete-faild") + resonse.message;
                this.showResponseMessage(resonse.success, AlertTypes.error, message);
              }
              else
              {
                this.spinner.hide();
                let message = this.translate.transform("messages.delete-faild") + resonse.message;
                this.showResponseMessage(resonse.success, AlertTypes.error, message);
              }
    
    
            },error:(err)=>{
              this.spinner.hide();
            }
          });
        this.subsList.push(sub);
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
    let sub = this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [
        { title: this.lang == 'ar' ? 'الاسم' : 'Name', field: 'entryNameAr' },
        { title: this.lang == 'ar' ? ' الاسم الانجليزي  ' : 'Name in latin', field: 'entryNameEn' },

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
  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'entryNameAr', type: 'like', value: searchTxt },
        { field: 'entryNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openEntryTypes() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
          submitMode: false
        } as ToolbarData);

        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.router.navigate(['control-panel/accounting/update-entry-type/' + event.item.id])

      }
      else if (event.actionName == 'Delete') {
        new Promise<void>((resolve, reject) => {
          let sub = this.vouchersService.getWithResponse<Voucher>("GetByFieldName?fieldName=Type_Id&fieldValue=" + event.item.id).subscribe({
            next: (res: any) => {
              this.voucher = res.data
              if (this.voucher != null) {

                this.errorMessage = this.translate.transform('entry-type.vouchers-added-with-entry-type-no-delete');
                this.errorClass = this.translate.transform('general.warning');
                this.alertsService.showWarning(this.errorMessage, this.translate.transform('general.warning'))
                return
              }
              else {
                this.delete(event.item.id);

              }


            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {

            },
          });
          this.subsList.push(sub);
        });        
      }
    }
  }
  
  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {

        //currentBtn;
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
 
}
