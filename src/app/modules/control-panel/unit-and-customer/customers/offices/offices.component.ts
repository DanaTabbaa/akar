import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
  delegationTypeEnum,
  delegationTypeArEnum,
  RegisterationTypeArEnum,
  RegisterationTypeEnum,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Cities } from 'src/app/core/models/cities';
import { CompaniesActivities } from 'src/app/core/models/companies-activities';
import { Countries } from 'src/app/core/models/countries';
import { Nationality } from 'src/app/core/models/nationality';
import { Region } from 'src/app/core/models/regions';
import { OfficesService } from 'src/app/core/services/backend-services/offices.service';
import { District } from 'src/app/core/models/district';
import { Office } from 'src/app/core/models/offices';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Subscription } from 'rxjs';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import {
  EMAIL_REQUIRED_VALIDATORS,
  EMAIL_VALIDATORS,
  FAX_VALIDATORS,
  MOBILE_REQUIRED_VALIDATORS,
  MOBILE_VALIDATORS,
  PHONE_VALIDATORS,
  Phone_REQUIRED_VALIDATORS,
} from 'src/app/core/constants/input-validators';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Accounts } from 'src/app/core/models/accounts';
import { Owner } from 'src/app/core/models/owners';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { navigateUrl } from 'src/app/core/helpers/helper';
const PAGEID = 13; // from pages table in database seeding table
@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
})
export class OfficesComponent implements OnInit, OnDestroy, AfterViewInit {
  //#region Main Declarations
  officeForm!: FormGroup;
  regsiterTypes: ICustomEnum[] = [];
  delegationTypes: ICustomEnum[] = [];
  nationalities: Nationality[] = [];
  offices: Office[] = [];
  owners: Owner[] = [];
  lang: string = '';
  companiesActivities: CompaniesActivities[] = [];
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  officeAccounts: Accounts[] = [];
  //sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;

