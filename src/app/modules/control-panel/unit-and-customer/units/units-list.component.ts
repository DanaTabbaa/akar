import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { UnitsVM } from 'src/app/core/models/ViewModel/units-vm';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { ResponseResultNoraml } from 'src/app/core/models/ResponseResult';
const PAGEID = 8; // from pages table in database seeding table
@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss']
})
export class UnitsListComponent implements OnInit, OnDestroy {
  currnetUrl: any;
  unitSearchForm!: FormGroup;
  addUrl: string = '/control-panel/definitions/add-unit';
  updateUrl: string = '/control-panel/definitions/update-unit/';
  listUrl: string = '/control-panel/definitions/units-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-units",
    componentAdd: "component-names.add-unit",

  };

  constructor(private unitsService: UnitsService,
    private translate: TranslatePipe,
    private router: Router,
    private sharedServices: SharedService,
    private modalService: NgbModal,
    private alertsService: NotificationsAlertsService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService,) {

    this.unitSearchForm = this.fb.group({
      _search: ''
    }
    )
  }


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
  ngOnInit(): void {
    this.defineGridColumn();
    this.spinner.show();
    Promise.all([this.managerService.loadPagePermissions(PAGEID), this.managerService.loadUnits()]).then(a => {
      this.units = this.managerService.getUnits();
      this.spinner.hide();
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
      this.listenToClickedButton();
    }).catch(e=>{
      this.spinner.hide();
    });





  }


  units: UnitsVM[] = [];




  delete(id: any) {
    if (this.managerService.getUserPermissions()?.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }
  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    this.router.navigate(['/control-panel/definitions/update-unit', id]);
  }
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");;
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      if (rs == "Confirm") {
        this.spinner.show();
        //var deletedItem = this.units.find(x => x.id == id);
        let sub = this.unitsService.deleteWithUrl("DeleteWithCheck?Id=" + id).subscribe({
          next: (response: ResponseResultNoraml) => {

            if (response.success == true) {
              this.managerService.loadUnits().then(a => {
                this.units = this.managerService.getUnits();
                this.spinner.hide();
              }).catch(err => {
                this.spinner.hide();
              });

              this.showResponseMessage(
                response.success,
                AlertTypes.success,
                this.translate.transform("messages.delete-success")
              );
            }
            else if (response.isUsed) {
              this.spinner.hide();
              this.showResponseMessage(response.success, AlertTypes.error, this.translate.transform("messages.delete-faild") + response.message)
            } else {
              this.spinner.hide();
              this.showResponseMessage(response.success, AlertTypes.error, this.translate.transform("messages.delete-faild"))
            }

          },
          error: (err) => {
            this.spinner.hide();
          },
          complete: () => { }
        });
        this.subsList.push(sub);


      }
    })

  }
  //#region Toolbar

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
          title: this.lang == 'ar' ? ' كود الوحدة' : ' Unit Code ',
          field: 'unitCode',
        },
        this.lang == 'ar'
          ? { title: ' الوحدة', field: 'unitNameAr' }
          : { title: ' Unit  ', field: 'unitNameEn' },
        {
          title: this.lang == 'ar' ? ' الايجار السنوي' : 'Rent Price',
          field: 'rentPrice',
        },
        {
          title: this.lang == 'ar' ? ' سعر العرض' : ' Offer Price',
          field: 'offerPrice',
        },
        {
          title: this.lang == 'ar' ? ' قيمة التأمين ' : ' Insurance Value ',
          field: 'insurranceAmount',
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
        { field: 'unitNameAr', type: 'like', value: searchTxt },
        { field: 'unitNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }


  openAddUnit() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {

    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({ action: 'Update', componentName: "List" } as ToolbarData);
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
