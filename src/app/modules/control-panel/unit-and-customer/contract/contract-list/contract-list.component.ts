import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertTypes, CalendarTypesEnum, PermissionType, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { SalesBuyContractVm } from 'src/app/core/models/ViewModel/sales-buy-contract-vm';
import { ContractsSettingsService } from 'src/app/core/services/backend-services/contracts-settings.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { SalesBuyContractsService } from 'src/app/core/services/backend-services/sales-contracts.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { NgbdModalContent } from 'src/app/shared/components/modal/modal-component';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
})
export class ContractListComponent implements OnInit, OnDestroy, AfterViewInit {
  addUrl: string = '/control-panel/definitions/add-contract';
  updateUrl: string = '/control-panel/definitions/update-contract/';
  listUrl: string = '/control-panel/definitions/contracts-list';
  //contracts: SalesBuyContractVm[] = [];
  contractSettings: ContractsSettings = new ContractsSettings();

  direction: string = 'ltr';
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  columnNames: any[] = [];
  settingId: any;
  typeId: any;
  isListEmpty;
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-contracts',
    componentAdd: '',
  };

  salesBuyContracts: SalesBuyContractVm[] = [];

  constructor(
    private router: Router,
    private sharedServices: SharedService,
    private route: ActivatedRoute,    
    private contractSettingService: ContractsSettingsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private alertsService: NotificationsAlertsService,
    private managerService: ManagerService,
    private datePipe: DatePipe,
    private dateService: DateCalculation,
    private cd: ChangeDetectorRef,
    private salesBuyContractService:SalesBuyContractsService
  ) { }



  ngOnInit(): void {
    this.sharedServices.setPermissionsStatus({ permissionStatus: PermissionType.Contract });
    this.spinner.show();
    Promise.all([
      this.defineGridColumn(),
      this.getLanguage(),
      this.managerService.loadContractSettings(),
      this.managerService.loadCurrentRoleAndPermission(),
    ]).then(a => {
      this.getRouteData();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(e => {
      this.spinner.hide();
    });
  }


  getRouteData() {
    let sub = this.route.queryParams.subscribe(params => {
      if (params['settingId'] || params['settingid']) {
        this.settingId = params['settingId'] ?? params['settingid'];

        Promise.all([

          this.managerService.loadSalesPurchaseContractsByType(this.settingId)
        ]).then(a => {
          if (this.managerService.getCurrentRole()) {
            let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
            if (perm) {
              this.sharedServices.setContractPermissions(perm);
            }
          }
          let contracts = this.managerService.getSalesPurchaseContractsByType();
          this.salesBuyContracts = [];
          contracts.forEach(c => {
            if (c.calendarType == CalendarTypesEnum.Gregorian) {
              let starDate = this.datePipe.transform(c.contractDate, "yyyy-MM-dd");
              c.contractDate = starDate;
              
            }
            else {
              c.contractDate = this.datePipe.transform(c.contractDate, "yyyy-MM-dd");              
              let contractDateHijri = this.dateService.getHiriDate(new Date(c.contractDate));              
              c.contractDate = contractDateHijri.year + "/" + contractDateHijri.month + "/" + contractDateHijri.day;              
            }
            this.salesBuyContracts.push({ ...c });
          });
          //this line to refresh tabulator
          this.salesBuyContracts = [...this.salesBuyContracts];

          this.spinner.hide();
          localStorage.setItem("ContractSettingId", this.settingId)
          this.listUrl = '/control-panel/definitions/contracts-list?settingId=' + this.settingId;
          this.addUrl = '/control-panel/definitions/add-contract?settingId=' + this.settingId;
           
          let contractSetting = this.managerService.getContractSettings().find(x => x.id == this.settingId);          
          if (contractSetting) {
            this.setToolbarComponentData(contractSetting);
          }
          this.cd.detectChanges();
        }).catch(e => {
           
          this.spinner.hide();
        });
      }
    });
    this.subsList.push(sub);
  }
  ngAfterViewInit(): void {    
  }
  
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    this.managerService.destroy();
  }
  //#endregion
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe((res) => {
        resolve();
        this.lang = res;
      });

    });
  }
  
  getContractSettings() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.contractSettingService.getAll('GetAll').subscribe({
        next: (res) => {
          if (res.success) {
            this.contractSettings = JSON.parse(
              JSON.stringify(
                res.data.find(
                  (x) =>
                    x.id == this.settingId && x.contractTypeId == this.typeId
                )
              )
            );
         
            this.toolbarPathData.componentList =
              this.lang == 'ar'
                ? this.contractSettings.contractArName
                : this.contractSettings.contractEnName;
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
          }
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
      this.subsList.push(sub);
    });    
  }

  
  openAddNewContract() { }

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameAr', type: 'like', value: searchTxt },
        { field: 'purchaserNameEn', type: 'like', value: searchTxt },
        { field: 'buildingNameAr', type: 'like', value: searchTxt },
        { field: 'buildingNameEn', type: 'like', value: searchTxt },
      ],
    ];
  }

  setToolbarComponentData(contractSetting: ContractsSettings) {
    
    let contractData = this.lang == "ar" ? (contractSetting?.contractArName ?? "") : (contractSetting?.contractEnName ?? "");
    this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + contractData : 'Update' + ' ' + contractData
    this.toolbarPathData.componentList = contractData
    contractData = this.lang == 'ar' ? 'بيانات' + ' ' + contractData : contractData + ' ' + 'data';
    this.sharedServices.changeToolbarPath(this.toolbarPathData);

  }
 
  currentBtn!: string;
  subsList: Subscription[] = [];
 
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {

          } else if (currentBtn.action == ToolbarActions.New) {
             
            let contractArName = localStorage.getItem("contractArName")!;
            let contractEnName = localStorage.getItem("contractEnName")!;
            this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + contractArName : 'Update' + ' ' + contractEnName
            this.toolbarPathData.componentList = this.lang == 'ar' ? contractArName : contractEnName
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate(['/control-panel/definitions/add-contract'], { queryParams: { settingId: this.settingId } });
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEditContract: true,
    showIssueContract: true,
    showDisplay: true
  };
  // onMenuActionSelected(event: ITabulatorActionsSelected) {
  //   if (event != null) {

  //     if (event.actionName == 'EditContract') {
  //       this.edit(event.item.id);
  //       this.sharedServices.changeButton({
  //         action: 'Update',
  //         componentName: 'List',
  //         submitMode: false
  //       } as ToolbarData);

  //       this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //       this.router.navigate(['control-panel/definitions/update-contract/' + event.item.id])

  //     } else if (event.actionName == 'Delete') {
  //       this.showConfirmDeleteMessage(event.item.id);
  //     }
  //     else if (event.actionName == 'IssueContract') {
  //       this.contractissued(event.item.id)

  //     }
  //     else if (event.actionName == 'Display') {
  //       this.edit(event.item.id);
  //       this.sharedServices.changeButton({
  //         action: 'Index',
  //         componentName: 'List',
  //         submitMode: false
  //       } as ToolbarData);

  //       this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //       this.router.navigate(['control-panel/definitions/update-contract/' + event.item.id])
  //     }

  //   }
  // }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'EditContract') {
        
        this.edit(event.item.id, "isUpdate");


      } else if (event.actionName == 'Delete') {

        this.showConfirmDeleteMessage(event.item.id);


      }
      else if (event.actionName == 'Print') {

        this.gotoViewer(event.item.id);

      }
      else if (event.actionName == 'IssueContract') {

        this.contractIssued(event.item.id);




      }
      
      // else if (event.actionName == 'SettlementContract' || event.actionName == 'SettlementDetailsContract') {

      //   this.SettlementContract(event.item.id);


      // }
      else if (event.actionName == 'Display') {
        this.edit(event.item.id, "isDisplay");
      }

    }
  }

  gotoViewer(id: any) {
    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson["isPrint"]) {


            let reportParams: string =
              "reportParameter=contractId!" + id;
            const modalRef = this.modalService.open(NgbdModalContent);
            modalRef.componentInstance.reportParams = reportParams;
            modalRef.componentInstance.reportType = 2;
            modalRef.componentInstance.reportTypeID = 2;
            modalRef.componentInstance.oldUrl = "/control-panel/definitions/contracts-list";
            return;
          }

        }
      }

    }
    this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"));



  }

  contractIssued(id: any) {
    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson["isIssue"]) {

            this.router.navigate(['/control-panel/definitions/update-contract'], {
              queryParams:{
                 settingId: this.settingId,
                 contractId: id,
                 issue:1
              }
            });
            this.sharedServices.changeButton({ action: 'Issue', componentName: "List" } as ToolbarData);
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            return;
          }

        }
      }

    }
    this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"));
  }
  // contractissued(id: any) {
  //   this.router.navigate(['/control-panel/definitions/update-contract', id]);
  //   this.sharedServices.changeButton({ action: 'Issue', componentName: "List" } as ToolbarData);
  //   this.sharedServices.changeToolbarPath(this.toolbarPathData);
  // }
  // showConfirmDeleteMessage(id: any) {
  //   const modalRef = this.modalService.open(MessageModalComponent);
  //   modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
  //   modalRef.componentInstance.title = this.translate.transform("messages.delete");
  //   modalRef.componentInstance.isYesNo = true;
  //   modalRef.result.then(rs => {
  //     if (rs == "Confirm") {
  //       this.deleteContract(id);
  //     }
  //   })

  // }


  showConfirmDeleteMessage(id: any) {

    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson["isDelete"]) {
            const modalRef = this.modalService.open(MessageModalComponent);
            modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
            modalRef.componentInstance.title = this.translate.transform("messages.delete");
            modalRef.componentInstance.isYesNo = true;
            modalRef.result.then(rs => {
              if (rs == "Confirm") {
                this.deleteContract(id);
              }
            })

            return;
          }
        }
      }
    }
    this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"));


  }


  deleteContract(id: any) {

    this.spinner.show();
    let sub = this.salesBuyContractService.deleteWithUrl("DeleteWithCheck?id=" + id).
      subscribe(
        {
          next: (resonse) => {
            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              this.managerService.loadSalesPurchaseContractsByType(this.settingId).then(a => {
                this.spinner.hide();
                this.salesBuyContracts = this.managerService.getSalesPurchaseContractsByType();
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
  }
  // deleteContract(id: any) {
  //   let parentType
  //   if (this.typeId == 2) {
  //     parentType = 3
  //   }
  //   if (this.typeId == 3) {
  //     parentType = 4
  //   }
  //   let sub = this.contractService.deleteWithUrl("deleteContractAndRelations?id=" + id + "&parentType=" + parentType).subscribe(
  //     (resonse) => {

  //       let deletedItem = this.salesBuyContracts.find(x => x.id == id) as SalesBuyContractVm;
  //       let deletedContractIndex = this.salesBuyContracts.indexOf(deletedItem);
  //       this.salesBuyContracts.splice(deletedContractIndex, 1);
  //       //this.getAllVM();
  //       if (resonse.success == true) {
  //         this.showResponseMessage(
  //           resonse.success,
  //           AlertTypes.success,
  //           this.translate.transform("messages.delete-success")
  //         );

  //         if (this.salesBuyContracts.length == 0) {
  //           this.isListEmpty = true
  //         }
  //       } else if (resonse.success == false) {
  //         this.showResponseMessage(
  //           resonse.success,
  //           AlertTypes.error,
  //           this.translate.transform("messages.delete-faild")
  //         );
  //       }
  //     });
  //   this.subsList.push(sub);
  // }

  defineGridColumn() {
    let sub = this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
      this.columnNames = [
        // {
        //   title: this.lang == 'ar' ? 'رقم' : 'Id',
        //   field: 'id',
        // },
        {
          title: this.lang == 'ar' ? 'رقم العقد' : 'Contract Number',
          field: 'code',
        },
        this.lang == 'ar'
          ? { title: 'أسم المالك', field: 'ownerNameAr' }
          : { title: 'Owner name  ', field: 'ownerNameEn' },
        this.lang == 'ar'
          ? { title: 'أسم المشترى', field: 'purchaserNameAr' }
          : { title: 'Purchaser name  ', field: 'purchaserNameEn' },
        
        {
          title: this.lang == 'ar' ? 'تاريخ العقد' : 'Contract date',
          field: 'contractDate',
        },

        this.lang == 'ar'
          ? { title: 'حالة العقد', field: 'contractStatusNameAr' }
          : { title: 'Contract Status', field: 'contractStatusNameEn' },
        this.lang == 'ar'
          ? { title: 'أسم المبنى', field: 'buildingNameAr' }
          : { title: 'Building name  ', field: 'buildingNameEn' },
        {
          title: this.lang == 'ar' ? 'الوحدات' : 'Units',
          field: 'unitsName',
        },

        {
          title: this.lang == 'ar' ? 'اجمالى المساحة' : 'Total Area',
          field: 'totalArea',
        },
        {
          title: this.lang == 'ar' ? 'الاجمالى بعد الضريبة' : 'Total With Tax',
          field: 'totalWithTax',
        },
        // this.lang == 'ar'
        //   ? {
        //     title: 'حذف',
        //     field: '',
        //     formatter: this.deleteFormatIcon,
        //     cellClick: (e, cell) => {
        //       this.showConfirmDeleteMessage(cell.getRow().getData().id);
        //     },
        //   }
        //   : {
        //     title: 'Delete',
        //     field: '',
        //     formatter: this.deleteFormatIcon,
        //     cellClick: (e, cell) => {
        //       this.showConfirmDeleteMessage(cell.getRow().getData().id);
        //     },
        //   },
        // this.lang == 'ar'
        //   ? {
        //     title: 'تعديل',
        //     field: '',
        //     formatter: this.editFormatIcon,
        //     cellClick: (e, cell) => {
        //       this.edit(cell.getRow().getData().id);
        //     },
        //   }
        //   : {
        //     title: 'Edit',
        //     field: '',
        //     formatter: this.editFormatIcon,
        //     cellClick: (e, cell) => {
        //       this.edit(cell.getRow().getData().id);
        //     },
        //   },
      ];
    });

    this.subsList.push(sub);
  }
  // edit(id: string) {
  //   this.router.navigate(['/control-panel/definitions/update-contract', id], { queryParams: { settingId: this.settingId } });
  //   this.sharedServices.changeButton({ action: 'Update', componentName: "List" } as ToolbarData);
  //   this.sharedServices.changeToolbarPath(this.toolbarPathData);
  // }

  edit(id: string, permission: string) {

    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson[permission]) {

            this.router.navigate(['/control-panel/definitions/update-contract'], { queryParams: { settingId: this.settingId, contractId: id } });
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

    // this.sharedServices.changeButton({ action: 'Update', componentName: "List" } as ToolbarData);
    // this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  editFormatIcon() {
    //plain text value
    return "<i class=' fa fa-edit'></i>";
  }
  deleteFormatIcon() {
    //plain text value
    return "<i class=' fa fa-trash'></i>";
  }
  CheckBoxFormatIcon() {
    //plain text value
    return "<input id='yourID' type='checkbox' />";
  }
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
  //#endregion


}
