import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {
  AlertTypes,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import {
  NAME_VALIDATORS,
  REQUIRED_VALIDATORS,
} from 'src/app/core/constants/input-validators';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { MaintenanceServices } from 'src/app/core/models/maintenance-services';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { MaintenanceServicesService } from 'src/app/core/services/backend-services/maintenance-services.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MaintenanceServicesActions } from 'src/app/core/stores/actions/maintenanceservices.actions';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 18; // from pages table in database seeding table
@Component({
  selector: 'app-maintenance-service',
  templateUrl: './maintenance-service.component.html',
  styleUrls: ['./maintenance-service.component.scss'],
})
export class MaintenanceServiceComponent implements OnInit, OnDestroy {
  changeMaintenanceServicesFlag: number = 0;
  //#region Main Declarations
  maintenanceServicesForm!: FormGroup;

  sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;

  addUrl: string = '/control-panel/maintenance/add-maintenance-service';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-service/';
  listUrl: string = '/control-panel/maintenance/maintenance-services-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.maintenance-services',
    componentAdd: 'maintenance-services.add-maintenance-service',
  };

  submited: boolean = false;
  Response!: ResponseResult<MaintenanceServices>;

  //#endregion

  //#region Constructor
  constructor(
    private maintenanceServicesService: MaintenanceServicesService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private store: Store<any>
  ) {
    this.createMaintenanceServiceForm();
  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem('PageId', PAGEID.toString());
    this.loadData();
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.toolbarPathData.componentAdd =
            'maintenance-services.update-maintenance-service';
          this.getMaintenanceServiceById(this.id);
          this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
        }
      } else {
        this.sharedServices.changeButton({
          action: 'SinglePage',
        } as ToolbarData);
      }
      // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.url = this.router.url.split('/')[2];
    });
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

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService
        .getAll('GetPagePermissionById?pageId=' + pageId)
        .subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
            this.userPermissions = JSON.parse(
              this.rolePermission.permissionJson
            );
            this.sharedServices.setUserPermissions(this.userPermissions);
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {},
        });
    });
    return promise;
  }
  //#endregion
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  createMaintenanceServiceForm() {
    this.maintenanceServicesForm = this.fb.group({
      id: 0,
      serviceNameAr: REQUIRED_VALIDATORS,
      serviceNameEn: REQUIRED_VALIDATORS,
    });
  }

  loadData() {
    this.getPagePermissions(PAGEID);
    this.sharedServices.changeButton({ action: 'Save' } as ToolbarData);
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
  }

  //#endregion

  //#region CRUD Operations
  getMaintenanceServiceById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceServicesService.getById(id).subscribe({
        next: (res: any) => {
          this.maintenanceServicesForm.setValue({
            id: this.id,
            serviceNameAr: res.data.serviceNameAr,
            serviceNameEn: res.data.serviceNameEn,
          });
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }

  onSave() {
    this.spinner.show();
    if (this.maintenanceServicesForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.maintenanceServicesService
          .addWithUrl('insert', this.maintenanceServicesForm.value)
          .subscribe({
            next: (result: any) => {

              this.Response = { ...result.data };
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeMaintenanceServicesFlag++;
                  this.store.dispatch(
                    MaintenanceServicesActions.actions.insert({
                      data: JSON.parse(JSON.stringify({ ...result.data })),
                    })
                  );
                  this.createMaintenanceServiceForm();


                    this.spinner.hide();
                    this.showResponseMessage(
                      result.success,
                      AlertTypes.success,
                      this.translate.transform('messages.add-success')
                    );
                    this.navigateUrl(this.addUrl);

                } else if (result.isFound) {
                  this.spinner.hide();
                  this.checkResponseMessages(result.message);
                }
              }
            },
            error: (err: any) => {
              this.spinner.show();
              reject(err);
            },
            complete: () => {},
          });
      });
      return promise;
    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.maintenanceServicesForm.markAllAsTouched();
    }
  }

  onUpdate() {
    this.spinner.show();
    if (this.maintenanceServicesForm.value != null) {
      const promise = new Promise<void>((resolve, reject) => {
        this.maintenanceServicesService
          .updateWithUrl('Update', this.maintenanceServicesForm.value)
          .subscribe({
            next: (result: any) => {

              this.Response = { ...result.data };
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeMaintenanceServicesFlag++;
                  this.store.dispatch(
                    MaintenanceServicesActions.actions.update({
                      data: JSON.parse(JSON.stringify({ ...result.data })),
                    })
                  );
                  this.createMaintenanceServiceForm();


                    this.spinner.hide();
                    this.showResponseMessage(
                      result.success,
                      AlertTypes.success,
                      this.translate.transform('messages.update-success')
                    );
                    this.navigateUrl(this.addUrl);

                } else if (result.isFound) {
                  this.spinner.hide();
                  this.checkResponseMessages(result.message);
                }
              }
            },
            error: (err: any) => {
              this.spinner.hide();
              reject(err);
            },
            complete: () => {},
          });
      });
      return promise;
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.maintenanceServicesForm.markAllAsTouched();
    }
  }

  checkResponseMessages(message: string) {
    let responseStatus = true;
    switch (message) {
      case 'NameAr':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          'messages.nameAr-exist'
        );
        break;
      case 'NameEn':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          'messages.nameEn-exist'
        );
        break;
      case 'Code':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          'messages.office-code-exist'
        );
        break;
    }
  }
  //#endregion

  //#region Helper Functions

  showResponseMessage(responseStatus, alertType, message) {
  let translateMessage=  this.translate.transform(message)
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        translateMessage,
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        translateMessage,
        this.translate.transform('messageTitle.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        translateMessage,
        this.translate.transform('messageTitle.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        translateMessage,
        this.translate.transform('messageTitle.error')
      );
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.maintenanceServicesForm.controls;
  }

  //#endregion

  //#region Tabulator
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.router.navigate([this.listUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd =
              'maintenance-services.add-maintenance-service';
            this.router.navigate([this.addUrl]);
            this.createMaintenanceServiceForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.navigateUrl(this.addUrl);
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  //#endregion
}
