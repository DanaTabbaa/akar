import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, PermissionType, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
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
import { VouchersService } from 'src/app/core/services/backend-services/vouchers.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { VoucherVm } from 'src/app/core/models/ViewModel/voucher-vm';
import { EntryType } from 'src/app/core/models/entry-type';
import { EntryTypeRolesPermissions } from 'src/app/core/models/entry-type-roles-permissions';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { EntryTypeUsersPermissionsService } from 'src/app/core/services/backend-services/entry-type-users-permissions.service';
import { EntryTypeService } from 'src/app/core/services/backend-services/entry-type.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Main Declarations
  vouchers: VoucherVm[] = [];
  entryType: EntryType = new EntryType();
  typeId: any;
  currnetUrl: any;
  addUrl: string = '/control-panel/accounting/add-voucher';
  updateUrl: string = '/control-panel/accounting/update-voucher/';
  listUrl: string = '/control-panel/accounting/voucher-list';
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: '',
    componentAdd: '',

  };
  //#endregion

  //#region Constructor
  constructor(
    private voucherService: VouchersService,
    private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private store: Store<any>,
    private route: ActivatedRoute,
    private entryTypeUserPermisionsService: EntryTypeUsersPermissionsService,
    private entryTypeService: EntryTypeService,
    private managerService: ManagerService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef

  ) { }


  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.sharedServices.setPermissionsStatus({permissionStatus:PermissionType.Voucher});
    this.spinner.show();
    Promise.all([this.defineGridColumn(),
    this.getLanguage(),
    this.managerService.loadEntryTypes(),
    this.managerService.loadCurrentRoleAndPermission()]).then(a => {
      this.getRouteData();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(e => {
      this.spinner.hide();
    });
  }


  ngAfterViewInit(): void {

  }

  getRouteData() {
    let sub = this.route.queryParams.subscribe({
      next: (params) => {
         
        if (params['typeId'] != null || params['typeid'] != null) {
          this.typeId = params["typeId"];
          Promise.all([
            this.managerService.loadVouchersByTypeId(this.typeId)
          ]).then(a => {

            if (this.managerService.getCurrentRole()) {
              let perm = this.managerService.getCurrentRole()?.entryTypeRolesPermissions.find(x => x.entryTypeId == this.typeId);
              if (perm) {
                this.sharedServices.setEntryTypePermissions(perm);
              }
            }

          

            let vouchers = this.managerService.getVouchersByType();
            vouchers.forEach(v => {
              v.docDate = this.datePipe.transform(v.docDate, "yyyy-MM-dd");
            });

            this.spinner.hide();
            localStorage.setItem("VoucherTypeId", this.typeId)
            this.listUrl = '/control-panel/accounting/voucher-list?typeId=' + this.typeId;
            this.addUrl = '/control-panel/accounting/add-voucher?typeId=' + this.typeId;
            let entryType = this.managerService.getEntryTypes().find(x => x.id == this.typeId);
            if (entryType) {
              this.toolbarPathData.componentList = this.lang == 'ar' ? entryType.entryNameAr : entryType.entryNameEn;
              this.sharedServices.changeToolbarPath(this.toolbarPathData);
            }

            // this.toolbarPathData = {
            //   listPath: this.listUrl,
            //   addPath: '',
            //   updatePath: '',
            //   componentList: 'menu.rent-contracts',
            //   componentAdd: '',

            // };
            this.vouchers = [...vouchers??[]];
            console.log("**************************************", this.vouchers);
            this.cd.detectChanges();
          }).catch(e => {
            this.spinner.hide();
          });
        }
      }
    });
    this.subsList.push(sub);
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
    this.sharedServices.setPermissionsStatus({permissionStatus:PermissionType.Pages});
  }
  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
  // pagePermission!: EntryTypeRolesPermissions;
  // userPermissions!: UserPermission;
  // getPagePermissions() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.entryTypeUserPermisionsService.getAll("GetEntryTypeRolesPermissionsOfCurrentUser").subscribe({
  //       next: (res: any) => {
  //         ;
  //         console.log("getPagePermissions res", res)
  //         let permissions: EntryTypeRolesPermissions[] = JSON.parse(JSON.stringify(res.data));
  //         this.pagePermission = permissions.find(x => x.entryTypeId == Number(this.typeId))!
  //         this.userPermissions = JSON.parse(this.pagePermission?.permissionsJson);
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
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe(res => {
        resolve();
        this.lang = res
      }, err => {
        resolve();
      });

      this.subsList.push(sub);
    })

  }
  // getEntryTypes() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.entryTypeService.getWithResponse<EntryType[]>("GetAll").subscribe({
  //       next: (res) => {
  //         if (res.success) {
  //           this.entryType = JSON.parse(JSON.stringify(res.data?.find(x => x.id == this.typeId)));
  //           console.log("this.entryType", this.entryType)

  //           this.toolbarPathData.componentList = this.lang == 'ar' ? this.entryType.entryNameAr : this.entryType.entryNameEn;
  //           //  this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.entryType.entryNameAr : 'Update' + ' ' + this.entryType.entryNameEn
  //           this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //         }


  //         resolve();

  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {

  //         resolve();
  //       },
  //     });

  //     this.subsList.push(sub);
  //   });

  // }


  //#endregion

  //#region CRUD Operations
  // delete(id: any) {
  //   this.entryTypeService.delete(id).subscribe((resonse) => {
  //     //(('delet response', resonse);
  //     this.getEntryTypes();
  //   });
  // }
  edit(id: string) {    
    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.entryTypeRolesPermissions.find(x => x.entryTypeId == this.typeId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson['isUpdate']) {

            this.router.navigate(['/control-panel/accounting/update-voucher'], { queryParams: { typeId: this.typeId, voucherId: id } });
            this.sharedServices.changeButton({
              action: 'Update',
              componentName: 'List',
              submitMode: false
            } as ToolbarData);

            this.sharedServices.changeToolbarPath(this.toolbarPathData);

            return;
          }
        }
      }
    }
    this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"));

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
  isListEmpty: boolean = false;
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {

        this.deleteVoucher(id);       
      }
    });
  }

  deleteVoucher(id:any)
  {
    return new Promise<void>((resolve,reject)=>{
      this.spinner.show();
      let sub = this.voucherService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe(
        {
          next: (resonse) => {
          
            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              this.managerService.loadVouchersByTypeId(this.typeId).then(a => {
                this.spinner.hide();
                this.vouchers = this.managerService.getVouchersByType();
                               
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
            } else {
              this.spinner.hide();
              this.showResponseMessage(resonse.success, AlertTypes.error, this.translate.transform("messages.delete-faild") + resonse.message)
            }
          }, error: (err) => {
            this.spinner.hide();
          }
        });
      this.subsList.push(sub); 
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
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe(
        {
          next: (res) => {
            resolve();
            this.lang = res
            this.columnNames = [
              {
                title: this.lang == 'ar' ? ' كود' : 'Code',
                field: 'code',
              },
              {
                title: this.lang == 'ar' ? ' التاريخ' : 'Date',
                field: 'docDate',
              },
              // this.lang == 'ar'
              //   ? { title: 'المالك', field: 'ownerNameAr' }
              //   : { title: 'Owner', field: 'ownerNameEn' },
              // this.lang == 'ar'
              //   ? { title: 'المستأجر', field: 'tenantNameAr' }
              //   : { title: 'Tenant', field: 'tenantNameEn' },
              {
                title: this.lang == 'ar' ? 'المبلغ' : 'Amount',
                field: 'amount',
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
                },
            ];
          },
          error: (err) => {
            resolve();
          },
          complete: () => {
            resolve();
          }
        });
      this.subsList.push(sub);
    });

  }
  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  deleteFormatIcon() { //plain text value
    return "<i class=' fa fa-trash'></i>";
  };


  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'code', type: 'like', value: searchTxt },        
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        { field: 'amount', type: 'like', value: searchTxt },

        ,
      ],
    ];
  }

  openVouchers() { }



  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        // this.sharedServices.changeButton({
        //   action: 'Update',
        //   componentName: 'List',
        //   submitMode: false
        // } as ToolbarData);
        // this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.entryType.entryNameAr : 'Update' + ' ' + this.entryType.entryNameEn
        // this.sharedServices.changeToolbarPath(this.toolbarPathData);
        // this.router.navigate(['control-panel/accounting/update-voucher/' + event.item.id+'/'+this.typeId])

      } else if (event.actionName == 'Delete') {
        this.showConfirmDeleteMessage(event.item.id);
      }
    }
  }

  //#endregion

  setToolbarComponentData() {
    let entryTypeAr = localStorage.getItem("entryNameAr")!;
    let entryTypeEn = localStorage.getItem("entryNameEn")!;
    this.toolbarPathData.componentList = this.lang == 'ar' ? entryTypeAr : entryTypeEn;
    //  this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + entryTypeAr : 'Update' + ' ' + entryTypeEn
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }

  //#region Toolbar Service
  // currentBtn!: string;
  // subsList: Subscription[] = [];
  // listenToClickedButton() {
  //   let sub = this.sharedServices.getClickedbutton().subscribe({
  //     next: (currentBtn: ToolbarData) => {
  //       if (currentBtn != null) {
  //         if (currentBtn.action == ToolbarActions.List) {
  //           this.setToolbarComponentData();
  //         } else if (currentBtn.action == ToolbarActions.New) {
  //           this.setToolbarComponentData();

  //           this.router.navigate([this.addUrl], {
  //             queryParams: {
  //               "typeId": this.typeId
  //             }
  //           });
  //         }
  //       }
  //     },
  //   });
  //   this.subsList.push(sub);
  // }

  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {

          } else if (currentBtn.action == ToolbarActions.New) {
             
            
            let entryNameAr = localStorage.getItem("entryNameAr")!;
            let entryNameEn = localStorage.getItem("entryNameEn")!;
            this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + entryNameAr : 'Update' + ' ' + entryNameAr
            this.toolbarPathData.componentList = this.lang == 'ar' ? entryNameEn : entryNameEn
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate(['/control-panel/accounting/add-voucher'], { queryParams: { typeId: this.typeId } });
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
}
