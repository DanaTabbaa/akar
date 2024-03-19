import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from 'src/app/shared/components/modal/modal-component';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { ReportService } from 'src/app/core/services/backend-services/report.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AlertTypes, CalendarTypesEnum, PermissionType, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { Subscription } from 'rxjs'
import { TranslatePipe } from '@ngx-translate/core';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { RentContractVM } from 'src/app/core/models/ViewModel/rent-contract-vm';
import { DatePipe } from '@angular/common';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';

@Component({
  selector: 'app-rent-contracts-list',
  templateUrl: './rent-contracts-list.component.html',
  styleUrls: ['./rent-contracts-list.component.scss']
})
export class RentContractsListComponent implements OnInit, AfterViewInit, OnDestroy {
  settingId: any;

  renew!: boolean;
  rentContracts: RentContractVM[] = [];

  contractSettings: ContractsSettings = new ContractsSettings();
  addUrl: string = '/control-panel/definitions/add-rent-contract';
  updateUrl: string = '/control-panel/definitions/update-rent-contract/';
  listUrl: string = '/control-panel/definitions/rent-contracts-list';
  toolbarPathData: ToolbarPath = {
    listPath: this.listUrl,
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.rent-contracts",
    componentAdd: '',
  };


  constructor(
    private rentContractsService: RentContractsService,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private router: Router,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService,
    private datePipe: DatePipe,
    private dateService: DateCalculation,
    private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.sharedServices.setPermissionsStatus({permissionStatus:PermissionType.Contract});
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

  //#region Permissions




  getRouteData() {
    let sub = this.route.queryParams.subscribe(params => {
      if (params['settingId'] || params['settingid'] ) {        
        this.settingId = params['settingId']?? params['settingid'];
        
        Promise.all([

          this.managerService.loadRentContractsByType(this.settingId)
        ]).then(a => {
          if (this.managerService.getCurrentRole()) {
            let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
            if (perm) {
              this.sharedServices.setContractPermissions(perm);
            }

          }



          let contracts = this.managerService.getRentContractsByType();

          this.rentContracts = [];
          contracts.forEach(c => {
            if (c.calendarType == CalendarTypesEnum.Gregorian) {
              let starDate = this.datePipe.transform(c.startContractDate, "yyyy-MM-dd");
              c.startContractDate = starDate;
              let endDate = this.datePipe.transform(c.endContractDate, "yyyy-MM-dd");
              c.endContractDate = endDate;
            }
            else {
              c.startContractDate = this.datePipe.transform(c.startContractDate, "yyyy-MM-dd");
              c.endContractDate = this.datePipe.transform(c.endContractDate, "yyyy-MM-dd");
              let fromDateHijri = this.dateService.getHiriDate(new Date(c.startContractDate));
              let toDateHijri = this.dateService.getHiriDate(new Date(c.endContractDate));
              c.startContractDate = fromDateHijri.year + "/" + fromDateHijri.month + "/" + fromDateHijri.day;
              c.endContractDate = toDateHijri.year + "/" + toDateHijri.month + "/" + toDateHijri.day;
            }
            this.rentContracts.push({ ...c });
          });
          //this line to refresh tabulator
          this.rentContracts = [...this.rentContracts];

          this.spinner.hide();
          localStorage.setItem("ContractSettingId", this.settingId)
          this.listUrl = '/control-panel/definitions/rent-contracts-list?settingId=' + this.settingId;
          this.addUrl = '/control-panel/definitions/add-rent-contract?settingId=' + this.settingId;
          
          let contractSetting = this.managerService.getContractSettings().find(x => x.id == this.settingId);
         
          if(contractSetting)
          {
            this.setToolbarComponentData(contractSetting);
          }

          

          
          console.log("**************************************", this.rentContracts);
          this.cd.detectChanges();

        }).catch(e => {
           
          this.spinner.hide();
        });


      }
    });

    this.subsList.push(sub);

  }

  setToolbarComponentData(contractSetting:ContractsSettings) {
     
    let contractData = this.lang == "ar" ? (contractSetting?.contractArName??"") : (contractSetting?.contractEnName??"");
    this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + contractData : 'Update' + ' ' + contractData
    this.toolbarPathData.componentList = contractData
    contractData = this.lang == 'ar' ? 'بيانات' + ' ' + contractData : contractData + ' ' + 'data';
    this.sharedServices.changeToolbarPath(this.toolbarPathData);

  }
  //#endregion
  ngAfterViewInit(): void {
  }
  //#region ngOnDestory
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
  deleteContract(id: any) {

    this.spinner.show();
    let sub = this.rentContractsService.deleteWithUrl("DeleteWithCheck?id=" + id).
      subscribe(
        {
          next: (resonse) => {
            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
              this.managerService.loadRentContractsByType(this.settingId).then(a => {
                this.spinner.hide();
                this.rentContracts = this.managerService.getRentContractsByType();
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


  goToAdd() {
    this.router.navigate(['/control-panel/definitions/add-rent-contract'], { queryParams: { settingid: this.settingId } });
  }
  //edit
  edit(id: string, permission: string) {

    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson[permission]) {

            this.router.navigate(['/control-panel/definitions/update-rent-contract'], { queryParams: { settingId: this.settingId, contractId: id } });
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

  contractIssued(id: any) {
    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson["isIssue"]) {

            this.router.navigate(['/control-panel/definitions/update-rent-contract'], {
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

  renewContract(id: any) {



    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson["isRenew"]) {
            this.router.navigate(['/control-panel/definitions/renew-rent-contract', id], { queryParams: { renew: true, settingid: this.settingId } });
            this.sharedServices.changeButton({ action: 'Renew', componentName: "List" } as ToolbarData);
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            return;
          }
        }
      }
    }
    this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"));




  }
  SettlementContract(id: any) {
    if (this.managerService.getCurrentRole()) {
      if (this.managerService.getCurrentRole()?.rolesPermissions) {
        let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
        if (perm) {
          let permJson = JSON.parse(perm.permissionsJson);
          if (permJson["isSettelment"]) {
            this.router.navigate(['/control-panel/definitions/rent-contracts-settlement', id], { queryParams: { settingid: this.settingId } });
            return;
          }
        }
      }
    }
    this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"));



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
            modalRef.componentInstance.reportType = 1;
            modalRef.componentInstance.reportTypeID = 2;
            modalRef.componentInstance.oldUrl = "/control-panel/definitions/rent-contracts-list";
            return;
          }

        }
      }

    }
    this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"));



  }

  cancelDefaultReportStatus() {
    this.reportService.cancelDefaultReport(1, 2).subscribe(resonse => {

    });
  }

  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  columnNames: any[] = [];
  defineGridColumn() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe(res => {
        resolve();
        this.lang = res
        this.columnNames = [
          {
            title: this.lang == 'ar' ? ' المعرف ' : 'Id',
            field: 'id',
          },
          {
            title: this.lang == 'ar' ? ' رقم العقد' : 'Contract Number',
            field: 'code',
          },
          this.lang == 'ar'
            ? { title: 'المالك', field: 'ownerNameAr' }
            : { title: ' Owner  ', field: 'ownerNameEn' },

          this.lang == 'ar'
            ? { title: 'المستأجر', field: 'tenantNameAr' }
            : { title: 'Tenant', field: 'tenantNameEn' },
          this.lang == 'ar'
            ? { title: 'المجموعة العقارية', field: 'realestateNameAr' }
            : { title: 'Realestate Group', field: 'realestateNameEn' },
          this.lang == 'ar'
            ? { title: 'المبنى', field: 'buildingNameAr' }
            : { title: 'Building', field: 'buildingNameEn' },
          {
            title: this.lang == 'ar' ? 'الوحدات' : 'Units',
            field: 'unitsName',
          },
          this.lang == 'ar'
            ? { title: 'الحالة', field: 'statusNameAr' }
            : { title: 'Status', field: 'statusNameEn' },

          {
            title: this.lang == 'ar' ? 'تاريخ بداية العقد' : 'Start contract date',
            field: 'startContractDate',
          },
          {
            title: this.lang == 'ar' ? 'تاريخ نهاية العقد' : 'End contract date',
            field: 'endContractDate',
          },
          {
            title: this.lang == 'ar' ? 'اجمالى قيمة العقد' : 'Contract Value Total',
            field: 'contractValueTotal',
          },

        ];
      }, err => {
        resolve();
      });
      this.subsList.push(sub);
    });

  }

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEditContract: true,
    showPrint: true,
    showIssueContract: true,
    showRenewContract: true,
    showSettlementContract: true,
    showSettlementDisplayContract: true,
    showDisplay: true,


  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'id', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },
        { field: 'buildingNameEn', type: 'like', value: searchTxt },
        { field: 'buildingNameAr', type: 'like', value: searchTxt },
        { field: 'realestateNameAr', type: 'like', value: searchTxt },
        { field: 'realestateNameEn', type: 'like', value: searchTxt },
        { field: 'unitsName', type: 'like', value: searchTxt },

      ],
    ];
  }

  openRentContract() { }

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
      else if (event.actionName == 'RenewContract') {
        this.renewContract(event.item.id);


      }
      else if (event.actionName == 'SettlementContract' || event.actionName == 'SettlementDetailsContract') {

        this.SettlementContract(event.item.id);


      }
      else if (event.actionName == 'Display') {
        this.edit(event.item.id, "isDisplay");
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
             
            let contractArName = localStorage.getItem("contractArName")!;
            let contractEnName = localStorage.getItem("contractEnName")!;
            this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + contractArName : 'Update' + ' ' + contractEnName
            this.toolbarPathData.componentList = this.lang == 'ar' ? contractArName : contractEnName
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate(['/control-panel/definitions/add-rent-contract'], { queryParams: { settingId: this.settingId } });
          }
        }
      },
    });
    this.subsList.push(sub);
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
  //#endregion

}
