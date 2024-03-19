import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';


import { OpportunitiesSpecialsService } from 'src/app/core/services/backend-services/opportunities-spcials.service';
import { OpportunitiesSpecialsVM } from 'src/app/core/models/ViewModel/opportunities-specials-vm';
const PAGEID = 1015;

@Component({
  selector: 'app-admin-specials-opportunities-list',
  templateUrl: './admin-specials-opportunities-list.component.html',
  styleUrls: ['./admin-specials-opportunities-list.component.scss']
})
export class AdminSpecialsOpportunitiesListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-opportunities-specials';
  updateUrl: string = '/control-panel/definitions/update-opportunities-specials/';
  listUrl: string = '/control-panel/definitions/opportunities-specials';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-opportunities-specials",
    componentAdd: "component-names.blank",
  };
  opportunitiesSpecials: OpportunitiesSpecialsVM[] = [];
 
  constructor(
    private opportunitiesSpecialService: OpportunitiesSpecialsService,
    private sharedServices: SharedService,
    private router: Router,
    private translate: TranslatePipe,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,  
    private managerService: ManagerService


  ) { }
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID), this.managerService.loadOpportunitiesSpecials()])
      .then(a => {
        this.opportunitiesSpecials = this.managerService.getOpportunitiesSpecials();     
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.listenToClickedButton();
      }).catch(err => {
        this.spinner.hide();
      })




  }
  //#endregion
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }
  
  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  
  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/definitions/add-opportunities-specials'], {
      queryParams: { typeOfComponent: typeOfComponent },
    });
  }
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/definitions/update-opportunities-specials', id]);
  }
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
       

        let sub = this.opportunitiesSpecialService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe(
          {
            next:(resonse:ResponseResultNoraml) => {
              if (resonse.success == true) {
                this.managerService.loadOpportunitiesSpecials().then(a => {
                  this.spinner.hide();
                  this.opportunitiesSpecials = this.managerService.getOpportunitiesSpecials();              
                }).catch(e => {
                  this.spinner.hide();
                });
                //   this.store.dispatch(OwnerActions.actions.setList({
                //     data: [...ownersList!]
                // }));
    
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
    
    
            },error:err=>{
              this.spinner.hide();
            }
          });
        this.subsList.push(sub);



      }
    }, err => {
      this.spinner.hide();
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
        
        this.lang == 'ar'
          ? { title: ' الاسم', field: 'nameAr' }
          : { title: ' Name  ', field: 'nameEn' },
        {
          title: this.lang == 'ar' ? 'السعر' : 'Rent Price',
          field: 'price',
        },
        
       
        {
          title: this.lang == 'ar' ? 'تاريخ الانتهاء' : 'Expire Date',
          field: 'specialExpireDate',
        },
      
        this.lang == "ar" ? {
          title: "حذف",
          field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
            this.delete(cell.getRow().getData().specialId);
          },
        } :
          {
            title: "Delete",
            field: "", formatter: this.deleteFormatIcon, cellClick: (e, cell) => {
              this.delete(cell.getRow().getData().specialId);
            },
          }
        ,
        this.lang == "ar" ? {
          title: "تعديل",
          field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
            this.edit(cell.getRow().getData().specialId);
          }
        }
          :
          {
            title: "Edit",
            field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
              this.edit(cell.getRow().getData().specialId);
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
        { field: 'id', type: 'like', value: searchTxt },
        { field: 'nameAr', type: 'like', value: searchTxt },
        { field: 'nameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }
  
  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update', componentName: 'List' } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
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

