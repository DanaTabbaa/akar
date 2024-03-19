import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MaintenanceContractsService } from 'src/app/core/services/backend-services/maintenance-contracts.service';
import { VwMaintenancecontracts } from 'src/app/core/models/ViewModel/vw_maintenance-contracts';
import { MaintenanceContracts } from 'src/app/core/models/maintenance-contracts';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { Store } from '@ngrx/store';
import { ContractSettingSelectors } from 'src/app/core/stores/selectors/contract-setting.selectors';
import { ContractSettingModel } from 'src/app/core/stores/store.model.ts/contract-setting.store.model';
import { ContractSettingsRolePermissions } from 'src/app/core/models/contract-settings-role-permissions';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ContractSettingsUsersPermissionsService } from 'src/app/core/services/backend-services/contract-settings-users-permissions.service';

@Component({
  selector: 'app-maintenance-contracts-list',
  templateUrl: './maintenance-contracts-list.component.html',
  styleUrls: ['./maintenance-contracts-list.component.scss']
})
export class MaintenanceContractsListComponent implements OnInit  , OnDestroy, AfterViewInit {

  //#region Main Declarations
  maintenanceContracts: MaintenanceContracts[] = [];
  contractSettings: ContractsSettings = new ContractsSettings();
  currnetUrl: any;
  queryParams: any;
  settingId:any;
  addUrl: string = '/control-panel/maintenance/add-maintenance-contract';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-contract/';
  listUrl: string = '/control-panel/maintenance/maintenance-contracts-list';
  toolbarPathData: ToolbarPath = {
    listPath: this.listUrl,
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"menu.maintenance-contracts",
     componentAdd: '',

  };
  //#endregion

  //#region Constructor
  constructor(
    private maintenanceContractsService: MaintenanceContractsService,
    private router: Router,private route: ActivatedRoute,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private contractSettingsUserPermisionsService:ContractSettingsUsersPermissionsService,
    private store: Store<any>

  ) { }


  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getPagePermissions();
    this.queryParams = this.route.queryParams.subscribe(params => {

      if (params['settingid'] != null) {
        this.settingId = params['settingid'];
        localStorage.setItem("maintenanceContractSettingId",params["settingid"]);

      }
      // else
      // {
      //   this.settingId = localStorage.getItem("maintenanceContractSettingId")


      // }
      this.getMaintenanceContracts();


    })

