import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertTypes,
  convertEnumToArray,
  pursposeTypeArEnum,
  pursposeTypeEnum,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Building } from 'src/app/core/models/buildings';
import { UnitsVM } from 'src/app/core/models/ViewModel/units-vm';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { UnitsTypesVM } from 'src/app/core/models/ViewModel/units-types-vm';
import { Office } from 'src/app/core/models/offices';
import { Owner } from 'src/app/core/models/owners';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { Unit } from 'src/app/core/models/units';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Floor } from 'src/app/core/models/floors';
import { BuildingFloor } from 'src/app/core/models/buildings-floors';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { SystemSettings } from 'src/app/core/models/system-settings';
import { NewCode } from 'src/app/core/view-models/new-code';

const PAGEID = 5; // from pages table in database seeding table
@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit, OnDestroy, AfterViewInit {
  currnetUrl: any;
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
  //properties
  lang: string = '';
  unitForm!: FormGroup;
  buildings: Building[] = [];
  floors: Floor[] = [];
  buildingFloor: BuildingFloor[] = [];
  offices: Office[] = [];
  owners: Owner[] = [];
  errorMessage = '';
  errorClass = '';
  id: any = 0;
  units: UnitsVM[] = [];
  unitsTypes: UnitsTypesVM[] = [];
  purposeTypes: ICustomEnum[] = [];
  selectedPurposeTypes: ICustomEnum[] = [];
  sellMeterPrice: any;
  sellPrice: any;
  rentMeterPrice: any;
  rentPrice: any;
  sellAreaSize: any;
  rentAreaSize: any;
  taxRatio: any;
  taxAmount: any;
  insurranceRatio: any;
  insurranceAmount: any;
  propertyType = 1;
  systemSetting: SystemSettings = new SystemSettings();  
  showOfferInformation: boolean = false;
  showGarageInformation: boolean = false;
  public gfg2 = false;
  public gfg = false;
  public gfg3 = false;
  public gfg4 = false;
  public gfg5 = false;
  public gfg6 = false;
  activeId: any = 2;
  //constructor
  constructor(
    private unitsService: UnitsService,
    private router: Router,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private managerService: ManagerService
  ) {
    this.createUnitForm();
  }

  createUnitForm() {
    this.unitForm = this.fb.group({
      id: 0,
      code: [
        '',
        Validators.compose([Validators.required]),
      ],
      unitNameAr: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(25)]),
      ],
      unitNameEn: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(25)]),
      ],
      unitTypeId: ['', Validators.compose([Validators.required])],
      purposeType: [1, Validators.compose([Validators.required])],
      buildingId: ['', Validators.compose([Validators.required])],
      floorId: ['', Validators.compose([Validators.required])],
      readyForSell: false,
      sellMeterPrice: '',
      sellAreaSize: '',
      sellPrice: '',
      officeId: '',
      ownerId: '',
      isFeatured: false,
      hasGarage: false,
      hasPriceOffer: false,
      rentMeterPrice: '',
      rentAreaSize: '',
      rentPrice: '',
      garageArea: '',
      vehiclesCount: '',
      customGarageCount: '',
      taxRatio: '',
      taxAmount: '',
      insurranceRatio: '',
      insurranceAmount: '',
      offerPrice: '',
      offerDescription: '',
      unitStatus: '',
    });

    // this.onPurposeTypeChange(this.unitForm.value.purposeType);

  }
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
    this.managerService.destroy();
  }
  //
  //ngOnInit
  ngOnInit(): void {

    localStorage.setItem("PageId", PAGEID.toString());
    this.loadData();

  }

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        if (this.id > 0) {
          //localStorage.setItem("RecordId", params["id"]);
          this.getUnitById(this.id).then(a => {
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", params["id"]);
          }).catch(err => {
            this.spinner.hide();
          });
        }
        else {
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
          this.spinner.hide();
        }
      }
      else {


        this.getNewCode().then(newCode=>{
          this.spinner.hide();          
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
          this.unitForm.controls['code'].setValue(newCode);
        }).catch(e=>{
          this.spinner.hide();
        });
        
      }
    });
    this.subsList.push(sub);
  }


  //
  //#region Helper Functions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
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
  //     this.subsList.push(sub);
  //   });


  // }
  //#endregion

  //methods
  url!: string;
  loadData() {

    this.currnetUrl = this.router.url;
    this.lang = localStorage.getItem('language')!;
    this.getPurposeTypes();

    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadUnitTypes(),
      this.managerService.loadOffices(),
      this.managerService.loadOwners(),
      this.managerService.loadBuildings(),
      this.managerService.loadFloors(),
      this.managerService.loadSystemSettings()
    ]).then(a => {
      this.getSystemSettings();
      this.unitsTypes = this.managerService.getUnitTypes();
      this.offices = this.managerService.getOffices();
      this.owners = this.managerService.getOwners();
      this.buildings = this.managerService.getBuildings();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    }).catch((err) => {

      this.spinner.hide();
    })

  }

  // getRouteData(){
  //   let sub = this.route.params.subscribe((params) => {

  //     if (params["id"]) {
  //       this.getUnitById(params["id"]);
  //       this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
  //     }
  //     this.url = this.router.url.split('/')[2];
  //   });

  //   this.subsList.push(sub);
  // }
  getLanguage() {
    return new Promise<void>((acc, rejs) => {
      let sub = this.sharedServices.getLanguage().subscribe(res => {
        this.lang = res;
        acc();
      }, err => {
        acc();
      });

      this.subsList.push(sub);
    })

  }
  getSystemSettings() {

    if (this.managerService.getSystemSettings().length) {

      this.systemSetting = this.managerService.getSystemSettings()[0];
      // this.showDecimalPoint = this.managerService.getSystemSettings()[0].showDecimalPoint;
      // this.showThousandsComma = this.managerService.getSystemSettings()[0].showThousandsComma;
      // this.showRoundingFractions = this.managerService.getSystemSettings()[0].showRoundingFractions;
      // this.numberOfFraction = this.managerService.getSystemSettings()[0].numberOfFraction;
    }


    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.systemSettingsService.getAll("GetAll").subscribe({
    //     next: (res: any) => {

    //       resolve();

    //     },
    //     error: (err: any) => {
    //       reject(err);
    //     },
    //     complete: () => {

    //     },
    //   });
    //   this.subsList.push(sub);
    // });

  }
  getPurposeTypes() {
    if (this.lang == 'en') {
      this.purposeTypes = convertEnumToArray(pursposeTypeEnum);
    }
    else {
      this.purposeTypes = convertEnumToArray(pursposeTypeArEnum);

    }
  }
  // getBuildings() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.BuildingsService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.buildings = res.data.map((res: BuildingVM[]) => {
  //           return res;
  //         });
  //         resolve();
  //         //(('res', res);
  //         //((' this.buildings', this.buildings);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {
  //
  //       },
  //     });
  //   });
  //   return promise;
  // }
  // getFloors() {
  //   ///view
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.BuildingsFloorsService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.BuildingFloor = res.data
  //           .filter((x) => x.buildingId == this.UnitForm.value.buildingId)
  //           .map((res: []) => {
  //             return res;
  //           });
  //         resolve();
  //         //(('res', res);
  //       console.log(' this.BuildingFloor', this.BuildingFloor);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });
  //   return promise;
  // }

  getSellPrice() {
    if (
      this.unitForm.value.sellMeterPrice != '' &&
      this.unitForm.value.sellAreaSize != ''
    ) {
      this.sellPrice =
        Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (this.sellMeterPrice * this.sellAreaSize).toFixed(this.systemSetting.numberOfFraction)
          : this.sellMeterPrice * this.sellAreaSize)
    } else {
      this.sellPrice = '';
    }
  }
  getRentPrice() {
    if (
      this.unitForm.value.rentMeterPrice != '' &&
      this.unitForm.value.rentAreaSize != ''
    ) {
      ;
      this.rentPrice =
        Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (this.rentMeterPrice * this.rentAreaSize).toFixed(this.systemSetting.numberOfFraction)
          : this.rentMeterPrice * this.rentAreaSize)
    } else {
      this.rentPrice = '';
      this.unitForm.value.rentPrice = '';

    }
  }
  getTaxValue() {
    if (this.rentPrice != '' && this.taxRatio != '') {
      this.taxAmount =
        Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? ((this.rentPrice * this.taxRatio) / 100).toFixed(this.systemSetting.numberOfFraction)
          : (this.rentPrice * this.taxRatio) / 100)
    }
  }
  getInsuranceValue() {
    if (this.rentPrice != '' && this.insurranceRatio != '') {
      this.insurranceAmount =
        Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? ((this.rentPrice * this.insurranceRatio) / 100).toFixed(this.systemSetting.numberOfFraction)
          : (this.rentPrice * this.insurranceRatio) / 100)

    }
  }






  submited: boolean = false;



  onUpdate() {
    this.submited = true;
    if (this.unitForm.value != null) {
      this.unitForm.value.purposeType = this.preparePurposeForInsert();
      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });

    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.unitForm.markAllAsTouched();

    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.unitsService.updateWithUrl("UpdateWithCheck?uniques=Code&uniques=UnitNameAr&uniques=UnitNameEn", this.unitForm.value).subscribe({
        next: (result: ResponseResult<Unit>) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              this.translate.transform("messages.update-success")
            );
            navigateUrl(this.listUrl, this.router);

          } else if (result.isFound) {

            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.update-failed")
            );
          }

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
  onSave() {
    this.submited = true;
    if (this.unitForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      this.unitForm.value.purposeType = this.preparePurposeForInsert();


      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });

    }
    else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })

      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.unitForm.markAllAsTouched();
    }
  }

  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.unitsService.addWithResponse<Unit>("AddWithCheck?uniques=Code&uniques=UnitNameAr&uniques=UnitNameEn",
        this.unitForm.value).subscribe({
          next: (result: ResponseResult<Unit>) => {
            resolve();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success, AlertTypes.success, this.translate.transform("messages.add-success")
              );
              navigateUrl(this.listUrl, this.router);
            } else if (result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform("messages.record-exsiting")
              );
            }
            else {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.add-failed")
              );
            }
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
  // getFloors() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.FloorsService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.floorSearch = res.data.map((res: Floor[]) => {
  //           return res;
  //         });
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //     this.subsList.push(sub);
  //   });

  // }
  getUnitById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.unitsService.getWithResponse<Unit>("getbyId?Id=" + id).subscribe({
        next: (res: ResponseResult<Unit>) => {
          resolve();
          if (res.data) {
            if (res.data.purposeType.includes("1")) {
              this.showRentInfoTab = true
              this.showSellInfoTab = false

            }
            else if (res.data.purposeType.includes("2")) {
              this.showSellInfoTab = true
              this.showRentInfoTab = false

            }
            //this.unitObj = { ...res.data }
            this.onSelectBuilding(res.data.buildingId);
            if (res.data.purposeType) {
              this.preparePurposeForView(res.data.purposeType);
            }
            this.unitForm.setValue({
              id: res.data.id,
              code: res.data.code,
              unitNameAr: res.data.unitNameAr,
              unitNameEn: res.data.unitNameEn,
              purposeType: res.data.purposeType,
              unitTypeId: res.data.unitTypeId,
              buildingId: res.data.buildingId,
              readyForSell: res.data.readyForSell,
              sellMeterPrice: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.sellMeterPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.sellMeterPrice),
              sellAreaSize: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.sellAreaSize ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.sellAreaSize),
              sellPrice: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.sellPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.sellPrice),
              officeId: res.data.officeId,
              ownerId: res.data.ownerId,
              isFeatured: res.data.isFeatured,
              hasGarage: res.data.hasGarage,
              hasPriceOffer: res.data.hasPriceOffer,
              rentMeterPrice: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.rentMeterPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.rentMeterPrice),
              rentAreaSize: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.rentAreaSize ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.rentAreaSize),
              rentPrice: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.rentPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.rentPrice),
              garageArea: res.data.garageArea,
              vehiclesCount: res.data.vehiclesCount,
              customGarageCount: res.data.customGarageCount,
              taxRatio: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.taxRatio ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.taxRatio),
              taxAmount: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.taxAmount ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.taxAmount),
              insurranceRatio: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.insurranceRatio ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.insurranceRatio),
              insurranceAmount: Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.insurranceAmount ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.insurranceAmount),
              floorId: res.data.floorId,
              offerPrice: res.data.offerPrice,
              offerDescription: res.data.offerDescription,
              unitStatus: res.data.unitStatus,
            });
            this.sellMeterPrice =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.sellMeterPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.sellMeterPrice)
            this.sellAreaSize =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.sellAreaSize ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.sellAreaSize)

            this.sellPrice =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.sellPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.sellPrice)

            this.rentMeterPrice =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.rentMeterPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.rentMeterPrice)
            this.rentPrice =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.rentPrice ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.rentPrice)
            this.taxRatio =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.taxRatio ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.taxRatio)
            this.taxAmount =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.taxAmount ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.taxAmount)
            this.insurranceRatio =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.insurranceRatio ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.insurranceRatio)
            this.insurranceAmount =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.insurranceAmount ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.insurranceAmount)
            this.rentAreaSize =
              Number(this.systemSetting.showDecimalPoint == true && this.systemSetting.numberOfFraction > 0 ? (res.data.rentAreaSize ?? 0).toFixed(this.systemSetting.numberOfFraction)
                : res.data.rentAreaSize)
            this.garageInformationChange();
            this.offerInformationChange();
          }

          //this.getOffices();


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
  //new!: boolean;
  // toggleButton() {
  //   this.add = false;
  //   this.update = this.new = !this.add;
  // }
  showResponseMessage(responseStatus, alertType, message) {

    if (responseStatus == true && AlertTypes.success == alertType) {

      this.alertsService.showSuccess(message, this.translate.transform('messageTitle.done'));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, 'Alert');
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, 'info');
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, 'error');
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.unitForm.controls;
  }

  offerInformationChange() {
    if (this.unitForm.value.hasPriceOffer == true) {
      this.showOfferInformation = true;
    } else {
      this.showOfferInformation = false;
    }
  }
  garageInformationChange() {
    if (this.unitForm.value.hasGarage == true) {
      this.showGarageInformation = true;
    } else {
      this.showGarageInformation = false;
    }
  }
  showRentInfoTab: boolean = false;
  showSellInfoTab: boolean = false;
  onPurposeTypeChange() {
     
    this.showRentInfoTab = false;
    this.showSellInfoTab = false;
    if(this.selectedPurposeTypes){
      if (this.selectedPurposeTypes.find(x=>x.id == 1 || x.id == 3)) {
        this.showRentInfoTab = true;
      } 
      if(this.selectedPurposeTypes.find(x=>x.id == 2  || x.id == 4)) {
        this.showSellInfoTab = true;
      }
    }
    
    
  }

  //

  //#region Toolbar Service
  /////tabulator

  //
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        //currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-unit";
            //this.defineUnitForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            navigateUrl(this.addUrl, this.router);
          } else if (
            currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
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
  //#endregion

  onSelectBuilding(buidingId: any) {
    let building = this.buildings.find(x => x.id == (buidingId ?? this.unitForm.value.buildingId));
    if (building) {
      console.log(this.unitForm.value.buildingId);
      this.floors = [];
      this.unitForm.controls['floorId'].setValue(null);

      if (building.floorIds) {
        building.floorIds.split(",").forEach(f => {
          let floor = this.managerService.getFloors().find(x => x.id == f);
          if (floor) {
            this.floors.push(floor);
          }

        });
      }

    }

  }

  ngAfterViewInit(): void {

  }

  preparePurposeForInsert() {
    return this.selectedPurposeTypes.reduce((p, c, i) => {
      if (i == this.purposeTypes.length - 1) {
        return p + (c.id + "");
      }
      return p + (c.id + ",");
    }
      , "");
  }

  preparePurposeForView(purpose: string) {
    this.selectedPurposeTypes = [];
    purpose.split(",").forEach(p => {
      let purpose = this.purposeTypes.find(x => x.id?.toString() == p);
      if (purpose) {
        this.selectedPurposeTypes.push(purpose);
      }
    });
  }


  getNewCode(){
    return new Promise<string>((resolve,reject)=>{
      let sub = this.unitsService.getWithResponse<NewCode[]>("GetNewCode").subscribe({
        next:(res)=>{
          
          let newCode:string = "";
          if(res.data && res.data.length){
             newCode = res.data[0].code;
          }
          resolve(newCode);
          
          
        },
        error:(err)=>{
          resolve('');
        },
        complete:()=>{}
      });
      this.subsList.push(sub);
    });
    
  }
}
