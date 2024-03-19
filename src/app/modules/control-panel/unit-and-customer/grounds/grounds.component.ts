import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Owner } from 'src/app/core/models/owners';
import { GroundsService } from 'src/app/core/services/backend-services/grounds.service';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import {
  AlertTypes,
  convertEnumToArray,
  pursposeTypeArEnum,
  pursposeTypeEnum,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { Office } from 'src/app/core/models/offices';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Ground } from 'src/app/core/models/grounds';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { Subscription } from 'rxjs';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { TranslatePipe } from '@ngx-translate/core';
import { OwnerSelectors } from 'src/app/core/stores/selectors/owners.selectors';
import { Store } from '@ngrx/store';
import { OwnersModel } from 'src/app/core/stores/store.model.ts/owner.store.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { OfficeModel } from 'src/app/core/stores/store.model.ts/office.store.model';
import { OfficeSelectors } from 'src/app/core/stores/selectors/office.selectors';
import { Cities } from 'src/app/core/models/cities';
import { Region } from 'src/app/core/models/regions';
import { District } from 'src/app/core/models/district';
import { CitiesModel } from 'src/app/core/stores/store.model.ts/cities.store.model';
import { CitySelectors } from 'src/app/core/stores/selectors/city.selectors';
import { RegionsModel } from 'src/app/core/stores/store.model.ts/regions.store.model';
import { RegionSelectors } from 'src/app/core/stores/selectors/region.selectors';
import { DistrictSelectors } from 'src/app/core/stores/selectors/district.selectors';
import { DistrictModel } from 'src/app/core/stores/store.model.ts/district.store.model';
import { CountriesModel } from 'src/app/core/stores/store.model.ts/countries.store.model';
import { CountrySelectors } from 'src/app/core/stores/selectors/country.selectors';
import { Countries } from 'src/app/core/models/countries';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';

const PAGEID = 9; // from pages table in database seeding table
@Component({
  selector: 'app-grounds',
  templateUrl: './grounds.component.html',
  styleUrls: ['./grounds.component.scss'],
})
export class GroundsComponent implements OnInit, OnDestroy {
  //#region properties
  lang: string = '';
  groundsForm!: FormGroup;
  purposeTypes: ICustomEnum[] = [];
  offices: Office[] = [];
  owners: Owner[] = [];
  sub: any;
  sellSpace: any;
  meterPrice: any;
  sellPrice: any;
  id: any = 0;
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;
  //Response!: ResponseResult<Ground>;
  //groundObj!: Ground;
  cities: Cities[] = [];
  //searchCities: Cities[] = [];

  regions: Region[] = [];
  //searchRegions: Region[] = [];

