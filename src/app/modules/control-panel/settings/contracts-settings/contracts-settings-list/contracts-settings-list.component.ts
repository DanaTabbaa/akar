import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { ContractsSettingsService } from 'src/app/core/services/backend-services/contracts-settings.service';
import { RentContractsSettingsDetailsService } from 'src/app/core/services/backend-services/rent-contracts-settings-details.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ObjectIsNotNullOrEmpty } from 'src/app/helper/helper';
import { reloadPage } from 'src/app/core/helpers/router-helper';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { RentContract } from 'src/app/core/models/rent-contracts';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 34; // from pages table in database seeding table

@Component({
  selector: 'app-contracts-settings-list',
  templateUrl: './contracts-settings-list.component.html',
  styleUrls: ['./contracts-settings-list.component.scss']
})
export class ContractsSettingsListComponent implements OnInit, OnDestroy, AfterViewInit {
  //properties
  contractsSettings: ContractsSettings[] = [];
  addUrl: string = '/control-panel/settings/add-contract-setting';
  updateUrl: string = '/control-panel/settings/update-contract-setting/';
  listUrl: string = '/control-panel/settings/contracts-settings-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "sidebar.contract-types",
    componentAdd: '',

  };

  //
  //constructor
  constructor(private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,    
    private contractsSettingsService: ContractsSettingsService,    
    private spinner: NgxSpinnerService,    
    private managerService:ManagerService,
    private cd:ChangeDetectorRef
  ) { }
  //
  //oninit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadContractSettings()
    ]).then(a=>{
      this.spinner.hide();
      this.contractsSettings = this.managerService.getContractSettings();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();

    }).catch(e=>{
      this.spinner.hide();
    });    
  }

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion


  ngAfterViewInit(): void {
    


  }
  //

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

  //Methods
  // getContractsSettings() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(ContractSettingSelectors.selectors.getListSelector).subscribe({
  //       next: (res: ContractSettingModel) => {

  //         this.contractsSettings = JSON.parse(JSON.stringify(res.list))
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {
  //
  //         this.spinner.hide();
  //       },
  //     });
  //     this.subsList.push(sub);
  //   });
 
  //rentContractList
  isContractSettingHasContracts:boolean=false;
 

  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }

  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/settings/add-contract-setting'], { queryParams: { typeOfComponent: typeOfComponent } });
  }

  edit(id: string) {
    //this.getContracts(id);
    this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    this.router.navigate(['/control-panel/settings/update-contract-setting', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  //


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

  isListEmpty
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        let sub = this.contractsSettingsService.deleteWithUrl("DeleteWithCheck?Id=" + id).subscribe(
          {
            next:(resonse) => {
              if (resonse.success == true) {
                this.showResponseMessage(
                  resonse.success,
                  AlertTypes.success,
                  this.translate.transform("messages.delete-success")
                );
                
                this.managerService.loadContractSettings().then(a => {
                  this.spinner.hide();
                  
                  this.contractsSettings = this.managerService.getContractSettings();
                  this.cd.detectChanges();
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
              
            },
            error:(err)=>{},
            complete:()=>{}

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

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'contractArName', type: 'like', value: searchTxt },
        { field: 'contractEnName', type: 'like', value: searchTxt },

        ,
      ],
    ];
  }
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [

        { title: this.lang === 'ar' ? ' اسم العقد' : 'Contract Name', field: this.lang === 'en' ? 'contractArName' : 'contractArName' },
        { title: this.lang === 'ar' ? ' اسم العقد بالانجليزى' : 'Contract Name in Latin', field: this.lang === 'ar' ? 'contractEnName' : 'contractEnName' },


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

  openContractsSettings() { }

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
        this.router.navigate(['control-panel/settings/update-contract-setting/' + event.item.id])

      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
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

  // listenToPathChange() {
  //   let sub = this.sharedServices.getToolbarPath().subscribe({
  //     next: (toolbarPathData: ToolbarPath) => {
  //
  //       this.toolbarPathData = toolbarPathData;

  //       if (ObjectIsNotNullOrEmpty(toolbarPathData)) {

  //         if(toolbarPathData.listPath=="reload")
  //         {
  //           reloadPage()
  //         }

  //       }
  //     },
  //   });
  //   this.subsList.push(sub);
  // }

  listenToReloadSidebarFlag()
  {

    let sub = this.sharedServices.getReloadSidebarStatues().subscribe({
      next: (reloadFlag: boolean) => {
        this.spinner.show();
   
        if (reloadFlag) {
          setTimeout(() => {
            this.spinner.hide();
            reloadPage();
          },500);

        }


      },
    });
    this.subsList.push(sub);

  }

}
