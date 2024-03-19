import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertTypes, convertEnumToArray, maintenanceRequestTypeArEnum, maintenanceRequestTypeEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Subscription } from 'rxjs'
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { OwnersVM } from 'src/app/core/models/ViewModel/owners-vm';
import { TenantsVM } from 'src/app/core/models/ViewModel/tenants-vm';
import { UnitVM } from 'src/app/core/view-models/unit-vm';
import { MaintenanceServices } from 'src/app/core/models/maintenance-services';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { MaintenanceRequests } from 'src/app/core/models/maintenance-requests';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { MaintenanceServicesService } from 'src/app/core/services/backend-services/maintenance-services.service';
import { Owner } from 'src/app/core/models/owners';
import { pursposeTypeEnum } from 'src/app/core/constants/enumrators/enums';
import { MaintenanceRequestsService } from 'src/app/core/services/backend-services/maintenance-requests.service';
import { TechniciansMaintenanceServicesService } from 'src/app/core/services/backend-services/technicians-maintenance-services.service';
import { TechniciansMaintenanceServicesVM } from 'src/app/core/models/ViewModel/technicians-maintenance-services-vm';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { MaintenanceRequestsActions } from 'src/app/core/stores/actions/maintenancerequests.actions';
import { Store } from '@ngrx/store';
const PAGEID = 24; // from pages table in database seeding table

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss']
})
export class MaintenanceRequestsComponent implements OnInit, OnDestroy {