  addUrl: string = '/control-panel/definitions/add-office';
  updateUrl: string = '/control-panel/definitions/update-office/';
  listUrl: string = '/control-panel/definitions/offices-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-offices',
    componentAdd: 'component-names.add-office',
  };

  submited: boolean = false;
  //Response!: ResponseResult<Office>;

  //#endregion

  //#region Constructor
  constructor(
    private officesService: OfficesService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private managerService: ManagerService
  ) {
    this.createOfficeForm();
  }

  ngAfterViewInit(): void {

  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {




    this.loadData();

  }

  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {

          this.getOfficeById(this.id).then(a => {
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
    localStorage.removeItem('PageId');
    localStorage.removeItem('RecordId');

    this.managerService.destroy();
  }

  //#endregion

  //#region Authentications

  //#endregion

  //#region Permissions
  //#region Helper Functions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService
  //       .getAll('GetPagePermissionById?pageId=' + pageId)
  //       .subscribe({
  //         next: (res: any) => {
  //           this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //           this.userPermissions = JSON.parse(
  //             this.rolePermission.permissionJson
  //           );
  //           this.sharedServices.setUserPermissions(this.userPermissions);
  //           resolve();
  //         },
  //         error: (err: any) => {
  //           this.spinner.hide();
  //           reject(err);
  //         },
  //         complete: () => { },
  //       });
  //   });
  //   return promise;
  // }
  //#endregion
  //#endregion

  //#region  State Management
  //#endregion
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe((res) => {
        this.lang = res;
        resolve();
      }, err => {
        resolve();
      });
      this.subsList.push(sub);
    });

  }
  //#region Basic Data
  ///Geting form dropdown list data
  createOfficeForm() {
    this.officeForm = this.fb.group({
      id: 0,
      registrationTypeId: '',
      officeNumber: ['', Validators.compose([Validators.required])],
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
      companyNameAr: '',
      companyNameEn: '',
      isConnectWithWaterAndElectric: false,
      numberWaterAcc: '',
      numberElectricAcc: '',
      ownerId: '',
      companyActivityId: 0,
      companyPhone: PHONE_VALIDATORS,
      companyMobile: MOBILE_VALIDATORS,
      companyFax: FAX_VALIDATORS,
      companyPostalBoxNumber: '',
      commercialRegisterNumber: ['', Validators.compose([Validators.required])],
      taxNumber: '',
      commercialRegisterDate: '',
      commercialRegisterExpireDate: '',
      commercialRegisterPlace: '',
      companyEmail: EMAIL_VALIDATORS,
      responsibleNameAr: '',
      responsibleNameEn: '',
      respoMobile: MOBILE_VALIDATORS,
      respoIdentityNo: '',
      respoIdentityDate: '',
      respoIdentityExpireDate: '',
      respoIdentityPlace: '',
      respoJob: '',
      signNameAr: '',
      signNameEn: '',
      signMobile: MOBILE_VALIDATORS,
      signatureNationalId: '',
      signIdentityDate: '',
      signatureIdentityend: '',
      signatureIdentityPlace: '',
      delegationType: 0,
      addressCountryId: '',
      addressRegionId: '',
      addressCityId: '',
      addressDistrictId: '',
      addressBlockNumber: '',
      addressApartmentNumber: '',
      addressPostalCode: '',
      addressAdditionalCode: '',
      address: '',
      officeAccountId: '',
    });
    this.productionDateIdentity = this.dateService.getCurrentDate();
    this.signatureIdentityEnd = this.dateService.getCurrentDate();
    this.signIdentityDate = this.dateService.getCurrentDate();
    this.respoIdentityExpireDate = this.dateService.getCurrentDate();
    this.respoIdentityDate = this.dateService.getCurrentDate();
    this.expireDateOfNationalIdNumber = this.dateService.getDateForCalender(
      this.productionDateIdentity.month +
      1 +
      '/' +
      this.productionDateIdentity.day +
      '/' +
      (this.productionDateIdentity.year + 1)
    );
    this.commercialRegisterDate = this.dateService.getCurrentDate();
    this.commercialRegisterExpireDate = this.dateService.getCurrentDate();
  }

  loadData() {
    //this.currnetUrl = this.router.url;
     
    this.lang = localStorage.getItem('language')!;
    localStorage.setItem("PageId", PAGEID.toString());
    this.getRegisterTypes();
    this.getDelegationTypes();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
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

    this.expireDateOfNationalIdNumber = this.dateService.getDateForCalender(
      this.productionDateIdentity.month +
      1 +
      '/' +
      (this.productionDateIdentity.day + 1) +
      '/' +
      this.productionDateIdentity.year
    );
    this.respoIdentityExpireDate = this.dateService.getDateForCalender(
      this.respoIdentityDate.month +
      1 +
      '/' +
      (this.respoIdentityDate.day + 1) +
      '/' +
      this.respoIdentityDate.year
    );
    this.commercialRegisterExpireDate = this.dateService.getDateForCalender(
      this.commercialRegisterDate.month +
      1 +
      '/' +
      (this.commercialRegisterDate.day + 1) +
      '/' +
      this.commercialRegisterDate.year
    );
    this.signatureIdentityEnd = this.dateService.getDateForCalender(
      this.signIdentityDate.month +
      1 +
      '/' +
      (this.signIdentityDate.day + 1) +
      '/' +
      this.signIdentityDate.year
    );

  }
  getAccounts() {
    if (this.managerService.getAccounts().length) {
      this.officeAccounts = this.managerService.getAccounts().filter((x) => x.accountType == accountType.Office)

    }
    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.store
    //     .select(AccountsSelectors.selectors.getListSelector)
    //     .subscribe({
    //       next: (res: AccountsModel) => {

    //         resolve();
    //       },
    //       error: (err: any) => {
    //         this.spinner.hide();
    //         reject(err);
    //       },
    //       complete: () => { },
    //     });
    //   this.subsList.push(sub);
    // });
  }
  // getCountries() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.CountriesService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         this.countries = res.data.map((res: Countries[]) => {
  //           return res;
  //         });
  //         resolve();
  //         //(("res", res);
  //         //((" this.countries", this.countries);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }
  // getRegions(countryId?: any) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.RegionsService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         if (res != null) {
  //           this.regions = res.data
  //             .filter((x) => x.countryId == countryId)
  //             .map((res: Region[]) => {
  //               return res;
  //             });
  //         } else {
  //           this.regions = res.data.map((res: Region[]) => {
  //             return res;
  //           });
  //         }

  //         resolve();
  //         //(("res", res);
  //         //((" this.regions", this.regions);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }
  // getCities(regionId?: any) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.CitiesService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         if (res != null) {
  //           this.cities = res.data
  //             .filter((x) => x.regionId == regionId)
  //             .map((res: Cities[]) => {
  //               return res;
  //             });
  //         } else {
  //           this.cities = res.data.map((res: Cities[]) => {
  //             return res;
  //           });
  //         }

  //         resolve();
  //         //(("res", res);
  //         //((" this.cities", this.cities);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }
  // getDistricts(cityId?: any) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.DistrictsService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         if (res != null) {
  //           this.districts = res.data
  //             .filter((x) => x.cityId == cityId)
  //             .map((res: District[]) => {
  //               return res;
  //             });
  //         } else {
  //           this.districts = res.data.map((res: District[]) => {
  //             return res;
  //           });
  //         }

  //         resolve();
  //         //(("res", res);
  //         //((" this.districts", this.districts);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }
  getRegisterTypes() {
    if (this.lang == 'en') {
      this.regsiterTypes = convertEnumToArray(RegisterationTypeEnum);
    } else {
      this.regsiterTypes = convertEnumToArray(RegisterationTypeArEnum);
    }
  }
  getDelegationTypes() {
    if (this.lang == 'en') {
      this.delegationTypes = convertEnumToArray(delegationTypeEnum);
    } else {
      this.delegationTypes = convertEnumToArray(delegationTypeArEnum);
    }
  }
  // getNationalities() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.NationalityService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         this.nationalities = res.data.map((res: NationalityVM[]) => {
  //           return res;
  //         });
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }
  // getOwners() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store
  //       .select(OwnerSelectors.selectors.getListSelector)
  //       .subscribe({
  //         next: (res: OwnersModel) => {
  //           this.owners = JSON.parse(JSON.stringify(res.list));
  //           resolve();
  //         },
  //         error: (err: any) => {
  //           this.spinner.hide();
  //           reject(err);
  //         },
  //         complete: () => { },
  //       });
  //     this.subsList.push(sub);
  //   });
  // }
  // getCompanyActivities() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.CompaniesActivitiesService.getAll('GetAll').subscribe({
  //       next: (res: any) => {
  //         this.companiesActivities = res.data.map(
  //           (res: CompaniesActivitiesVM[]) => {
  //             return res;
  //           }
  //         );
  //         resolve();
  //         //(("res", res);
  //         //((" this.companiesActivities", this.companiesActivities);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => { },
  //     });
  //   });
  //   return promise;
  // }

  //#endregion

  //#region CRUD Operations
  getOfficeById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.officesService.getWithResponse<Office>('GetById?id=' + id).subscribe({
        next: (res: ResponseResult<Office>) => {
          resolve();
          if (res.data) {
            this.officeForm.setValue({
              id: this.id,
              registrationTypeId: res.data.registrationTypeId,
              officeNumber: res.data.officeNumber,
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
              companyNameEn: res.data.companyNameEn || null,
              isConnectWithWaterAndElectric:
                res.data.isConnectWithWaterAndElectric,
              numberWaterAcc: res.data.numberWaterAcc || null,
              numberElectricAcc: res.data.numberElectricAcc || null,
              ownerId: res.data.ownerId || null,
              companyActivityId: res.data.companyActivityId || null,
              companyPhone: res.data.companyPhone || null,
              companyMobile: res.data.companyMobile || null,
              companyFax: res.data.companyFax || null,
              companyPostalBoxNumber: res.data.companyPostalBoxNumber || null,
              commercialRegisterNumber: res.data.commercialRegisterNumber || null,
              taxNumber: res.data.taxNumber,
              commercialRegisterDate: res.data.commercialRegisterDate || null,
              commercialRegisterExpireDate:
                res.data.commercialRegisterExpireDate || null,
              commercialRegisterPlace: res.data.commercialRegisterPlace || null,
              companyEmail: res.data.companyEmail || null,
              responsibleNameAr: res.data.responsibleNameAr || null,
              responsibleNameEn: res.data.responsibleNameEn || null,
              respoMobile: res.data.respoMobile || null,
              respoIdentityNo: res.data.respoIdentityNo || null,
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
              officeAccountId: res.data.officeAccountId,
            });
            this.onChangeCountry(res.data.addressCountryId);
            this.onChangeRegion(res.data.addressRegionId);
            this.onChangeCity(res.data.addressCityId);
            this.productionDateIdentity = this.dateService.getDateForCalender(
              res.data.productionDateIdentity
            );
            this.signatureIdentityEnd = this.dateService.getDateForCalender(
              res.data.signatureIdentityEnd
            );
            this.signIdentityDate = this.dateService.getDateForCalender(
              res.data.signIdentityDate
            );
            this.respoIdentityExpireDate = this.dateService.getDateForCalender(
              res.data.respoIdentityExpireDate
            );
            this.respoIdentityDate = this.dateService.getDateForCalender(
              res.data.respoIdentityDate
            );

            this.commercialRegisterDate = this.dateService.getDateForCalender(
              res.data.commercialRegisterDate
            );
            this.commercialRegisterExpireDate =
              this.dateService.getDateForCalender(
                res.data.commercialRegisterExpireDate
              );
            if (res.data.expireDateOfNationalIdNumber != null) {
              this.expireDateOfNationalIdNumber =
                this.dateService.getDateForCalender(
                  res.data.expireDateOfNationalIdNumber ||
                  this.expireDateOfNationalIdNumber
                );
            }
          }

        },
        error: (err: any) => {
          resolve();
        },
        complete: () => { },
      });
      this.subsList.push(sub);
    });

  }
  setDate() {
    this.officeForm.value.productionDateIdentity =
      this.dateService.getDateForInsertISO_Format(this.productionDateIdentity);
    this.officeForm.value.signatureIdentityEnd =
      this.dateService.getDateForInsertISO_Format(this.signatureIdentityEnd);
    this.officeForm.value.signIdentityDate =
      this.dateService.getDateForInsertISO_Format(this.signIdentityDate);
    this.officeForm.value.respoIdentityDate =
      this.dateService.getDateForInsertISO_Format(this.respoIdentityDate);

    this.officeForm.value.commercialRegisterDate =
      this.dateService.getDateForInsertISO_Format(this.commercialRegisterDate);
    this.officeForm.value.commercialRegisterExpireDate =
      this.dateService.getDateForInsertISO_Format(
        this.commercialRegisterExpireDate
      );
  }

  onSave() {
   
    if (this.officeForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      this.officeForm.value.id = this.id;
      this.setDate();
      this.spinner.show();
      this.confirmSave().then(a=>{
        this.spinner.hide();
      }).catch(e=>{
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
      return this.officeForm.markAllAsTouched();
    }
  }
  onUpdate() {
    if(this.officeForm.invalid){
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      this.officeForm.markAllAsTouched();
      return;
    }
    if (this.officeForm.value != null) {
      this.officeForm.value.productionDateIdentity =
        this.dateService.getDateForInsertISO_Format(
          this.productionDateIdentity
        );
      this.officeForm.value.signatureIdentityEnd =
        this.dateService.getDateForInsertISO_Format(this.signatureIdentityEnd);
      this.officeForm.value.signIdentityDate =
        this.dateService.getDateForInsertISO_Format(this.signIdentityDate);
      this.officeForm.value.respoIdentityDate =
        this.dateService.getDateForInsertISO_Format(this.respoIdentityDate);
      this.officeForm.value.expireDateOfNationalIdNumber =
        this.dateService.getDateForInsertISO_Format(
          this.expireDateOfNationalIdNumber
        );
      this.officeForm.value.commercialRegisterDate =
        this.dateService.getDateForInsertISO_Format(
          this.commercialRegisterDate
        );
      this.officeForm.value.commercialRegisterExpireDate =
        this.dateService.getDateForInsertISO_Format(
          this.commercialRegisterExpireDate
        );
      //(("this.OfficeForm.value on update",  this.OfficeForm.value);
      this.spinner.show();
      this.confirmUpdate().then(a=>{
        this.spinner.hide();
      }).catch(e=>{
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
      return this.officeForm.markAllAsTouched();
    }
  }

  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.officesService.addWithResponse<Office>('AddWithCheck?uniques=NameAr&uniques=NameEn', this.officeForm.value).subscribe({
        next: (result: ResponseResult<Office>) => {
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
        },
        error: (err: any) => {
          this.showResponseMessage(
            false,
            AlertTypes.error,
            this.translate.transform("messages.connection-error")
          );
          //reject(err);
          resolve();
        },
        complete: () => { },
      });
      this.subsList.push(sub);
    });

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

  

  confirmUpdate(){
    return new Promise<void>((resolve, reject) => {
     let sub =  this.officesService.updateWithUrl(
        'UpdateWithCheck?uniques=NameAr&uniques=NameEn',
        this.officeForm.value
      ).subscribe({
        next: (result: ResponseResult<Office>) => {
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
        },
        error: (err: any) => {
          this.showResponseMessage(
            false,
            AlertTypes.error,
            this.translate.transform("messages.connection-error")
          );
          resolve();
        },
        complete: () => { },
      });
    });
    
  }
  //#endregion

  //#region Helper Functions

  showResponseMessage(responseStatus, alertType, message) {
    let displayedMessage = this.translate.transform(message);
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        displayedMessage,
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        displayedMessage,
        this.translate.transform('messageTitle.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        displayedMessage,
        this.translate.transform('messageTitle.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        displayedMessage,
        this.translate.transform('messageTitle.error')
      );
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.officeForm.controls;
  }

  //#endregion

  //#region Tabulator
  subsList: Subscription[] = [];
  currentBtnResult;
  // listenToClickedButton() {
  //   let sub = this.sharedServices.getClickedbutton().subscribe({
  //     next: (currentBtn: ToolbarData) => {
  //       if (currentBtn != null) {
  //         if (currentBtn.action == ToolbarActions.List) {
  //           this.sharedServices.changeToolbarPath({
  //             listPath: this.listUrl,
  //           } as ToolbarPath);
  //           this.router.navigate([this.listUrl]);
  //         } else if (currentBtn.action == ToolbarActions.Save) {
  //           this.onSave();
  //         } else if (currentBtn.action == ToolbarActions.New) {
  //           this.toolbarPathData.componentAdd = 'component-names.add-office';
  //           this.createOfficeForm();
  //           this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //           this.navigateUrl(this.addUrl);
  //         } else if (currentBtn.action == ToolbarActions.Update) {
  //           this.onUpdate();
  //         }
  //       }
  //     },
  //   });
  //   this.subsList.push(sub);
  // }

  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            navigateUrl(this.listUrl, this.router);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {

            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-office";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.ownerForm.reset();
            navigateUrl(this.addUrl, this.router);
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
    this.getExpireDateOfNationalIdNumber(selectedDate);
    this.checkExpiredIdentityDate();
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
    this.getRespoIdentityExpireDate(selectedDate);
    this.checkSignatureIdentityEnd();
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
    this.getRespoIdentityExpireDate(selectedDate);
    this.checkRespoIdentityExpireDate();
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
    this.getCommercialRegisterExpireDate(selectedDate);
    this.checkCommercialRegisterExpireDate();
  }
  //#endregion
  checkExpiredIdentityDate() {
    this.expireDateOfNationalIdNumber = this.dateService.getDateForCalender(
      this.productionDateIdentity.month +
      1 +
      '/' +
      (this.productionDateIdentity.day + 1) +
      '/' +
      this.productionDateIdentity.year
    );
    this.getExpireDateOfNationalIdNumber(this.expireDateOfNationalIdNumber);
  }

  checkCommercialRegisterExpireDate() {
    this.commercialRegisterExpireDate = this.dateService.getDateForCalender(
      this.commercialRegisterDate.month +
      1 +
      '/' +
      (this.commercialRegisterDate.day + 1) +
      '/' +
      this.commercialRegisterDate.year
    );
    this.getCommercialRegisterExpireDate(this.commercialRegisterExpireDate);
  }

  checkSignatureIdentityEnd() {
    this.signatureIdentityEnd = this.dateService.getDateForCalender(
      this.signIdentityDate.month +
      1 +
      '/' +
      (this.signIdentityDate.day + 1) +
      '/' +
      this.signIdentityDate.year
    );
    this.getSignatureIdentityEnd(this.signatureIdentityEnd);
  }
  checkRespoIdentityExpireDate() {
    this.respoIdentityExpireDate = this.dateService.getDateForCalender(
      this.respoIdentityDate.month +
      1 +
      '/' +
      (this.respoIdentityDate.day + 1) +
      '/' +
      this.respoIdentityDate.year
    );
    this.getRespoIdentityExpireDate(this.respoIdentityExpireDate);
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


  getCommRegDate(selectedDate: DateModel) {
    this.commercialRegisterDate = selectedDate;
  }

  getCommRegEndDate(selectedDate: DateModel) {
    this.commercialRegisterExpireDate = selectedDate;
  }
}
