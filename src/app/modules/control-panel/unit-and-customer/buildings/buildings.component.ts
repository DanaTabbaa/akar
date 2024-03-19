import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { VwBuildings } from 'src/app/core/view-models/vw-buildings-vm';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
const PAGEID = 7; // from pages table in database seeding table
@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent implements OnInit, OnDestroy {
  addUrl: string = '/control-panel/definitions/add-building';
  updateUrl: string = '/control-panel/definitions/update-building/';
  listUrl: string = '/control-panel/definitions/buildings';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: this.listUrl,
    addPath: '',
    updatePath: this.updateUrl,
    componentList: "component-names.list-buildings",
    componentAdd: '',
  };
  constructor(
    private buildingsService: BuildingsService,
    private router: Router,  
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,  
    private managerService:ManagerService
  ) {
    this.lang = localStorage.getItem('language')!;
    //(('lang', this.lang);
  }
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID), 
      this.managerService.loadBuildingsVM()]).then(a=>{
      this.buildings = this.managerService.getBuildingsVM();
      this.spinner.hide();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(err=>{
      this.spinner.hide()
    });
   
    
  }

  language!: string;
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }
  //#endregion
  //#region Tabulator
  buildings: VwBuildings[] = [];
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';

  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [
        this.lang == 'ar'
          ? { title: 'المبنى', field: 'buildingNameAr', visible: this.lang == 'ar' }
          : { title: 'Building ', field: 'buildingNameEn', visible: this.lang == 'en' },
        this.lang == 'ar'
          ? { title: ' المجموعة العقارية ', field: 'realestateNameAr' }
          : { title: ' Realestate  ', field: 'realestateNameEn' },
        this.lang == 'ar'
          ? { title: ' المالك ', field: 'ownerNameAr' }
          : { title: ' Owner  ', field: 'ownerNameEn' },
        this.lang == 'ar'
          ? { title: ' البلد ', field: 'countryNameAr' }
          : { title: ' Country  ', field: 'countryNameEn' },
        this.lang == 'ar'
          ? { title: ' المدينة ', field: 'cityNameAr' }
          : { title: 'City ', field: 'cityNameEn' },
        this.lang == 'ar'
          ? { title: ' المنطقة ', field: 'regionNameAr' }
          : { title: ' Region  ', field: 'regionNameEn' },
        {
          title: this.lang == 'ar' ? ' المساحة' : ' Area Size  ',
          field: 'areaSize',
        },
        {
          title: this.lang == 'ar' ? ' عدد الوحدات' : ' Units Number  ',
          field: 'unitNumber',
        },
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
  columnNames: any[] = [];

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'buildingNameAr', type: 'like', value: searchTxt },
        { field: 'buildingNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }


  openAddBuilding() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
      } else if (event.actionName == 'Delete') {
        this.delete(event.item.id);
      }
    }
  }

  //#endregion


 
  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  edit(id: any) {

    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/definitions/update-building/', id]);
  }
  //#region Helper Functions
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.spinner.show();
        //var deletedItem = this.buildings.find(x => x.id == id);

       let sub =  this.buildingsService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe((resonse:ResponseResultNoraml) => {
          if (resonse.success == true) {            
            this.managerService.loadBuildingsVM().then(a=>{
              this.buildings = this.managerService.getBuildingsVM();
              this.spinner.hide();
            }).catch(a=>{
              this.spinner.hide();
            });
            this.showResponseMessage(resonse.success, AlertTypes.success, this.translate.transform("messages.delete-success"))
          } else if (resonse.success == false && resonse.isUsed == false) {
            this.spinner.hide();
            this.showResponseMessage(resonse.success, AlertTypes.error, this.translate.transform("messages.delete-faild"))
          }
          else if(resonse.isUsed)
          {
            this.spinner.hide();
            this.showResponseMessage(resonse.success, AlertTypes.error, this.translate.transform("messages.delete-faild") + resonse.message)
          }
          else {
            this.spinner.hide();
            this.showResponseMessage(resonse.success, AlertTypes.error, this.translate.transform("messages.delete-faild") + resonse.message)
          }
          
        });

        this.subsList.push(sub);
        
      }
    });
  }
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

  //#region Toolbar Service

  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToClickedButton() {

    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            // this.router.navigate(['/control-panel/definitions/buildings']);
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
