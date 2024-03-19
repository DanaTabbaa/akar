import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { BillsService } from 'src/app/core/services/backend-services/bills.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { VMBills } from 'src/app/core/models/ViewModel/vm-bills';
import { BillType } from 'src/app/core/models/bill-type';
import { BillTypeService } from 'src/app/core/services/backend-services/bill-type.service';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Main Declarations
  billsVM: VMBills[] = [];
  billtype: BillType = new BillType();
  typeId: any;
  currnetUrl: any;
  addUrl: string = '/control-panel/accounting/add-bill';
  updateUrl: string = '/control-panel/accounting/update-bill/';
  listUrl: string = '/control-panel/accounting/bill-list';
  toolbarPathData: ToolbarPath = {
    listPath: this.listUrl,
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.bills",
    componentAdd: '',

  };
  //#endregion

  //#region Constructor
  constructor(
    private billService: BillsService,
    private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private store: Store<any>,
    private activatedRoute: ActivatedRoute,
    private billTypeService: BillTypeService

  ) { }


  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: (res) => {
        this.typeId = res["typeId"]
        //this.listenToClickedButton();
        this.getLanguage();
        if (res["typeId"]) {
          this.getBillTypes();
          this.getBills(res["typeId"]);
        }
        localStorage.setItem("typeId", this.typeId)

      }
    })


    // this.addUrl = '/control-panel/accounting/add-bill?typeId='+this.typeId;
    // this.updateUrl= '/control-panel/accounting/update-bill?typeId='+this.typeId;
    // this.listUrl = '/control-panel/accounting/bill-list?typeId='+this.typeId;
    this.toolbarPathData = {
      listPath: this.listUrl,
      updatePath: this.updateUrl,
      addPath: this.addUrl,
      componentList: "menu.bills",
      componentAdd: "",
    };
    this.defineGridColumn();


    // setTimeout(() => {
    //   this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    //   this.sharedServices.changeToolbarPath(this.toolbarPathData);
    // }, 300);

  }

  openBills() { }

  ngAfterViewInit(): void {
    this.listenToClickedButton();
    setTimeout(() => {
      // let typeNameAr = localStorage.getItem("typeNameAr")!;
      // let typeNameEn = localStorage.getItem("typeNameEn")!;
      // this.toolbarPathData.componentList = this.lang == 'ar' ? typeNameAr : typeNameEn
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      // this.sharedServices.changeToolbarPath(this.toolbarPathData);
    }, 300);

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

  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getBillTypes() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.billTypeService.getWithResponse<BillType[]>("GetAll").subscribe({
        next: (res) => {
          if (res.success) {
            ;
            this.billtype = JSON.parse(JSON.stringify(res.data?.find(x => x.id == this.typeId)));
            // localStorage.setItem("typeNameAr", this.billtype.typeNameAr);
            // localStorage.setItem("typeNameEn", this.billtype.typeNameEn);
            this.toolbarPathData.componentList = this.lang == 'ar' ? this.billtype.typeNameAr : this.billtype.typeNameEn
            this.sharedServices.changeToolbarPath(this.toolbarPathData);


          }
          resolve();

        },
        error: (err: any) => {
          resolve();
        },
        complete: () => {

          resolve();
        },
      });

      this.subsList.push(sub);
    });
    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.store.select(BillTypeSelectors.selectors.getListSelector).subscribe({
    //     next: (res: BillTypeModel) => {
    //       resolve();
    //       this.billtype = res.list.find(x => x.id == this.typeId) ?? new BillType();
    //       localStorage.setItem("typeNameAr", this.billtype.typeNameAr);
    //       localStorage.setItem("typeNameEn", this.billtype.typeNameEn);
    //     },
    //     error: (err: any) => {
    //       resolve();
    //     }
    //   })

    //   this.subsList.push(sub);
    // })

  }
  getBills(typeId: any) {
    this.billsVM = [];
    return new Promise<void>((resolve, reject) => {
      let sub = this.billService.getWithResponse<VMBills[]>("GetListByFieldNameVM?fieldName=Bill_Type_Id&fieldValue=" + typeId).subscribe({
        next: (res: ResponseResult<VMBills[]>) => {
          if (res.success) {
            this.billsVM = JSON.parse(JSON.stringify(res.data));
          }
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
  // delete(id: any) {
  //   this.entryTypeService.delete(id).subscribe((resonse) => {
  //     //(('delet response', resonse);
  //     this.getEntryTypes();
  //   });
  // }
  edit(id: string) {
    // this.router.navigate([
    //   '/control-panel/accounting/update-bill',

    // ],{
    //   queryParams:{
    //     "typeId":this.typeId,
    //     "id":id
    //   }
    // });

    this.sharedServices.changeButton({
      action: 'Update',
      componentName: 'List',
      submitMode: false
    } as ToolbarData);

    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.router.navigate([this.updateUrl + id])
  }

  //#endregion

  //#region Helper Functions
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning==alertType) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info==alertType) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error==alertType) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        let sub = this.billService.deleteBillAndRelations(id).subscribe(
          (resonse) => {
            if (this.typeId) {
              this.getBills(this.typeId);
            }
              
            if (resonse.success == true) {
              this.showResponseMessage(
                true,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")

              );
            } else if (resonse.success == false) {
              this.showResponseMessage(
                false,
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
  columnNames: any[] = [];
  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class=' fa fa-trash'></i>";
  };
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [
        {
          title: this.lang == 'ar' ? ' كود ' : 'Code',
          field: 'code',
        },
        {
          title: this.lang == 'ar' ? ' تاريخ الفاتورة ' : 'Bill date',
          field: 'billDate',
        },
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
          }
      ];
    })
  }

  menuOptions: SettingMenuShowOptions = {
    showEdit: true,
    showDelete: true
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'code', type: 'like', value: searchTxt }

      ],
    ];
  }


  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
          submitMode: false
        } as ToolbarData);
        this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.billtype.typeNameAr : 'Update' + ' ' + this.billtype.typeNameEn

        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.router.navigate([this.updateUrl + event.item.id])

      } else if (event.actionName == 'Delete') {
        this.showConfirmDeleteMessage(event.item.id);
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
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {


          } else if (currentBtn.action == ToolbarActions.New) {

            this.router.navigate([this.addUrl], {
              queryParams: {
                "typeId": this.typeId
              }
            });
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
}