    this.addUrl = '/control-panel/maintenance/add-maintenance-contract?settingid='+this.settingId;
    this.updateUrl= '/control-panel/maintenance/update-maintenance-contract?settingid='+this.settingId;
    this.listUrl = '/control-panel/maintenance/maintenance-contracts-list?settingid='+this.settingId;
    this.toolbarPathData = {
      listPath: this.listUrl,
      updatePath: this.updateUrl,
      addPath: this.addUrl,
      componentList: "menu.maintenance-contracts",
      componentAdd: "",
    };
    this.defineGridColumn();

  }

  ngAfterViewInit(): void {
    this.listenToClickedButton();
    this.getLanguage();
    this.getContractSettings();
    setTimeout(()=>{
      //this.toolbarPathData.componentList = this.lang == 'ar' ? this.contractSettings.contractArName : this.contractSettings.contractEnName
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
   pagePermission!: ContractSettingsRolePermissions;
   userPermissions!: UserPermission;
   getPagePermissions() {
     const promise = new Promise<void>((resolve, reject) => {
       this.contractSettingsUserPermisionsService.getAll("GetContractSettingsUsersPermissionsOfCurrentUser").subscribe({
         next: (res: any) => {
           let permissions: ContractSettingsRolePermissions[] = JSON.parse(JSON.stringify(res.data));
           this.pagePermission = permissions.find(x => x.contractSettingId == Number(this.settingId))!
           this.userPermissions = JSON.parse(this.pagePermission?.permissionsJson);
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

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data

  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getContractSettings() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(ContractSettingSelectors.selectors.getListSelector).subscribe({
        next: (res: ContractSettingModel) => {
          resolve();
          this.contractSettings = res.list.find(x => x.id == this.settingId) ?? new ContractsSettings();

        this.toolbarPathData.componentList =
          this.lang == 'ar'
            ? this.contractSettings.contractArName
            : this.contractSettings.contractEnName;
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
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



  }
  getMaintenanceContracts() {
    this.maintenanceContracts =[];
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceContractsService.getWithResponse<VwMaintenancecontracts[]>("GetAllVM").subscribe({
        next: (res) => {
          if(res.success)
          {
            this.maintenanceContracts = JSON.parse(JSON.stringify(res.data)).filter(x=>x.maintenanceContractSettingId==this.settingId);
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
  delete(id: any) {
    this.maintenanceContractsService.deleteWithUrl("deleteMaintenanceContractAndRelation?id="+id).subscribe((resonse) => {
      this.getMaintenanceContracts();
    });
  }
  edit(id: string) {
    this.router.navigate([
      '/control-panel/maintenance/update-maintenance-contract',
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
  openMaintenanceContracts() {}
  isListEmpty
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {

        let sub = this.maintenanceContractsService.deleteWithUrl("deleteMaintenanceContractAndRelation?id="+id).subscribe(
          (resonse) => {

          let deletedItem = this.maintenanceContracts.find(x => x.id == id) as MaintenanceContracts ;
          let deletedVendorIndex =  this.maintenanceContracts.indexOf(deletedItem);
           let offersList= this.maintenanceContracts.splice(deletedVendorIndex,1);
          this.getMaintenanceContracts();
          if (resonse.success == true) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
             this.translate.transform("messages.delete-success")
            );

            if(this.maintenanceContracts.length==0)
            {
              this.isListEmpty=true
            }
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
  contractissued(id: any) {
    this.router.navigate(['/control-panel/maintenance/update-maintenance-contract', id]);
    this.sharedServices.changeButton({ action: 'Issue',componentName:"List" } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //#endregion


  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  columnNames:any[] = [];
  defineGridColumn()
  {
    this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [

        {
          title: this.lang == 'ar' ? 'رقم العقد' : 'Contract Number',
          field: 'contractNumber',
        },
        {
          title: this.lang == 'ar' ? ' تاريخ العقد ' : 'Contract Date',
          field: 'date',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ بداية العقد' : 'Start Contract Date',
          field: 'startDate',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ نهاية العقد' : 'End Contract Date',
          field: 'endDate',
        }
        ,
        this.lang == 'ar'
        ? { title: 'حالة العقد', field: 'contractStatusArName' }
        : { title: 'Contract Status', field: 'contractStatusEnName' },
        this.lang == 'ar'
        ? { title: 'خدمة الصيانة', field: 'serviceNameAr' }
        : { title: 'Maintenance Service', field: 'serviceNameEn' },
        this.lang == 'ar'
        ? { title: 'المورد', field: 'supplierNameAr' }
        : { title: 'Supplier', field: 'supplierNameEn' }
        // {
        //   title: this.lang == 'ar' ? 'قيمة العقد' : 'Contract Value',
        //   field: 'totalAmount',
        // }


      ];
    })
  }

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEditContract: true,
    showIssueContract:true,
    showDisplay:true
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'id', type: 'like', value: searchTxt },
        { field: 'serviceNameAr', type: 'like', value: searchTxt },
        { field: 'serviceNameEn', type: 'like', value: searchTxt },
        { field: 'supplierNameAr', type: 'like', value: searchTxt },
        { field: 'supplierNameEn', type: 'like', value: searchTxt }


        ,
      ],
    ];
  }


  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'EditContract') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
          submitMode:false
        } as ToolbarData);

        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.router.navigate(['control-panel/maintenance/update-maintenance-contract/'+event.item.id])

      } else if (event.actionName == 'Delete') {
        this.showConfirmDeleteMessage(event.item.id);
      }
      else if (event.actionName == 'IssueContract') {
       this.contractissued(event.item.id)

      }
      else if (event.actionName == 'Display') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Index',
          componentName: 'List',
          submitMode:false
        } as ToolbarData);

        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.router.navigate(['control-panel/maintenance/update-maintenance-contract/'+event.item.id])

      }
    }
  }

  //#endregion


  setToolbarComponentData() {
    let contractArName = localStorage.getItem('contractArName')!;
    let contractEnName = localStorage.getItem('contractEnName')!;
    // this.toolbarPathData.componentAdd =
    //   this.lang == 'ar'
    //     ? 'تحديث' + ' ' + contractArName
    //     : 'Update' + ' ' + contractEnName;
    this.toolbarPathData.componentList =
      this.lang == 'ar' ? contractArName : contractEnName;
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //#region Toolbar Service
  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        //currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.setToolbarComponentData();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.setToolbarComponentData();
           // this.router.navigate([this.addUrl]);
            this.router.navigate(['/control-panel/maintenance/add-maintenance-contract'],{ queryParams: { settingid: this.settingId } });

          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion
}


