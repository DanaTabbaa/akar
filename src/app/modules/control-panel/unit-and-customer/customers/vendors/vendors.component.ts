import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cities } from 'src/app/core/models/cities';
import { Countries } from 'src/app/core/models/countries';
import { Nationality } from 'src/app/core/models/nationality';
import { Region } from 'src/app/core/models/regions';
import { District } from 'src/app/core/models/district';
import { VendorsService } from 'src/app/core/services/backend-services/vendors.service';
import { Owner } from 'src/app/core/models/owners';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { Subscription } from 'rxjs'
import { DateModel } from 'src/app/core/view-models/date-model';
import { EMAIL_REQUIRED_VALIDATORS, EMAIL_VALIDATORS, FAX_VALIDATORS, MOBILE_REQUIRED_VALIDATORS, MOBILE_VALIDATORS, PHONE_VALIDATORS, Phone_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Vendors } from 'src/app/core/models/vendors';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID = 11; // from pages table in database seeding table
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})
export class VendorsComponent implements OnInit, OnDestroy {


  //#region Main Declarations
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-vendor';
  updateUrl: string = '/control-panel/definitions/update-vendor/';
  listUrl: string = '/control-panel/definitions/vendors-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-vendors",
    componentAdd: "component-names.add-vendor",
  };
  VendorForm!: FormGroup;
  nationalities: Nationality[] = [];
  owners: Owner[] = [];
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  //Response:ResponseResult<Vendors> = new ResponseResult<Vendors>();

  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  //submitted: boolean = false;

  //#endregion

  //#region Constructor
  constructor(
    private vendorsService: VendorsService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private store: Store<any>,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private managerService: ManagerService
  ) {
    this.defineVendorForm();
  }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem("PageId", PAGEID.toString());

    this.loadData();


  }


  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {

          this.getVendorById(this.id).then(a => {
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", params["id"]);
          }).catch(e => {
            this.spinner.hide();
          });

        } else {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        }
      }
      else {
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
      }

    });
    this.subsList.push(sub);
  }
  //#endregion
  lang
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

  //#region Authentications

  //#endregion

  //#region Permissions

  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  loadData() {
    this.spinner.show()
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadNationalities(),
      this.managerService.loadOwners(),
      this.managerService.loadCountries(),
      this.managerService.loadRegions(),
      this.managerService.loadCities(),
      this.managerService.loadDistricts(),

    ]).then(a => {
      this.nationalities = this.managerService.getNationalities();
      this.countries = this.managerService.getCountries();
      this.owners = this.managerService.getOwners();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    })
  }

  defineVendorForm() {
    this.VendorForm = this.fb.group({
      id: 0,
      vendorNumber: ['', Validators.compose([Validators.required])],
      nameAr: ['', Validators.compose([Validators.required])],
      nameEn: ['', Validators.compose([Validators.required])],
      phone: Phone_REQUIRED_VALIDATORS,
      mobile: MOBILE_REQUIRED_VALIDATORS,
      fax: FAX_VALIDATORS,
      email: EMAIL_REQUIRED_VALIDATORS,
      identityNo: '',
      productionPlaceOfIdenity: '',
      nationalityId: '',
      jobTitle: '',
      productionDateIdentity: '',
      expireDateOfNationalIdNumber: '',
      ownerId: ['', Validators.compose([Validators.required])],
      addressCountryId: '',
      addressRegionId: '',
      addressCityId: '',
      addressDistrictId: '',
      addressBlockNumber: '',
      addressApartmentNumber: '',
      addressPostalCode: '',
      addressAdditionalCode: '',
      address: '',
    });
    this.productionDateIdentity = this.dateService.getCurrentDate();
    this.expireDateOfNationalIdNumber = this.dateService.getCurrentDate();

  }
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe(res => {
        resolve();
        this.lang = res
      }, err => {
        resolve();
      });
      this.subsList.push(sub);
    });
  }
  // getCountries() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.CountriesService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.countries = res.data.map((res: Countries[]) => {
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
  //   });
  //   return promise;
  // }

  // getRegions(countryId?: any) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.RegionsService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         if(countryId!=null)
  //         {
  //           this.regions = res.data.filter((x) => x.countryId == countryId).map((res: Region[]) => {
  //             return res;
  //           });
  //         }else{
  //           this.regions = res.data.map((res: Region[]) => {
  //             return res;
  //           });
  //         }

  //         resolve();

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

  // getCities(regionId?: any) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.CitiesService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //        if(regionId!=null)
  //        {
  //         this.cities = res.data
  //         .filter((x) => x.regionId == regionId)
  //         .map((res: Cities[]) => {
  //           return res;
  //         });
  //        }else{
  //         this.cities = res.data.map((res: Cities[]) => {
  //           return res;
  //         });
  //        }
  //         resolve();

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

  // getDistricts(cityId?: any) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.DistrictsService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         if(cityId!=null)
  //         {
  //           this.districts = res.data
  //           .filter((x) => x.cityId == cityId)
  //           .map((res: District[]) => {
  //             return res;
  //           });
  //         }else{
  //           this.districts = res.data.map((res: District[]) => {
  //             return res;
  //           });
  //         }
  //         resolve();

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
  // getNationalities() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.NationalityService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.nationalities = res.data.map((res: NationalityVM[]) => {
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
  //   });
  //   return promise;
  // }
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

  //#endregion

  //#region CRUD Operations

  getVendorById(id: any) {

    return new Promise<void>((resolve, reject) => {
      let sub = this.vendorsService.getWithResponse<Vendors>("GetById?id=" + id).subscribe({
        next: (res: ResponseResult<Vendors>) => {
          resolve();
          if (res.data) {
            this.VendorForm.setValue({
              id: this.id,
              vendorNumber: res.data.vendorNumber,
              nameAr: res.data.nameAr,
              nameEn: res.data.nameEn,
              phone: res.data.phone,
              mobile: res.data.mobile,
              fax: res.data.fax,
              email: res.data.email,
              identityNo: res.data.identityNo,
              productionPlaceOfIdenity: res.data.productionPlaceOfIdenity,
              nationalityId: res.data.nationalityId,
              jobTitle: res.data.jobTitle,
              productionDateIdentity: res.data.productionDateIdentity,
              expireDateOfNationalIdNumber: res.data.expireDateOfNationalIdNumber,
              addressCountryId: res.data.addressCountryId,
              addressRegionId: res.data.addressRegionId,
              addressCityId: res.data.addressCityId,
              addressDistrictId: res.data.addressDistrictId,
              addressBlockNumber: res.data.addressBlockNumber,
              addressApartmentNumber: res.data.addressApartmentNumber,
              addressPostalCode: res.data.addressPostalCode,
              addressAdditionalCode: res.data.addressAdditionalCode + '',
              address: res.data.address,
              ownerId: res.data.ownerId,
            });
            this.onChangeCountry(res.data.countryId);
            this.onChangeRegion(res.data.regionId);
            this.onChangeCity(res.data.cityId);
            this.expireDateOfNationalIdNumber = this.dateService.getDateForCalender(res.data.expireDateOfNationalIdNumber);
            this.productionDateIdentity = this.dateService.getDateForCalender(res.data.productionDateIdentity);
          }



        },
        error: (err: any) => {
          //reject(err);
          resolve();
        },
        complete: () => {

        },
      });
      this.subsList.push(sub);
    });

  }

  onChangeCountry(countryId: any) {
    this.regions = this.managerService.getRegions().filter((x) => x.countryId == countryId);
  }
  onChangeRegion(regionId: any) {
    this.cities = this.managerService.getCities().filter(x => x.regionId == regionId);
  }
  onChangeCity(cityId: any) {
    this.districts = this.managerService.getDistricts().filter(x => x.cityId == cityId);
  }

  onSave() {
    if (this.VendorForm.valid) {
      if (this.id == 0) {

        this.VendorForm.value.expireDateOfNationalIdNumber = this.dateService.getDateForInsertISO_Format(this.expireDateOfNationalIdNumber);
        this.VendorForm.value.productionDateIdentity = this.dateService.getDateForInsertISO_Format(this.productionDateIdentity)
        this.spinner.show();
        this.confirmSave().then(a => {
          this.spinner.hide();
        }).catch(e => {
          this.spinner.hide();
        });

      }
    }
    else {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })

      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.VendorForm.markAllAsTouched();
    }
  }


  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.vendorsService.addWithResponse<Vendors>('AddWithCheck?uniques=NameAr&uniques=NameEn&uniques=VendorNumber', this.VendorForm.value).subscribe({
        next: (result) => {
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
          } else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.add-failed")
            );
          }
        },

        error: ((e) => {
          resolve();
        })

      });
      this.subsList.push(sub);
    });

  }

  onUpdate() {
    if (this.VendorForm.value != null && this.VendorForm.valid) {
      this.spinner.show();
      this.VendorForm.value.expireDateOfNationalIdNumber = this.dateService.getDateForInsertISO_Format(this.expireDateOfNationalIdNumber);
      this.VendorForm.value.productionDateIdentity = this.dateService.getDateForInsertISO_Format(this.productionDateIdentity)
      this.confirmUpdate().then(a=>{
        this.spinner.hide();
      }).catch(e=>{
        this.spinner.hide();
      });
    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.VendorForm.markAllAsTouched();
    }

  }

  confirmUpdate() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.vendorsService.updateWithUrl("UpdateWithCheck?uniques=NameAr&uniques=NameEn&uniques=VendorNumber", this.VendorForm.value).subscribe({
        next: (result: ResponseResult<Vendors>) => {
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
          } else {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.add-failed")
            );
          }


        },
        error: (e) => {
          resolve();
        },
      });
      this.subsList.push(sub);
    });

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
  get f(): { [key: string]: AbstractControl } {
    return this.VendorForm.controls;
  }

  //#endregion

  //#region Toolbar

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
            this.toolbarPathData.componentAdd = "component-names.add-vendor";
            this.defineVendorForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate([this.addUrl]);
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

  //#region Date Picker
  expireDateOfNationalIdNumber!: DateModel;
  productionDateIdentity!: DateModel;
  isProductionDateIdentityGreater: boolean = false;
  onSelectExpireDateOfNationalId: boolean = false;
  getExpireDateOfNationalIdNumber(selectedDate: DateModel) {
    this.isProductionDateIdentityGreater =
      this.dateService.compareStartDateIsGreater(
        this.productionDateIdentity,
        selectedDate
      );
    if (this.isProductionDateIdentityGreater == false) {
      this.onSelectExpireDateOfNationalId = true;
      this.expireDateOfNationalIdNumber = selectedDate;
    } else {
      this.onSelectExpireDateOfNationalId = false;
    }

  }
  getProductionDateIdentity(selectedDate: DateModel) {
    this.productionDateIdentity = selectedDate;
  }

  //#endregion

}
