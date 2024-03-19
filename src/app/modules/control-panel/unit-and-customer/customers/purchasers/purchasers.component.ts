import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  accountType,
  AlertTypes,
  convertEnumToArray,
  RegisterationTypeEnum,
  RegisterationTypeArEnum,
  ToolbarActions,
  delegationTypeEnum,
  delegationTypeArEnum,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Cities } from 'src/app/core/models/cities';
import { CompaniesActivities } from 'src/app/core/models/companies-activities';
import { Countries } from 'src/app/core/models/countries';
import { Nationality } from 'src/app/core/models/nationality';
import { Region } from 'src/app/core/models/regions';

import { District } from 'src/app/core/models/district';
import { PurchasersService } from 'src/app/core/services/backend-services/purchasers.service';
import { Owner } from 'src/app/core/models/owners';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import {
  EMAIL_REQUIRED_VALIDATORS,
  EMAIL_VALIDATORS,
  MOBILE_REQUIRED_VALIDATORS,
  MOBILE_VALIDATORS,
  NAME_REQUIRED_VALIDATORS,
  NAME_VALIDATORS,
  Phone_REQUIRED_VALIDATORS,
} from 'src/app/core/constants/input-validators';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Purchasers } from 'src/app/core/models/purchasers';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Accounts } from 'src/app/core/models/accounts';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { ResponsiblePersonsComponent } from '../../responsible-persons/responsible-persons.component';
import { ResponsiblePersons } from 'src/app/core/models/responsible-persons';
const PAGEID = 15; // from pages table in database seeding table
@Component({
  selector: 'app-purchasers',
  templateUrl: './purchasers.component.html',
  styleUrls: ['./purchasers.component.scss'],
})
export class PurchasersComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  purchasersForm!: FormGroup;
  lang: string = '';
  errorMessage = '';
  errorClass = '';
  regsiterTypes: ICustomEnum[] = [];
  delegationTypes: ICustomEnum[] = [];
  nationalities: Nationality[] = [];
  owners: Owner[] = [];
  companiesActivities: CompaniesActivities[] = [];
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  purchaserAccounts: Accounts[] = [];

  id: any = 0;
  url: any;
  //submited: boolean = false;
  currnetUrl;
  addUrl: string = '/control-panel/definitions/add-purchaser';
  updateUrl: string = '/control-panel/definitions/update-purchaser/';
  listUrl: string = '/control-panel/definitions/purchasers-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-purchasers',
    componentAdd: 'component-names.add-purchaser',
  };
  Response!: ResponseResult<Purchasers>;

  //#endregion

  //#region Constructor
  constructor(
    private translate: TranslatePipe,
    private purchasersService: PurchasersService,
    private dateService: DateConverterService,
    private alertsService: NotificationsAlertsService,
    private spinner: NgxSpinnerService,
    private sharedServices: SharedService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private quickModalServices: QuickModalService,
  ) {
    this.createPurchaserForm();
  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.loadData();
    this.listenToResponsibleListData();
  }

  showButtonOftion(formcontrol: any) {

  }


  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getPurchaserById(this.id).then(a => {
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
            localStorage.setItem("RecordId", params["id"]);
          }).catch(e => {
            this.spinner.hide();
          });
        }
        else {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        }
      } else {
        this.spinner.hide();
        this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
      }

    });
    this.subsList.push(sub);
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
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe(res => {
        this.lang = res;
        resolve();
      }, err => {
        resolve();
      });
      this.subsList.push(sub);
    });

  }
  //#region Permissions
  // rolePermission!:RolesPermissionsVm;
  // userPermissions!:UserPermission;
  // getPagePermissions(pageId)
  // {
  //   const promise = new Promise<void>((resolve, reject) => {
  //       this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId="+pageId).subscribe({
  //         next: (res: any) => {
  //           this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //            this.userPermissions=JSON.parse(this.rolePermission.permissionJson);
  //            this.sharedServices.setUserPermissions(this.userPermissions);
  //           resolve();

  //         },
  //        error: (err: any) => {
  //           this.spinner.hide();
  //           reject(err);
  //         },
  //         complete: () => {

  //         },
  //       });
  //     });
  //     return promise;

  // }
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data

  getAccounts() {
    this.purchaserAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Purchases)
    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.store.select(AccountsSelectors.selectors.getListSelector).subscribe({
    //     next: (res: AccountsModel) => {

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
  //         this.regions = res.data
  //           .filter((x) => x.countryId == countryId)
  //           .map((res: Region[]) => {
  //             return res;
  //           });
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
  //         this.cities = res.data
  //           .filter((x) => x.regionId == regionId)
  //           .map((res: Cities[]) => {
  //             return res;
  //           });
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
  //         this.districts = res.data
  //           .filter((x) => x.cityId == cityId)
  //           .map((res: District[]) => {
  //             return res;
  //           });
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
  getRegisterTypes() {
    if (this.lang == 'en') {
      this.regsiterTypes = convertEnumToArray(RegisterationTypeEnum);
    }
    else {
      this.regsiterTypes = convertEnumToArray(RegisterationTypeArEnum);
    }
  }
  getDelegationTypes() {
    if (this.lang == 'en') {
      this.delegationTypes = convertEnumToArray(delegationTypeEnum);
    }
    else {
      this.delegationTypes = convertEnumToArray(delegationTypeArEnum);

    }
  }

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
  // getCompanyActivities() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.CompaniesActivitiesService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.companiesActivities = res.data.map(
  //           (res: CompaniesActivitiesVM[]) => {
  //             return res;
  //           }
  //         );
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
  createPurchaserForm() {
    this.purchasersForm = this.fb.group({
      id: 0,
      registrationTypeId: ['', Validators.compose([Validators.required])],
      purchaserNumber: ['', Validators.compose([Validators.required])],
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
      phone: Phone_REQUIRED_VALIDATORS,
      mobile: MOBILE_REQUIRED_VALIDATORS,
      fax: MOBILE_VALIDATORS,
      email: EMAIL_REQUIRED_VALIDATORS,
      identityNo: '',
      productionPlaceOfIdenity: '',
      nationalityId: '',
      jobTitle: '',
      productionDateIdentity: '',
      expireDateOfNationalIdNumber: '',
      // companyNameAr: NAME_VALIDATORS,
      // companyNameEn: NAME_VALIDATORS,
      companyNameAr: '',
      companyNameEn: '',
      isConnectWithWaterAndElectric: false,
      numberWaterAcc: '',
      numberElectricAcc: '',
      //ownerId: ['', Validators.compose([Validators.required])],
      ownerId:'',
      companyActivityId: '',
      // companyPhone: MOBILE_VALIDATORS,
      // companyMobile: MOBILE_VALIDATORS,
      companyPhone: '',
      companyMobile: '',
      //companyFax: MOBILE_VALIDATORS,
      companyFax: '',
      companyPostalBoxNumber: '',
      commercialRegisterNumber: '',
      taxNumber: '',
      commercialRegisterDate: '',
      commercialRegisterExpireDate: '',
      commercialRegisterPlace: '',
      // companyEmail: EMAIL_VALIDATORS,
      // responsibleNameAr: NAME_VALIDATORS,
      // responsibleNameEn: NAME_VALIDATORS,
      // respoMobile: MOBILE_VALIDATORS,


      companyEmail: '',
      responsibleNameAr: '',
      responsibleNameEn: '',
      respoMobile: '',
      respoIdentityNo: '',
      respoIdentityDate: '',
      respoIdentityExpireDate: '',
      respoIdentityPlace: '',
      respoJob: '',
      // signNameAr: NAME_VALIDATORS,
      // signNameEn: NAME_VALIDATORS,
      // signMobile: MOBILE_VALIDATORS,

      signNameAr: '',
      signNameEn: '',
      signMobile: '',
      signatureNationalId: '',
      signIdentityDate: '',
      signatureIdentityend: '',
      signatureIdentityPlace: '',
      delegationType: '',
      addressCountryId: '',
      addressRegionId: '',
      addressCityId: '',
      addressDistrictId: '',
      addressBlockNumber: '',
      addressApartmentNumber: '',
      addressPostalCode: '',
      addressAdditionalCode: '',
      address: '',
      purchaserAccountId: '',
      responsiblePersons: []
    });
    this.productionDateIdentity = this.dateService.getCurrentDate();
    this.signatureIdentityEnd = this.dateService.getCurrentDate();
    this.signIdentityDate = this.dateService.getCurrentDate();
    this.respoIdentityExpireDate = this.dateService.getCurrentDate();
    this.respoIdentityDate = this.dateService.getCurrentDate();
    this.expireDateOfNationalIdNumber = this.dateService.getCurrentDate();
    this.commercialRegisterDate = this.dateService.getCurrentDate();
    this.commercialRegisterExpireDate = this.dateService.getCurrentDate();
  }
  loadData() {

    localStorage.setItem("PageId", PAGEID.toString());
    this.getRegisterTypes();
    this.getDelegationTypes();

    this.spinner.show();
    Promise.all([this.getLanguage(),
    this.managerService.loadPagePermissions(PAGEID),
    this.managerService.loadNationalities(),
    this.managerService.loadOwners(),
    this.managerService.loadCompanyActivities(),
    this.managerService.loadCountries(),
    this.managerService.loadRegions(),
    this.managerService.loadCities(),
    this.managerService.loadDistricts(),
    ]).then(a => {
      this.nationalities = this.managerService.getNationalities();
      this.owners = this.managerService.getOwners();
      this.companiesActivities = this.managerService.getCompanyActivities();
      this.countries = this.managerService.getCountries();

      this.getAccounts();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    });

  }
  //#endregion

  //#region CRUD Operations
  getPurchaserById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.purchasersService.getWithResponse<Purchasers>("GetById?id=" + id + "&includes=ResponsiblePersons").subscribe({
        next: (res: ResponseResult<Purchasers>) => {
          resolve();
          if (res.data) {
            this.purchasersForm.setValue({
              id: this.id,
              registrationTypeId: res.data.registrationTypeId,
              purchaserNumber: res.data.purchaserNumber,
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
              companyNameAr: res.data.companyNameAr,
              companyNameEn: res.data.companyNameEn,
              isConnectWithWaterAndElectric:
                res.data.isConnectWithWaterAndElectric,
              numberWaterAcc: res.data.numberWaterAcc,
              numberElectricAcc: res.data.numberElectricAcc,
              //  officeId:res.data.officeId+'',
              companyActivityId: res.data.companyActivityId || null,
              companyPhone: res.data.companyPhone,
              companyMobile: res.data.companyMobile,
              companyFax: res.data.companyFax,
              companyPostalBoxNumber: res.data.companyPostalBoxNumber || null,
              commercialRegisterNumber: res.data.commercialRegisterNumber,
              taxNumber: res.data.taxNumber,
              commercialRegisterDate: res.data.commercialRegisterDate,
              commercialRegisterExpireDate:
                res.data.commercialRegisterExpireDate || null,
              commercialRegisterPlace: res.data.commercialRegisterPlace,
              companyEmail: res.data.companyEmail,
              responsibleNameAr: res.data.responsibleNameAr,
              responsibleNameEn: res.data.responsibleNameEn,
              respoMobile: res.data.respoMobile,
              respoIdentityNo: res.data.respoIdentityNo,
              respoIdentityDate: res.data.respoIdentityDate || null,
              respoIdentityExpireDate: res.data.respoIdentityExpireDate || null,
              respoIdentityPlace: res.data.respoIdentityPlace,
              respoJob: res.data.respoJob,
              signNameAr: res.data.signNameAr,
              signNameEn: res.data.signNameEn,
              signMobile: res.data.signMobile,
              signatureNationalId: res.data.signatureNationalId,
              signIdentityDate: res.data.signIdentityDate || null,
              signatureIdentityend: res.data.signatureIdentityend || null,
              signatureIdentityPlace: res.data.signatureIdentityPlace || null,
              delegationType: res.data.delegationType || null,
              addressCountryId: res.data.addressCountryId,
              addressRegionId: res.data.addressRegionId,
              addressCityId: res.data.addressCityId,
              addressDistrictId: res.data.addressDistrictId,
              addressBlockNumber: res.data.addressBlockNumber,
              addressApartmentNumber: res.data.addressApartmentNumber,
              addressPostalCode: res.data.addressPostalCode,
              addressAdditionalCode: res.data.addressAdditionalCode || null,
              address: res.data.address,
              ownerId: res.data.ownerId,
              purchaserAccountId: res.data.purchaserAccountId,
              responsiblePersons:res.data.responsiblePersons
            });

            this.onChangeCountry(res.data.addressCountryId);
            this.onChangeRegion(res.data.addressRegionId);
            this.onChangeCity(res.data.addressCityId);
            this.productionDateIdentity = this.dateService.getDateForCalender(
              res.data.productionDateIdentity
            );
            (this.signatureIdentityEnd = this.dateService.getDateForCalender(
              res.data.signatureIdentityEnd
            )),
              (this.signIdentityDate = this.dateService.getDateForCalender(
                res.data.signIdentityDate
              )),
              (this.respoIdentityExpireDate = this.dateService.getDateForCalender(
                res.data.respoIdentityExpireDate
              )),
              (this.respoIdentityDate = this.dateService.getDateForCalender(
                res.data.respoIdentityDate
              )),
              (this.expireDateOfNationalIdNumber =
                this.dateService.getDateForCalender(
                  res.data.expireDateOfNationalIdNumber ||
                  this.expireDateOfNationalIdNumber
                )),
              (this.commercialRegisterDate = this.dateService.getDateForCalender(
                res.data.commercialRegisterDate
              )),
              (this.commercialRegisterExpireDate =
                this.dateService.getDateForCalender(
                  res.data.commercialRegisterExpireDate
                ));

            this.sharedServices.setResponsibleListData(res.data.responsiblePersons);

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

  onSave() {
    //this.submited = true;
    if (this.purchasersForm.valid) {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      this.spinner.show();
      this.purchasersForm.value.id = this.id;
      this.purchasersForm.value.productionDateIdentity =
        this.dateService.getDateForInsertISO_Format(
          this.productionDateIdentity
        );
      this.purchasersForm.value.signatureIdentityEnd =
        this.dateService.getDateForInsertISO_Format(this.signatureIdentityEnd);
      this.purchasersForm.value.signIdentityDate =
        this.dateService.getDateForInsertISO_Format(this.signIdentityDate);
      this.purchasersForm.value.respoIdentityDate =
        this.dateService.getDateForInsertISO_Format(this.respoIdentityDate);

      this.purchasersForm.value.commercialRegisterDate =
        this.dateService.getDateForInsertISO_Format(
          this.commercialRegisterDate
        );
      this.purchasersForm.value.commercialRegisterExpireDate =
        this.dateService.getDateForInsertISO_Format(
          this.commercialRegisterExpireDate
        );


      this.purchasersForm.value.responsiblePersons = this.responsiblePersons;
      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    } else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.purchasersForm.markAllAsTouched();
    }
  }

  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.purchasersService.addWithResponse<Purchasers>(
        'AddWithCheck?uniques=NameAr&uniques=NameEn',
        this.purchasersForm.value
      ).subscribe({
        next: (result: ResponseResult<Purchasers>) => {
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

  onUpdate() {
    //this.submited = true;
    if (this.purchasersForm.value != null && this.purchasersForm.valid) {
      this.spinner.show();
      this.purchasersForm.value.productionDateIdentity =
        this.dateService.getDateForInsertISO_Format(
          this.productionDateIdentity
        );
      this.purchasersForm.value.signatureIdentityEnd =
        this.dateService.getDateForInsertISO_Format(this.signatureIdentityEnd);
      this.purchasersForm.value.signIdentityDate =
        this.dateService.getDateForInsertISO_Format(this.signIdentityDate);
      this.purchasersForm.value.respoIdentityDate =
        this.dateService.getDateForInsertISO_Format(this.respoIdentityDate);
      this.purchasersForm.value.expireDateOfNationalIdNumber =
        this.dateService.getDateForInsertISO_Format(
          this.expireDateOfNationalIdNumber
        );
      this.purchasersForm.value.commercialRegisterDate =
        this.dateService.getDateForInsertISO_Format(
          this.commercialRegisterDate
        );
      this.purchasersForm.value.commercialRegisterExpireDate =
        this.dateService.getDateForInsertISO_Format(
          this.commercialRegisterExpireDate
        );

      this.purchasersForm.value.responsiblePersons = this.responsiblePersons;
      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });

    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.purchasersForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.purchasersService.updateWithUrl("UpdateWithCheck?uniques=NameAr&uniques=NameEn", this.purchasersForm.value).subscribe({
        next: (result: ResponseResult<Purchasers>) => {
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
              AlertTypes.error,
              this.translate.transform("messages.update-failed")
            );

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

  //#endregion

  //#region Helper Functions
  get f(): { [key: string]: AbstractControl } {
    return this.purchasersForm.controls;
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

  //#endregion

  //#region Date Picker

  productionDateIdentity!: DateModel;
  signatureIdentityEnd!: DateModel;
  signIdentityDate!: DateModel;
  respoIdentityExpireDate!: DateModel;
  respoIdentityDate!: DateModel;
  expireDateOfNationalIdNumber!: DateModel;
  commercialRegisterExpireDate!: DateModel;
  commercialRegisterDate!: DateModel;
  isProductionDateIdentityGreater: boolean = false;
  isCommercialRegisterGreater: boolean = false;
  isSignatureIdentityEndGreater: boolean = false;
  isRespoIdentityExpireDateGreater: boolean = false;
  onSelectRespoIdentityExpireDate: boolean = false;
  onSelectExpireDateOfNationalId: boolean = false;
  onSelectCommercialRegisterExpireDate: boolean = false;
  onSelectSignatureIdentityEnd: boolean = false;
  getProductionDateIdentity(selectedDate: DateModel) {
    this.productionDateIdentity = selectedDate;
  }

  getSignatureIdentityEnd(selectedDate: DateModel) {
    this.isSignatureIdentityEndGreater =
      this.dateService.compareStartDateIsGreater(
        this.productionDateIdentity,
        selectedDate
      );
    if (this.isSignatureIdentityEndGreater == false) {
      this.onSelectSignatureIdentityEnd = true;
      this.signatureIdentityEnd = selectedDate;
    } else {
      this.onSelectSignatureIdentityEnd = false;
    }
  }
  getSignIdentityDate(selectedDate: DateModel) {
    this.signIdentityDate = selectedDate;
  }

  getRespoIdentityExpireDate(selectedDate: DateModel) {
    this.isRespoIdentityExpireDateGreater =
      this.dateService.compareStartDateIsGreater(
        this.productionDateIdentity,
        selectedDate
      );
    if (this.isRespoIdentityExpireDateGreater == false) {
      this.onSelectRespoIdentityExpireDate = true;
      this.respoIdentityExpireDate = selectedDate;
    } else {
      this.onSelectRespoIdentityExpireDate = false;
    }
  }
  getRespoIdentityDate(selectedDate: DateModel) {
    this.respoIdentityDate = selectedDate;
  }

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

  getCommercialRegisterExpireDate(selectedDate: DateModel) {
    this.isCommercialRegisterGreater =
      this.dateService.compareStartDateIsGreater(
        this.productionDateIdentity,
        selectedDate
      );
    if (this.isCommercialRegisterGreater == false) {
      this.onSelectCommercialRegisterExpireDate = true;
      this.commercialRegisterExpireDate = selectedDate;
    } else {
      this.onSelectCommercialRegisterExpireDate = false;
    }
  }
  getCommercialRegisterDate(selectedDate: DateModel) {
    this.commercialRegisterDate = selectedDate;
  }
  //#endregion
  //#region Toolbar
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = 'component-names.add-purchaser';
            this.createPurchaserForm();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate([this.addUrl]);
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

  onChangeCountry(countryId: any) {
    this.regions = this.managerService.getRegions().filter((x) => x.countryId == countryId);
  }
  onChangeRegion(regionId: any) {
    this.cities = this.managerService.getCities().filter(x => x.regionId == regionId);
  }
  onChangeCity(cityId: any) {
    this.districts = this.managerService.getDistricts().filter(x => x.cityId == cityId);
  }

  //#endregion



  openQuickModal() {

    let sub = this.quickModalServices
      .showDialog(ResponsiblePersonsComponent)
      .subscribe((d) => {
      });
    this.subsList.push(sub);
  }
  responsiblePersons: ResponsiblePersons[] = []
  listenToResponsibleListData() {
    let sub = this.sharedServices.getResponsibleListData().subscribe({
      next: (responsiblePersons: ResponsiblePersons[]) => {
        this.responsiblePersons = [];
        if (responsiblePersons.length > 0) {
          this.responsiblePersons.push(...responsiblePersons)
        }
      },
    });
    this.subsList.push(sub);
  }

  onRegisterationTypeChange(e: any) {   
    let comRegControl = this.purchasersForm.get('commercialRegisterNumber')
    if (e) {
      if (e.id == 1) {
        comRegControl?.clearValidators();
        comRegControl?.updateValueAndValidity();
      }
      else if (e.id == 2) {
        comRegControl?.setValidators(Validators.compose([Validators.required]));
      }
    }
  }

  
  getCommRegDate(selectedDate: DateModel) {
    this.commercialRegisterDate = selectedDate;
  }

  getCommRegEndDate(selectedDate: DateModel) {
    this.commercialRegisterExpireDate = selectedDate;
  }
}
