import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {
  AlertTypes,
  pursposeTypeEnum,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Building } from 'src/app/core/models/buildings';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { WaterMeters } from 'src/app/core/models/water-meters';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { WaterMetersService } from 'src/app/core/services/backend-services/water-meters.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { UnitVM } from 'src/app/core/view-models/unit-vm';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 27; // from pages table in database seeding table
@Component({
  selector: 'app-water-meters',
  templateUrl: './water-meters.component.html',
  styleUrls: ['./water-meters.component.scss'],
})
export class WaterMetersComponent implements OnInit, OnDestroy {
  changeWaterMetersFlag: number = 0;
  //#region Main Declarations
  WaterMeterForm!: FormGroup;
  buildingsList: Building[] = [];
  unitsList: UnitVM[] = [];

  sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;

  addUrl: string = '/control-panel/maintenance/add-water-meter';
  updateUrl: string = '/control-panel/maintenance/update-water-meter/';
  listUrl: string = '/control-panel/maintenance/water-meters-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.water-meters',
    componentAdd: 'water-meters.add-water-meter',
  };

  submited: boolean = false;
  Response!: ResponseResult<WaterMeters>;

  //#endregion

  //#region Constructor
  constructor(
    private waterMetersService: WaterMetersService,
    private buildingsService: BuildingsService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private unitsService: UnitsService
  ) {
    this.defineWaterMeterForm();
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
          this.sharedServices.changeButton({
            action: 'Update',
            submitMode: false,
          } as ToolbarData);
          this.toolbarPathData.componentAdd = 'water-meters.update-water-meter';
          this.getWaterMeterById(this.id);
        }
      } else {
      }
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

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  defineWaterMeterForm() {
    this.WaterMeterForm = this.fb.group({
      id: 0,
      buildingId: ['', Validators.compose([Validators.required])],
      unitId: '',
      meterNumber: ['', Validators.compose([Validators.required])],
      accountNumber: ['', Validators.compose([Validators.required])],
      subscriptionNumber: ['', Validators.compose([Validators.required])],
      description: '',
    });
  }
  lang
  getLanguage() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
    });
  }
  loadData() {
    this.getLanguage();
    this.sharedServices.changeButton({
      action: 'Save',
      submitMode: false,
    } as ToolbarData);
    this.getPagePermissions(PAGEID);
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
    this.getBuildings();
    this.getUnitsForRent();
  }

  getBuildings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.buildingsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.buildingsList = res.data.map((res: Building[]) => {
            return res;
          });
          resolve();
          //(("res", res);
          //((" this.buildingsList", this.buildingsList);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }

  //#endregion

  //#region CRUD Operations

  getUnitsForRent() {
    let buildingId = this.WaterMeterForm.value.buildingId;
    const promise = new Promise<void>((resolve, reject) => {
      this.unitsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          if (buildingId != null && buildingId > 0) {
            this.unitsList = res.data
              .filter(
                (x) =>
                 ( x.purposeType == pursposeTypeEnum['For Rent']
                 || x.purposeType==pursposeTypeEnum['For Sell and Rent']
                 )           
                 &&
                  x.buildingId == buildingId
              )
              .map((res: UnitVM[]) => {
                return res;
              });
          } else {
            this.unitsList = res.data
              .filter((x) => x.purposeType == pursposeTypeEnum['For Rent']
              || x.purposeType==pursposeTypeEnum['For Sell and Rent']
              )
              .map((res: UnitVM[]) => {
                return res;
              });
          }
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });

    return promise;
  }
  getWaterMeterById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.waterMetersService.getById(id).subscribe({
        next: (res: any) => {
          this.WaterMeterForm.setValue({
            id: res.data.id,
            buildingId: res.data.buildingId,
            unitId: res.data.unitId,
            meterNumber: res.data.meterNumber,
            accountNumber: res.data.accountNumber,
            subscriptionNumber: res.data.subscriptionNumber,
            description: res.data.description,
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
    this.submited = true;
    if (this.WaterMeterForm.valid) {
      this.WaterMeterForm.value.id = this.id;
       this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.waterMetersService
          .addWithUrl('Insert', this.WaterMeterForm.value)
          .subscribe({
            next: (result: any) => {
              this.spinner.show();
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeWaterMetersFlag++;
                  setTimeout(() => {
                    this.spinner.hide();
                    this.showResponseMessage(
                      this.Response.success,
                      AlertTypes.success,
                      this.translate.transform('messages-add-success')
                    );
                    this.navigateUrl(this.listUrl);
                  }, 500);
                } else if (result.isFound) {
                  this.spinner.hide();
                  this.checkResponseMessages(result.message);
                }
              }
            },
            error: (err: any) => {
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
      return this.WaterMeterForm.markAllAsTouched();
    }
  }

  onUpdate() {
    this.submited = true;
    if (this.WaterMeterForm.value != null) {
      const promise = new Promise<void>((resolve, reject) => {
        this.waterMetersService
          .updateWithUrl('Update', this.WaterMeterForm.value)
          .subscribe({
            next: (result: any) => {
              this.spinner.show();
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeWaterMetersFlag++;
                  setTimeout(() => {
                    this.spinner.hide();
                    this.showResponseMessage(
                      result.success,
                      AlertTypes.success,
                     this.translate.transform("messages.update-success")
                    );
                    this.navigateUrl(this.addUrl);
                  }, 500);
                } else if (result.isFound) {
                  this.spinner.hide();
                  this.checkResponseMessages(result.message);
                }
              }
            },
            error: (err: any) => {
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
      return this.WaterMeterForm.markAllAsTouched();
    }
  }
  //#endregion

  //#region Helper Functions

  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        message,
        this.translate.transform('messages.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        message,
        this.translate.transform('messages.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        message,
        this.translate.transform('messages.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        message,
        this.translate.transform('messages.error')
      );
    }
  }
  checkResponseMessages(message: string) {
    let responseStatus = true;
    switch (message) {
      case 'NameAr':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          this.translate.transform('messages.nameAr-exist')
        );
        break;
      case 'NameEn':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          this.translate.transform('messages.nameEn-exist')
        );
        break;
      case 'Code':
        this.showResponseMessage(
          responseStatus,
          AlertTypes.warning,
          this.translate.transform('messages.office-code-exist')
        );
        break;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.WaterMeterForm.controls;
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
            this.toolbarPathData.componentAdd = 'water-meters.add-water-meter';
            this.router.navigate([this.addUrl]);
            //this.defineWaterMeterForm();
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
