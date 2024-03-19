import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ContractTypes } from 'src/app/core/models/contract-types';
import { ContractsTypesService } from 'src/app/core/services/backend-services/contracts-types.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contracts-types-list',
  templateUrl: './contracts-types-list.component.html',
  styleUrls: ['./contracts-types-list.component.scss']
})
export class ContractsTypesListComponent implements OnInit,OnDestroy {
  contractTypes :ContractTypes[]=[];

  addUrl: string = '/control-panel/settings/add-contract-type';
  updateUrl: string = '/control-panel/settings/update-contract-type/';
  listUrl: string = '/control-panel/settings/contracts-types-list';
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"component-names.list-contracts-types",
    componentAdd: '',
  };
  constructor(private router: Router,
    private modalService:NgbModal,
    private sharedServices:SharedService,
    private alertsService:NotificationsAlertsService,
    private translate:TranslatePipe,
    private contractsTypesService:ContractsTypesService) { }

  ngOnInit(): void {
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getContractsTypes();
    this.defineGridColumn();
  }

  //#region ngOnDestory
 ngOnDestroy() {
  this.subsList.forEach((s) => {
    if (s) {
      s.unsubscribe();
    }
  });
}
//#endregion

  getContractsTypes() {

    const promise = new Promise<void>((resolve, reject) => {
      this.contractsTypesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.contractTypes = res.data.map((res: ContractTypes[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.contractTypes", this.contractTypes);
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

  delete(id:any)
  {
    ;
    this.contractsTypesService.delete(id).subscribe(resonse=>{
      //(("delet response",resonse);
      this.getContractsTypes();
    });
  }
  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/settings/add-contract-type'], { queryParams: { typeOfComponent: typeOfComponent } });
  }

  edit(id: string) {
    ;
    this.router.navigate(['/control-panel/settings/update-contract-type', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }
   //#region Tabulator

   panelId: number = 1;
   sortByCols: any[] = [];
   searchFilters: any;
   groupByCols: string[] = [];
   lang:string='';

   columnNames: any[] = [];
   defineGridColumn() {
     this.sharedServices.getLanguage().subscribe((res) => {

       this.lang = res;
       this.columnNames = [
         {title:this.lang=='ar'?'رقم':'Id',field: 'id'},
         this.lang == "ar"
           ? { title: ' نوع العقد', field: 'contractTypeArName' }
           : { title: ' Contract Type  ', field: 'contractTypeEnName' },

       ];
     });
   }

   menuOptions: SettingMenuShowOptions = {
     showDelete: true,
     showEdit: true,
   };

   direction: string = 'ltr';

   onSearchTextChange(searchTxt: string) {
     this.searchFilters = [
       [
         { field: 'contractTypeArName', type: 'like', value: searchTxt },
         { field: 'contractTypeEnName', type: 'like', value: searchTxt },
         ,
       ],
     ];
   }

   openContractTypes() {}

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

   showResponseMessage(responseStatus, alertType, message) {

     if (responseStatus == true && AlertTypes.success == alertType) {
       this.alertsService.showSuccess(message, 'Done');
     } else if (responseStatus == true && AlertTypes.warning) {
       this.alertsService.showWarning(message, 'Alert');
     } else if (responseStatus == true && AlertTypes.info) {
       this.alertsService.showInfo(message, 'info');
     } else if (responseStatus == false && AlertTypes.error) {
       this.alertsService.showError(message, 'error');
     }
   }
   showConfirmDeleteMessage(id: number) {
     const modalRef = this.modalService.open(MessageModalComponent);
     modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
   modalRef.componentInstance.title = this.translate.transform("messages.delete");
     modalRef.componentInstance.btnConfirmTxt ="Delete"
     modalRef.componentInstance.isYesNo = true;
     modalRef.result.then((rs) => {
       //((rs);
       if (rs == 'Confirm') {
         this.contractsTypesService.delete(id).subscribe((resonse) => {
           //(('delet response', resonse);
           this.getContractsTypes();
           if (resonse.success == true) {
             this.showResponseMessage(
               resonse.success,
               AlertTypes.warning,
               resonse.message
             );
           } else if (resonse.success == false) {
             this.showResponseMessage(
               resonse.success,
               AlertTypes.error,
               resonse.message
             );
           }
         });
       }
     });
   }
        //#region Toolbar Service
  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
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