  //#region Main Declarations
  maintenanceRequestForm!: FormGroup;
  ownersList: OwnersVM[] = [];
  tenantsList: TenantsVM[] = [];
  unitsList: UnitVM[] = [];
  maintenanceServicesList: MaintenanceServices[] = [];
  techniciansList: TechniciansMaintenanceServicesVM[] = [];
  requestTypes: ICustomEnum[] = [];
  lang: string = '';
  sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;
  addUrl: string = '/control-panel/maintenance/add-maintenance-request';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-request/';
  listUrl: string = '/control-panel/maintenance/maintenance-requests-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.maintenance-requests",
    componentAdd: "maintenance-requests.add-maintenance-request",
  };

  submited: boolean = false;
  Response!: ResponseResult<MaintenanceRequests>;

  //#endregion

  //#region Constructor
  constructor(
    private ownersService: OwnersService,
    private tenantsService: TenantsService,
    private techniciansMaintenanceServicesService: TechniciansMaintenanceServicesService,
    private unitsService: UnitsService,
    private maintenanceServicesService: MaintenanceServicesService,
    private maintenanceRequestsService: MaintenanceRequestsService,
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
    this.defineMaintenanceRequestsForm()
  }

  //#endregion

  //#region ngOnInit
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.loadData();
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId",params["id"]);
          this.toolbarPathData.componentAdd = "maintenance-requests.update-maintenance-request";
          this.getMaintenanceRequestById(this.id);
        }
      } else {

      }

    })
  }

  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
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
  defineMaintenanceRequestsForm() {
    this.maintenanceRequestForm = this.fb.group({
      id: 0,
      ownerId: '',
      tenantId: ['', Validators.compose([Validators.required])],
      unitId: ['', Validators.compose([Validators.required])],
      maintenanceServiceId: ['', Validators.compose([Validators.required])],
      requestType: ['', Validators.compose([Validators.required])],
      requestStatus: '',
      technicianId: '',
      commentTxt: '',
      requirementReport: '',
      accomplishmentReport: '',
      ratingValueByTenant: '',
      ratingTxtByTenant: '',
      ratingValueByTechnician: '',
      ratingTxtByTechnician: '',
      ratingValueByResponsibleForMaintenance: '',
      ratingTxtByResponsibleForMaintenance: ''



    });
  }

  loadData() {
    // this.sharedServices.changeButton({action:"Save"}as ToolbarData)
    this.getPagePermissions(PAGEID)
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
    this.getLanguage();
    this.getMaintenanceRequestTypes();
    this.spinner.show();
    Promise.all([
      this.getOwners(),
      this.getTenants(null),
      this.getUnitsForRent(),
      this.getMaintenanceServices(),

    ]).then(a => {
      this.spinner.hide();
    })
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getOwners() {
    const promise = new Promise<void>((resolve, reject) => {
      this.ownersService.getAll("GetAllVM").subscribe({
        next: (res: any) => {
          this.ownersList = res.data.map((res: Owner[]) => {
            return res
          });
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
  getTenants(ownerId: any) {

    const promise = new Promise<void>((resolve, reject) => {
      this.tenantsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          if (ownerId != null) {

            this.tenantsList = res.data.filter(x => x.ownerId == ownerId).map((res: TenantsVM[]) => {
              return res
            });
          }
          else {
            this.tenantsList = res.data.map((res: TenantsVM[]) => {
              return res
            });
          }
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
  getTechniciansByMaintenanceServiceId() {
    let maintenanceServiceId = this.maintenanceRequestForm.value.maintenanceServiceId;
    const promise = new Promise<void>((resolve, reject) => {
      this.techniciansMaintenanceServicesService.getAll("GetAll").subscribe({
        next: (res: any) => {

          if (maintenanceServiceId != null) {

            this.techniciansList = res.data.filter(x => x.maintenanceServiceId == maintenanceServiceId).map((res: TechniciansMaintenanceServicesVM[]) => {
              return res
            });
          }
          else {
            this.techniciansList = res.data.map((res: TechniciansMaintenanceServicesVM[]) => {
              return res
            });
          }
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

  getUnitsForRent() {
    const promise = new Promise<void>((resolve, reject) => {
      this.unitsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.unitsList = res.data.filter(x => x.purposeType == pursposeTypeEnum['For Rent'] || x.purposeType==pursposeTypeEnum['For Sell and Rent']).map((res: UnitVM[]) => {
            return res
          });
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

  getMaintenanceServices() {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceServicesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.maintenanceServicesList = res.data.map((res: MaintenanceServices[]) => {
            return res
          });
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

  getMaintenanceRequestTypes() {
    if (this.lang == 'en') {
      this.requestTypes = convertEnumToArray(maintenanceRequestTypeEnum);
    }
    else {
      this.requestTypes = convertEnumToArray(maintenanceRequestTypeArEnum);

    }
  }


  //#endregion

  //#region CRUD Operations
  getMaintenanceRequestById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceRequestsService.getById(id).subscribe({
        next: (res: any) => {
          ;
          this.maintenanceRequestForm.setValue({
            id: res.data.id,
            ownerId: res.data.ownerId,
            tenantId: res.data.tenantId,
            unitId: res.data.unitId,
            maintenanceServiceId: res.data.maintenanceServiceId,
            requestType: res.data.requestType,
            requestStatus: res.data.requestStatus,
            technicianId: res.data.technicianId,
            commentTxt: res.data.commentTxt,
            requirementReport: res.data.requirementReport,
            accomplishmentReport: res.data.accomplishmentReport,
            ratingValueByTenant: res.data.ratingValueByTenant,
            ratingTxtByTenant: res.data.ratingTxtByTenant,
            ratingValueByTechnician: res.data.ratingValueByTechnician,
            ratingTxtByTechnician: res.data.ratingTxtByTechnician,
            ratingValueByResponsibleForMaintenance: res.data.ratingValueByResponsibleForMaintenance,
            ratingTxtByResponsibleForMaintenance: res.data.ratingTxtByResponsibleForMaintenance

          });
          this.getTechniciansByMaintenanceServiceId()

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

  onSave() {
    this.spinner.show();
    if (this.maintenanceRequestForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.maintenanceRequestForm.value.id = this.id;
      const promise = new Promise<void>((resolve, reject) => {
        this.maintenanceRequestsService.addData("insert", this.maintenanceRequestForm.value).subscribe({
          next: (result: any) => {

            this.Response = { ...result.response };
            console.log("result.data", this.Response)
            this.store.dispatch(MaintenanceRequestsActions.actions.insert({
              data: JSON.parse(JSON.stringify({ ...result.response.data }))
            }));
            this.defineMaintenanceRequestsForm();

            this.submited = false;

              this.spinner.hide();
              this.showResponseMessage(this.Response.success, AlertTypes.success,this.translate.transform("messages.add-success"));
              this.navigateUrl(this.listUrl);

          },
          error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise
    }
    else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.maintenanceRequestForm.markAllAsTouched();
    }
  }



  onUpdate() {
    this.submited = true;
    if (this.maintenanceRequestForm.value != null) {
      const promise = new Promise<void>((resolve, reject) => {
        ;

        this.maintenanceRequestsService.update(this.maintenanceRequestForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();

            this.Response = { ...result.response };
            console.log("result.data", this.Response)
            this.store.dispatch(MaintenanceRequestsActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
            this.defineMaintenanceRequestsForm();
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(result.success, AlertTypes.success, this.translate.transform("messages.update-success"));
              this.navigateUrl(this.listUrl);
            },500);
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise
    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));

      return this.maintenanceRequestForm.markAllAsTouched();
    }
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


  get f(): { [key: string]: AbstractControl } {
    return this.maintenanceRequestForm.controls;
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
            this.sharedServices.changeToolbarPath({ listPath: this.listUrl } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "maintenance-requests.add-maintenance-request";
            this.router.navigate([this.addUrl]);
            this.defineMaintenanceRequestsForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.navigateUrl(this.addUrl)
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {

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

