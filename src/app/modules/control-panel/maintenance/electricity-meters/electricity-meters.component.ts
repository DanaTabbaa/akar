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
  convertEnumToArray,
  ElectricityMeterTypeEnum,
  pursposeTypeEnum,
  pursposeTypeArEnum,
  ToolbarActions,
  ElectricityMeterTypeArEnum,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Building } from 'src/app/core/models/buildings';
import { ElectricityMeters } from 'src/app/core/models/electricity-meters';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { ElectricityMetersService } from 'src/app/core/services/backend-services/electricity-meters.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { UnitVM } from 'src/app/core/view-models/unit-vm';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 26; // from pages table in database seeding table
@Component({
  selector: 'app-electricity-meters',
  templateUrl: './electricity-meters.component.html',
  styleUrls: ['./electricity-meters.component.scss'],
})
export class ElectricityMetersComponent implements OnInit, OnDestroy {
  changeElectricityMetersFlag: number = 0;
  //#region Main Declarations
  electricityMeterForm!: FormGroup;
  buildingsList: Building[] = [];
  electricityMetersTypes: ICustomEnum[] = [];
  unitsList: UnitVM[] = [];
  lang: string = '';
  sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;

  addUrl: string = '/control-panel/maintenance/add-electricity-meter';
  updateUrl: string = '/control-panel/maintenance/update-electricity/';
  listUrl: string = '/control-panel/maintenance/electricity-meters-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.electricity-meters',
    componentAdd: 'electricity-meters.add-electricity-meter',
  };

  submited: boolean = false;
  Response!: ResponseResult<ElectricityMeters>;

  //#endregion

  //#region Constructor
  constructor(
    private electricityMetersService: ElectricityMetersService,
    private buildingsService: BuildingsService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private spinner: NgxSpinnerService,
    private rolesPerimssionsService: RolesPermissionsService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private unitsService: UnitsService
  ) {
    this.defineElectricityMeterForm();
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
          localStorage.setItem('RecordId', params['id']);
          this.toolbarPathData.componentAdd =
            'electricity-meters.update-electricity-meter';
          this.sharedServices.changeButton({
            action: 'Update',
            submitMode: false,
          } as ToolbarData);
          this.getElectricityMeterById(this.id);
        }
      } else {
        this.sharedServices.changeButton({
          action: 'SinglePage',
          submitMode: false,
        } as ToolbarData);
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
    localStorage.removeItem('PageId');
    localStorage.removeItem('RecordId');
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
  defineElectricityMeterForm() {
    this.electricityMeterForm = this.fb.group({
      id: 0,
      typeId: ['', Validators.compose([Validators.required])],
      buildingId: ['', Validators.compose([Validators.required])],
      unitId: '',
      meterNumber: ['', Validators.compose([Validators.required])],
      accountNumber: ['', Validators.compose([Validators.required])],
      subscriptionNumber: ['', Validators.compose([Validators.required])],
      capacity: '',
      description: '',
    });
  }

  loadData() {
    this.getPagePermissions(PAGEID);
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.getElectricityMetersTypes(),
      this.getBuildings(),
      this.getUnitsForRent(),
    ]).then((a) => {
      this.spinner.hide();
    });
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
    });
  }
  getElectricityMetersTypes() {
    if (this.lang == 'en') {
      this.electricityMetersTypes = convertEnumToArray(
        ElectricityMeterTypeEnum
      );
    } else {
      this.electricityMetersTypes = convertEnumToArray(
        ElectricityMeterTypeArEnum
      );
    }
  }
  getBuildings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.buildingsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.buildingsList = res.data.map((res: Building[]) => {
            return res;
          });
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

  //#endregion

  //#region CRUD Operations

  getUnitsForRent() {
    let buildingId = this.electricityMeterForm.value.buildingId;
    const promise = new Promise<void>((resolve, reject) => {
      this.unitsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          if (buildingId != null && buildingId > 0) {
            this.unitsList = res.data
              .filter(
                (x) =>
                x.buildingId == buildingId
              
                  &&
                  (x.purposeType == pursposeTypeEnum['For Rent'] ||
                  x.purposeType ==pursposeTypeEnum['For Sell and Rent'])
              )
              .map((res: UnitVM[]) => {
                return res;
              });
          } else {
            this.unitsList = res.data
              .filter((x) => x.purposeType == pursposeTypeEnum['For Rent']
                || x.purposeType ==pursposeTypeEnum['For Sell and Rent'])
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
  getElectricityMeterById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.electricityMetersService.getById(id).subscribe({
        next: (res: any) => {
          //(("result data getbyid", res.data);
          this.electricityMeterForm.setValue({
            id: this.id,
            buildingId: res.data.buildingId,
            unitId: res.data.unitId,
            typeId: res.data.typeId,
            meterNumber: res.data.meterNumber,
            accountNumber: res.data.accountNumber,
            subscriptionNumber: res.data.subscriptionNumber,
            capacity: res.data.capacity,
            description: res.data.description,
          });

          //(("this.electricityMeterForm.value set value", this.electricityMeterForm.value)
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
    if (this.electricityMeterForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.electricityMeterForm.value.id = this.id;
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.electricityMetersService
          .addWithUrl('insert', this.electricityMeterForm.value)
          .subscribe({
            next: (result: any) => {

              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeElectricityMetersFlag++;


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
              this.spinner.hide();
              reject(err);
            },
            complete: () => {},
          });
      });
      return promise;
    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.electricityMeterForm.markAllAsTouched();
    }
  }

  onUpdate() {
    this.spinner.show();
    if (this.electricityMeterForm.value != null) {
      //(("this.electricityMeterForm.value on update", this.electricityMeterForm.value);
      const promise = new Promise<void>((resolve, reject) => {
        this.electricityMetersService
          .updateWithUrl("Update",this.electricityMeterForm.value)
          .subscribe({
            next: (result: any) => {
             
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.changeElectricityMetersFlag++;

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
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.electricityMeterForm.markAllAsTouched();
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
    return this.electricityMeterForm.controls;
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
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd =
              'electricity-meters.add-electricity-meter';
            this.router.navigate([this.addUrl]);
            this.defineElectricityMeterForm();
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
