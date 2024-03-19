import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
import { Store } from '@ngrx/store';
import { BillTypeService } from 'src/app/core/services/backend-services/bill-type.service';
import { BillType } from 'src/app/core/models/bill-type';
import { BillTypeSelectors } from 'src/app/core/stores/selectors/bill-type.selector';
import { BillTypeModel } from 'src/app/core/stores/store.model.ts/bill-types.store.model';
import { Bills } from 'src/app/core/models/bills';
import { BillsService } from 'src/app/core/services/backend-services/bills.service';
import { BillTypeActions } from 'src/app/core/stores/actions/bill-type.action';
import { reloadPage } from 'src/app/core/helpers/router-helper';

@Component({
  selector: 'app-bill-type-list',
  templateUrl: './bill-type-list.component.html',
  styleUrls: ['./bill-type-list.component.scss']
})
export class BillTypeListComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Main Declarations
  billTypes: BillType[] = [];
  errorMessage = '';
  errorClass = '';
  bills: Bills[] = [];
  currnetUrl: any;
  addUrl: string = '/control-panel/accounting/add-bill-type';
  updateUrl: string = '/control-panel/accounting/update-bill-type/';
  listUrl: string = '/control-panel/accounting/bill-type-list';
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.bill-types',
    componentAdd: '',

  };
  //#endregion

  //#region Constructor
  constructor(
    private billTypeService: BillTypeService,
    private billsService: BillsService,
    private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private store: Store<any>
  ) { }


  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.listenToClickedButton();

    // setTimeout(() => {
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    // }, 300);

    this.getBillTypes();
    this.defineGridColumn();

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
  }
  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions

  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  getBillTypes() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(BillTypeSelectors.selectors.getListSelector).subscribe({
        next: (res: BillTypeModel) => {
          this.billTypes = JSON.parse(JSON.stringify(res.list));
          resolve();

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

  //#endregion

  //#region CRUD Operations

  edit(id: string) {
    this.router.navigate(['/control-panel/accounting/update-bill-type', id]);
    this.sharedServices.changeButton({
      action: 'Update',
      componentName: 'List',
    } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
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

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
       let deletedItem = this.billTypes.find(x => x.id == id) as BillType;
       let deletedBillTypeIndex =  this.billTypes.indexOf(deletedItem);
      let billTypesList= this.billTypes.splice(deletedBillTypeIndex,1);
        let sub = this.billTypeService.deleteWithResponse("Delete?Id=" + id).subscribe(
          (resonse) => {

         //   var deletedItem = this.billTypes.find(x=>x.id==id);
            if (resonse.success == true) {
              // this.store.dispatch(BillTypeActions.actions.delete({
              //   data: JSON.parse(JSON.stringify({ ...deletedItem }))
              // }));
              this.store.dispatch(BillTypeActions.actions.delete({
                data: JSON.parse(JSON.stringify({ ...deletedItem }))
              }));
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              this.getBillTypes();
              setTimeout(() => {
                reloadPage();
              }, 2000);
            } else if (resonse.success == false) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.error,
                this.translate.transform("messages.delete-faild")
              );
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
  editFormatIcon() { //plain text value
    return "<i class='fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class='fa fa-trash'></i>";
  };
  columnNames:any[] = [];
  defineGridColumn()
  {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.columnNames = [
        // {
        //   title: this.lang == 'ar' ? '' : 'Id',
        //   field: 'id',
        // },
        this.lang == 'ar'
        ? { title: ' الاسم', field: 'typeNameAr' }
        : { title: ' Name', field: 'typeNameEn' },

      this.lang == "ar" ? {
        title: "حذف",
        field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
          this.showConfirmDeleteMessage(cell.getRow().getData().id);
        },
      } :
        {
          title: "Delete",
          field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
            this.showConfirmDeleteMessage(cell.getRow().getData().id);
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
  // columnNames = [
  //   { title: ' الاسم', field: 'typeNameAr' },
  //   { title: ' الاسم الانجليزي  ', field: 'typeNameEn' },
  // ];

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openBillTypes() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        ;

        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
        } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {

        new Promise<void>((resolve, reject) => {
          let sub = this.billsService.getWithResponse<Bills>("GetByFieldName?fieldName=Bill_Type_Id&fieldValue=" + event.item.id).subscribe({
            next: (res : any) => {

                //(("result data getbyid", res.data);
                this.bills=res.data
                if (this.bills != null) {

                  this.errorMessage = this.translate.transform('bill-type.bills-added-with-bill-type-no-delete');
                  this.errorClass = this.translate.transform('general.warning');
                  this.alertsService.showWarning(this.errorMessage, this.translate.transform('general.warning'))
                  return
                }
                else {
                  this.showConfirmDeleteMessage(event.item.id);

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

        // this.store.select(BillSelectors.selectors.getListSelector).subscribe({
        //   next: (res: BillModel) => {
        //
        //     //(('data', res);
        //     this.bills = JSON.parse(JSON.stringify(res.list)).filter(x => x.billTypeId == event.item.id);
        //     if (this.bills != null && this.bills.length > 0) {
        //
        //       this.errorMessage = this.translate.transform('bill-type.bills-added-with-bill-type-no-delete');
        //       this.errorClass = this.translate.transform('general.warning');
        //       this.alertsService.showWarning(this.errorMessage, this.translate.transform('general.warning'))
        //       return
        //     }
        //     else {
        //       this.showConfirmDeleteMessage(event.item.id);

        //     }
        //   }
        // })

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
  //#endregion
}

