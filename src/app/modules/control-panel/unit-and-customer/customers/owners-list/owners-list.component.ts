import { Component, OnInit, OnDestroy } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Owner } from 'src/app/core/models/owners';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 4;
@Component({
  selector: 'app-owners-list',
  templateUrl: './owners-list.component.html',
  styleUrls: ['./owners-list.component.scss'],
})
export class OwnersListComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-owner';
  updateUrl: string = '/control-panel/definitions/update-owner/';
  listUrl: string = '/control-panel/definitions/owners-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-owners",
    componentAdd: "component-names.blank",
  };
  owners: Owner[] = [];
  ownerSearchForm!: FormGroup; 
  constructor(
    private ownersService: OwnersService,
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
    Promise.all([this.managerService.loadPagePermissions(PAGEID), this.managerService.loadOwners()])
      .then(a => {
        this.owners = this.managerService.getOwners();     
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.listenToClickedButton();
      }).catch(err => {
        this.spinner.hide();
      });




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
  //#endregion
  //#region Authentications
  //#endregion
  //#region Permissions


  // getPagePermissions(pageId) {
  //   return new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         resolve();
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(this.userPermissions);


  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });


  // }
  //#endregion
  //#region  State Management
  //#endregion
  //#region Basic Data
  ///Geting form dropdown list data


  //#endregion
  //#region CRUD Operations
  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  //#endregion
  //#region Helper Functions
  goToAdd(typeOfComponent: any) {
    this.router.navigate(['/control-panel/definitions/add-owner'], {
      queryParams: { typeOfComponent: typeOfComponent },
    });
  }
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
    this.router.navigate(['/control-panel/definitions/update-owner', id]);
  }
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        // let deletedItem = this.owners.find(x => x.id == id) as Owner;
        //  let deletedOwnerIndex =  this.owners.indexOf(deletedItem);
        //  let ownersList= this.owners.splice(deletedOwnerIndex,1);

        let sub = this.ownersService.deleteWithUrl("DeleteWithCheck?id=" + id).subscribe(
          {
            next:(resonse:ResponseResultNoraml) => {
              if (resonse.success == true) {
                this.managerService.loadOwners().then(a => {
                  this.spinner.hide();
                  this.owners = this.managerService.getOwners();              
                }).catch(e => {
                  this.spinner.hide();
                });
                
    
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
    
    
            },error:(err)=>{
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
        {
          title: this.lang == 'ar' ? ' الكود' : 'Id',
          field: 'id',
        },
        this.lang == 'ar'
          ? { title: ' الاسم', field: 'nameAr' }
          : { title: ' Name  ', field: 'nameEn' },
        {
          title: this.lang == 'ar' ? ' رقم الجوال' : 'Mobile',
          field: 'mobile',
        },
        {
          title: this.lang == 'ar' ? 'رقم الهاتف' : ' phone',
          field: 'phone',
        },
        // {
        //   title: this.lang == 'ar' ? 'رقم الهوية' : ' Identity No',
        //   field: 'identityNo',
          
        // },
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
  openAddOwners() { }
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
