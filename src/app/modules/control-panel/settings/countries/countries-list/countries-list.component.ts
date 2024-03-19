import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Countries } from 'src/app/core/models/countries';
import { CountriesVM } from 'src/app/core/models/ViewModel/countries-vm';
import { CountriesService } from 'src/app/core/services/backend-services/countries.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { Store } from '@ngrx/store';
import { CountryActions } from 'src/app/core/stores/actions/country.actions';
const PAGEID = 37; // from pages table in database seeding table
@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit, OnDestroy,OnChanges {
  @Input() changeCountriesFlag:number= 0;
  //#region Main Declarations

  countries: Countries[] = [];
  currnetUrl: any;
  addUrl: string = '/control-panel/settings/add-country';
  updateUrl: string = '/control-panel/settings/update-country/';
  listUrl: string = '/control-panel/settings/countries-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-countries",
    componentAdd: '',
  };
  //#endregion

  //#region Constructor
  constructor(private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private store: Store<any>,
    private countriesService: CountriesService) { }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
   // this.sharedServices.changeButton({ action: 'SinglePage' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getCountries();
    this.defineGridColumn();
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
  ngOnChanges(changes: SimpleChanges): void {
    if(this.changeCountriesFlag){
      this.getCountries();
    }

  }
  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
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
  getCountries() {

    const promise = new Promise<void>((resolve, reject) => {
      this.countriesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.countries = res.data.map((res: CountriesVM[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.countries", this.countries);
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

  //#region CRUD Operations


  edit(id: string) {
   // this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    this.router.navigate(['/control-panel/settings/update-country', id]);
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

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("messages.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        var deletedItem = this.countries.find(x => x.id == id);
        this.countriesService.deleteWithUrl("Delete?id=" + id).subscribe((resonse) => {
          this.getCountries();
          if (resonse.success == true) {
            this.store.dispatch(CountryActions.actions.delete({
              data: JSON.parse(JSON.stringify({ ...deletedItem }))
            }));
            this.showResponseMessage(
              resonse.success,
              AlertTypes.success,
              this.translate.transform("messages.delete-success")
            );
          } else if (resonse.success == false) {
            this.showResponseMessage(
              resonse.success,
              AlertTypes.error,
              this.translate.transform("messages.delete-faild")
            );
          }
        });
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
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
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe((res) => {

      this.lang = res;
      this.columnNames = [
        { title: this.lang == 'ar' ? 'رقم البلد' : ' Id', field: 'id', },
        this.lang == 'ar'
          ? { title: ' البلد', field: 'countryNameAr' }
          : { title: ' Country  ', field: 'countryNameEn' },
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
  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }


  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'countryNameAr', type: 'like', value: searchTxt },
        { field: 'countryNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openCountries() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        // this.sharedServices.changeButton({
        //   action: 'Update',
        //   componentName: 'List',
        // } as ToolbarData);
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
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