  districts: District[] = [];
  //searchDistricts: District[] = [];
  countries: Countries[] = [];
  //searchCountries: Countries[] = [];
  url: any;
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number;
  sellPurposeType = pursposeTypeEnum['For Sell']
  //#endregion
  //constructor
  constructor(
    private groundsService: GroundsService,
    private router: Router,
    private sharedServices: SharedService,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<any>,
    private rolesPerimssionsService: RolesPermissionsService,
    private spinner: NgxSpinnerService,
    private SystemSettingsService: SystemSettingsService,
    private managerService: ManagerService

  ) {
    this.defineGroundForm();
  }
  defineGroundForm() {
    this.groundsForm = this.fb.group({
      id: 0,
      groundNameAr: ['', Validators.compose([Validators.required])],
      groundNameEn: ['', Validators.compose([Validators.required])],
      purposeType: ['', Validators.compose([Validators.required])],
      ownerId: ['', Validators.compose([Validators.required])],
      areaSize: ['', Validators.compose([Validators.required])],
      readyForSale: false,
      meterPrice: '',
      sellSpace: '',
      sellPrice: { value: '', disabled: true },
      officeId: '',
      borderEast: '',
      borderWest: '',
      borderSouth: '',
      borderNorth: '',
      notes: '',
      countryId: '',
      regionId: '',
      cityId: '',
      districtId: '',
      propertyInstrument: '',
      addressInDetails: '',
      previousOwnerNameAr: '',
      previousOwnerNameEn: '',
      noPlanned: '',
    });
  }
  //
  //ngOnInit
  ngOnInit(): void {
    localStorage.setItem("PageId", PAGEID.toString());
    this.loadData();
  }
  //
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
  //#endregion
  //methods
  loadData() {
    this.lang = localStorage.getItem('language')!;
    this.getPurposeTypes();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadSystemSettings(),
      this.managerService.loadOffices(),
      this.managerService.loadOwners(),
      this.managerService.loadCountries(),
      this.managerService.loadRegions(),
      this.managerService.loadCities(),
      this.managerService.loadDistricts(),
    ]).then(a => {
      this.getSystemSettings();
      this.offices = this.managerService.getOffices();
      this.owners = this.managerService.getOwners();
      this.countries = this.managerService.getCountries();

      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();

    }).catch((err) => {
      this.spinner.hide();
    })
  }

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.getGroundById(params["id"]).then(a => {
          this.spinner.hide();
          localStorage.setItem("RecordId", params["id"]);
          this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
        }).catch(e => {
          this.spinner.hide();
        });

      }
      else {
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        this.spinner.hide();
      }
      // this.url = this.router.url.split('/')[2];
    });
    this.subsList.push(sub);
  }
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      this.sharedServices.getLanguage().subscribe(res => {
        this.lang = res;
        resolve();
      }, err => {
        resolve();
      });
    });

  }

  //#region Helper Functions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedServices.setUserPermissions(this.userPermissions);
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         this.spinner.hide();
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });
  //   return promise;

  // }
  //#endregion

  // getCountries() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(CountrySelectors.selectors.getListSelector).subscribe({
  //       next: (res: CountriesModel) => {
  //         this.countries = JSON.parse(JSON.stringify(res.list));

  //         resolve();

  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {
  //         resolve();
  //       },
  //     });
  //     this.subsList.push(sub);
  //   });

  // }
  // getRegions() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(RegionSelectors.selectors.getListSelector).subscribe({
  //       next: (res: RegionsModel) => {
  //         this.searchRegions = JSON.parse(JSON.stringify(res.list));

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
  // getCities() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(CitySelectors.selectors.getListSelector).subscribe({
  //       next: (res: CitiesModel) => {
  //         this.searchCities = JSON.parse(JSON.stringify(res.list));
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
  // getDistricts() {

  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(DistrictSelectors.selectors.getListSelector).subscribe({
  //       next: (res: DistrictModel) => {
  //         this.searchDistricts = JSON.parse(JSON.stringify(res.list));
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         //reject(err);
  //         resolve();
  //       },
  //       complete: () => {

  //       },
  //     });
  //     this.subsList.push(sub);
  //   });

  // }
  getPurposeTypes() {
    if (this.lang == 'en') {
      this.purposeTypes = convertEnumToArray(pursposeTypeEnum);
    }
    else {
      this.purposeTypes = convertEnumToArray(pursposeTypeArEnum);

    }
  }
  getSellPrice() {

    if (this.meterPrice != undefined && this.sellSpace != undefined) {
      this.sellPrice =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.meterPrice * this.sellSpace).toFixed(this.numberOfFraction)
          : this.meterPrice * this.sellSpace)
    } else {
      this.sellPrice = 0;
    }
  }
  getSystemSettings() {

    if (this.managerService.getSystemSettings().length) {
      this.showDecimalPoint = this.managerService.getSystemSettings()[0].showDecimalPoint
      this.showThousandsComma = this.managerService.getSystemSettings()[0].showThousandsComma
      this.showRoundingFractions = this.managerService.getSystemSettings()[0].showRoundingFractions
      this.numberOfFraction = this.managerService.getSystemSettings()[0].numberOfFraction

    }

    // const promise = new Promise<void>((resolve, reject) => {
    //   this.SystemSettingsService.getAll("GetAll").subscribe({
    //     next: (res: any) => {


    //     },
    //     error: (err: any) => {
    //       reject(err);
    //     },
    //     complete: () => {

    //     },
    //   });
    // });
    // return promise;
  }
  // getOwners() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(OwnerSelectors.selectors.getListSelector).subscribe({
  //       next: (res: OwnersModel) => {
  //         this.owners = JSON.parse(JSON.stringify(res.list))
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
  // getOffices() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(OfficeSelectors.selectors.getListSelector).subscribe({
  //       next: (res: OfficeModel) => {
  //         this.offices = JSON.parse(JSON.stringify(res.list))
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
  onSave() {

    this.submited = true;
    if (this.groundsForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      this.groundsForm.controls["sellPrice"].enable();
      this.groundsForm.value.id = 0;
      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    } else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.groundsForm.markAllAsTouched();
    }
  }

  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.groundsService.addWithResponse<Ground>('AddWithCheck?uniques=GroundNameAr&uniques=GroundNameEn', this.groundsForm.value)
        .subscribe({
          next: (result: ResponseResult<Ground>) => {
            //this.Response = { ...result.response };
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
            else{
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.add-failed")
              );
            }

            
          }, error: err => {
            resolve();
          },
          complete: () => {

          }
        }
        );
      this.subsList.push(sub);
    });

  }
  onUpdate() {
    if (this.groundsForm.value != null) {
      this.groundsForm.controls["sellPrice"].enable();
      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.groundsForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.groundsService.updateWithUrl("UpdateWithCheck?uniques=GroundNameAr&uniques=GroundNameEn", 
      this.groundsForm.value).subscribe({
        next:(result:ResponseResult<Ground>) => {          
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
          else{
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.update-failed")
            );
          }
        },error: err => {
          resolve();
        },
        complete:()=>{}
      
      });
      this.subsList.push(sub);
    })

  }
  getGroundById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.groundsService.getWithResponse<Ground>("getbyId?Id=" + id).subscribe({
        next: (res: ResponseResult<Ground>) => {

          resolve();
          //this.groundObj = { ...res.data };
          if (res.data) {
            this.groundsForm.setValue({
              id: res.data.id,
              groundNameAr: res.data.groundNameAr,
              groundNameEn: res.data.groundNameEn,
              purposeType: res.data.purposeType,
              ownerId: res.data.ownerId,
              areaSize: res.data.areaSize,
              readyForSale: res.data.readyForSale,
              meterPrice: res.data.meterPrice,
              sellSpace: res.data.sellSpace,
              sellPrice: res.data.sellPrice,
              officeId: res.data.officeId,
              borderEast: res.data.borderEast,
              borderWest: res.data.borderWest,
              borderSouth: res.data.borderSouth,
              borderNorth: res.data.borderNorth,
              notes: res.data.notes,
              countryId: res.data.countryId,
              regionId: res.data.regionId,
              cityId: res.data.cityId,
              districtId: res.data.districtId,
              propertyInstrument: res.data.propertyInstrument,
              addressInDetails: res.data.addressInDetails,
              previousOwnerNameAr: res.data.previousOwnerNameAr,
              previousOwnerNameEn: res.data.previousOwnerNameEn,
              noPlanned: res.data.noPlanned,
            });
            this.onChangeCountry(res.data.countryId);
            this.onChangeRegion(res.data.regionId);
            this.onChangeCity(res.data.cityId)

            this.meterPrice = res.data.meterPrice;
            this.sellPrice = res.data.sellPrice;
            this.sellSpace = res.data.sellSpace;
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
  get f(): { [key: string]: AbstractControl } {
    return this.groundsForm.controls;
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
  //
  addUrl: string = '/control-panel/definitions/add-ground';
  updateUrl: string = '/control-panel/definitions/update-ground/';
  listUrl: string = '/control-panel/definitions/grounds-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: this.listUrl,
    addPath: '',
    updatePath: this.updateUrl,
    componentList: "component-names.list-grounds",
    componentAdd: "component-names.add-ground",
  };
  //#region Toolbar Service
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
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-ground";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.groundsForm.reset();
            this.router.navigate([this.addUrl]);
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            if (this.groundsForm.valid) {
              this.onUpdate();
            }
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

  onChangeCountry(countryId: any) {

    this.regions = this.managerService.getRegions().filter(x => x.countryId == countryId);
  }

  onChangeRegion(regionId: any) {
    this.cities = this.managerService.getCities().filter(x => x.regionId == regionId);
  }

  onChangeCity(cityId: any) {
    this.districts = this.managerService.getDistricts().filter(x => x.cityId == cityId);
  }

}
