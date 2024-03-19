import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { PeopleOfBenefit } from 'src/app/core/models/people-of-benefits';
import { PeopleOfBenefitsService } from 'src/app/core/services/backend-services/people-of-benefits.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { PeopleOfBenefitsActions } from 'src/app/core/stores/actions/peopleofbenefits.actions';
import { Store } from '@ngrx/store';
const PAGEID = 14; // from pages table in database seeding table
@Component({
  selector: 'app-people-of-benefits-list',
  templateUrl: './people-of-benefits-list.component.html',
  styleUrls: ['./people-of-benefits-list.component.scss'],
})
export class PeopleOfBenefitsListComponent implements OnInit, OnDestroy, AfterViewInit {

  //#region Main Declarations
  peopleOfBenefits: PeopleOfBenefit[] = [];
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-benefit-person';
  updateUrl: string = '/control-panel/definitions/update-benefit-person/';
  listUrl: string = '/control-panel/definitions/people-of-benefits-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-benefit-person",
    componentAdd: '',

  };
  //#endregion

  //#region Constructor
  constructor(
    private peopleofbenefitsService: PeopleOfBenefitsService,
    private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private rolesPerimssionsService: RolesPermissionsService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private store: Store<any>,

  ) { }


  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.defineGridColumn();

  }

  ngAfterViewInit(): void {
    this.listenToClickedButton();

    this.getBenefitsPeople();
    setTimeout(() => {
      this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      this.sharedServices.changeToolbarPath(this.toolbarPathData);
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
  getBenefitsPeople() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.peopleofbenefitsService.getAll("GetAllVM").subscribe({
        next: (res) => {
          //(("getBenefitsPeople",res);

          //let data =
          //   res.data.map((res: PeopleOfBenefitsVM[]) => {
          //   return res;
          // });
          if (res.success) {
            this.peopleOfBenefits = JSON.parse(JSON.stringify(res.data));
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
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))

    }

  }


  edit(id: string) {
    this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    this.router.navigate([
      '/control-panel/definitions/update-benefit-person',
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

  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      if (rs == 'Confirm') {
        this.spinner.show();
        var deletedItem = this.peopleOfBenefits.find(x => x.id == id);
        let sub = this.peopleofbenefitsService.deleteWithResponse("Delete?Id=" + id).subscribe(
          (resonse) => {
            this.getBenefitsPeople();
            if (resonse.success == true) {
              this.store.dispatch(PeopleOfBenefitsActions.actions.delete({
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
                resonse.message
              );
            }
            setTimeout(() => {
              this.spinner.hide();
            },500);
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
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.columnNames = [

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
        {
          title: this.lang == 'ar' ? 'رقم الهوية' : ' Identity No',
          field: 'identityNo',
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
  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'nameEn', type: 'like', value: searchTxt },
        { field: 'nameAr', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openPeopleOfBenefits() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Edit') {
        this.edit(event.item.id);
        this.sharedServices.changeButton({
          action: 'Update',
          componentName: 'List',
          submitMode: false
        } as ToolbarData);

        // this.toolbarPathData.updatePath = "/control-panel/definitions/update-benefit-person/"
        this.sharedServices.changeToolbarPath(this.toolbarPathData);
        this.router.navigate(['control-panel/definitions/update-benefit-person/' + event.item.id])

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
}
