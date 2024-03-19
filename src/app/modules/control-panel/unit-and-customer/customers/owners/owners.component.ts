import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccIntegrationTypeArEnum,
  AccIntegrationTypeEnum,
  accountType, AlertTypes, ConnectionTypeEnum, convertEnumToArray, delegationTypeArEnum, delegationTypeEnum, RegisterationTypeArEnum,
  RegisterationTypeEnum, ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Cities } from 'src/app/core/models/cities';
import { CompaniesActivities } from 'src/app/core/models/companies-activities';
import { Countries } from 'src/app/core/models/countries';
import { Nationality } from 'src/app/core/models/nationality';
import { Region } from 'src/app/core/models/regions';
import { District } from 'src/app/core/models/district';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { Office } from 'src/app/core/models/offices';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { Owner } from 'src/app/core/models/owners';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { DateModel } from 'src/app/core/view-models/date-model';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { EMAIL_REQUIRED_VALIDATORS, EMAIL_VALIDATORS, FAX_VALIDATORS, MOBILE_REQUIRED_VALIDATORS, MOBILE_VALIDATORS, PHONE_VALIDATORS, Phone_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Accounts } from 'src/app/core/models/accounts';
import { CompanyInformation } from 'src/app/core/models/company-information';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { ResponsiblePersonsComponent } from '../../responsible-persons/responsible-persons.component';
import { ResponsiblePersons } from 'src/app/core/models/responsible-persons';
import { OwnerDetailsViewModel } from 'src/app/core/models/ViewModel/owner-details-view-model';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NewCode } from 'src/app/core/view-models/new-code';

import { OwnerIntegrationSettings } from 'src/app/core/models/owner-integration-settings';
import { OwnerIntegrationSettingsService } from 'src/app/core/services/backend-services/owner-integration-settings.service';
import { GeneralIntegrationSettings } from 'src/app/core/models/general-integration-settings';
const PAGEID = 4;
@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss'],
})
export class OwnersComponent implements OnInit, OnDestroy {
  //properties
  currnetUrl: any;
  lang: string = '';
  addUrl: string = '/control-panel/definitions/add-owner';
  updateUrl: string = '/control-panel/definitions/update-owner/';
  listUrl: string = '/control-panel/definitions/owners-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-owners",
    componentAdd: '',
  };
  ownerDetailsViewModel!: OwnerDetailsViewModel;
  ownerForm!: FormGroup;
  errorMessage = '';
  errorClass = '';
  regsiterTypes: ICustomEnum[] = [];
  delegationTypes: ICustomEnum[] = [];
  connectionTypes: ICustomEnum[] = [];
  accIntegrationTypes: ICustomEnum[] = [];
  nationalities: Nationality[] = [];
  offices: Office[] = [];
  companiesActivities: CompaniesActivities[] = [];
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];

  ownerAccounts: Accounts[] = [];
  serviceAccounts: Accounts[] = [];
  taxAccounts: Accounts[] = [];
  deferredAccounts: Accounts[] = [];
  insuranceAccounts: Accounts[] = [];
  //accuredAccounts: Accounts[] = [];
  clientAccounts: Accounts[] = [];

  id: any = 0;
  url: any;
  submited: boolean = false;
  companyInformationResponse!: ResponseResult<CompanyInformation>;
  commercialRegisterExpireDate!: DateModel;
  commercialRegisterDate!: DateModel;
  isCommercialRegisterGreater: boolean = false;
  onSelectRespoIdentityExpireDate: boolean = false;
  onSelectExpireDateOfNationalId: boolean = false;
  onSelectCommercialRegisterExpireDate: boolean = false;
  onSelectSignatureIdentityEnd: boolean = false;
  subsList: Subscription[] = [];
  ownerIntegrationSetting = new OwnerIntegrationSettings();
  currentBtnResult;
  generalAccountIntegration!: GeneralIntegrationSettings | null;
  constructor(
    protected ownerService: OwnersService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private dateService: DateConverterService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private quickModalServices: QuickModalService,
    protected managerService: ManagerService,
    private ownerIntegrationSettingService: OwnerIntegrationSettingsService
  ) {
    //super(ownerService, managerServices);
    this.createownerForm();


  }

  createownerForm() {
    this.ownerForm = this.fb.group({
      id: 0,
      registrationTypeId: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      nameAr: ['', Validators.compose([Validators.required])],
      nameEn: ['', Validators.compose([Validators.required])],
      phone: Phone_REQUIRED_VALIDATORS,
      mobile: MOBILE_REQUIRED_VALIDATORS,
      fax: FAX_VALIDATORS,
      email: EMAIL_REQUIRED_VALIDATORS,
      nationalityId: '',
      companyActivityId: '',
      companyPhone: PHONE_VALIDATORS,
      companyMobile: MOBILE_VALIDATORS,
      companyFax: FAX_VALIDATORS,
      companyPostalBoxNumber: '',
      commercialRegisterNumber: '',
      taxNumber: '',
      commercialRegisterDate: '',
      commercialRegisterExpireDate: '',
      commercialRegisterPlace: '',
      companyEmail: EMAIL_VALIDATORS,
      addressCountryId: '',
      addressRegionId: '',
      addressCityId: '',
      addressDistrictId: '',
      addressBlockNumber: '',
      addressApartmentNumber: '',
      addressPostalCode: '',
      addressAdditionalCODE: '',
      address: '',
      ownerAccountId: '',
      insuranceAccountId: '',
      taxAccountId: '',
      serviceAccountId: '',
      deferredRevenueAccountId: '',
      //accuredRevenueAccountId: '',
      responsiblePersons: [],
      ownerIntegrationSettings: '',
      clientAccountId:''
    });
    this.commercialRegisterDate = this.dateService.getCurrentDate();
    this.commercialRegisterExpireDate = this.dateService.getCurrentDate();
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
    this.sharedServices.setResponsibleListData([]);
    this.managerService.destroy();

  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language')!;
    this.activeTap = 3;
    localStorage.setItem("PageId", PAGEID.toString());
    this.getRegisterTypes();
    this.getDelegationTypes();
    this.getAccConnectionTypes();
    this.getAccIntegrationTypes();
    this.id = 0;
    this.spinner.show();

    Promise.all([
      this.managerService.loadGeneralAccountIntegrationSetting(),
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadNationalities(),
      this.managerService.loadOffices(),
      this.managerService.loadCompanyActivities(),
      this.managerService.loadCountries(),
      this.managerService.loadRegions(),
      this.managerService.loadCities(),
      this.managerService.loadDistricts(),
      this.managerService.loadAccounts(),
    ]
    ).then(a => {
      console.log("Account General Integraion Settings", a[0]);
      this.generalAccountIntegration = a[0];
      if (this.generalAccountIntegration) //General Account Integration 
      {

        if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Resort) {
          this.getResortAccounts();
        }
        else if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Web) {
          this.getWebAccounts();
        }

      }


      this.offices = this.managerService.getOffices();
      this.countries = this.managerService.getCountries();
      this.companiesActivities = this.managerService.getCompanyActivities();
      this.nationalities = this.managerService.getNationalities();

      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    }).catch(err => {
      this.spinner.hide();
    });
    this.listenToResponsibleListData();
  }


  getRouteData() {
    let sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        if (this.id > 0) {
          this.getOwnerById(this.id).then(a => {
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", this.id);
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
        this.getNewCode().then(newCode => {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
          this.ownerForm.controls['code'].setValue(newCode);
        }).catch(e => {
          this.spinner.hide();
        });


      }
    });
    this.subsList.push(sub);
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

  getAccounts() {
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Owner);
    this.insuranceAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Insurance);
    this.taxAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tax);
    this.serviceAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Service);
    this.deferredAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Deferred Revenue']);
    this.clientAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tenant);

    //this.accuredAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Accured Revenue']);
  }


  getResortAccountsByOwner(ownerId: number) {
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.resortAccGuid);
    this.insuranceAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.resortAccGuid);;
    this.taxAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.resortAccGuid);
    this.serviceAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.resortAccGuid);
    this.deferredAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.resortAccGuid);
    //this.accuredAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Accured Revenue']);
    this.clientAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.resortAccGuid);
  }

  getWebAccountsByOwner(ownerId: number) {
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.extAccId);
    this.insuranceAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.extAccId);;
    this.taxAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.extAccId);
    this.serviceAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.extAccId);
    this.deferredAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.extAccId);
    //this.accuredAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Accured Revenue']);
    this.clientAccounts = this.managerService.getAccounts().filter(x => x.ownerId == ownerId && x.extAccId);
  }



  getResortAccounts() {
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.insuranceAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.taxAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.serviceAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.deferredAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.clientAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
  }

  getWebAccounts() {
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.insuranceAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.taxAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.serviceAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.deferredAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.clientAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
  }
  setOwnerViewModelData() {
    if (this.ownerForm.valid) {
      this.ownerDetailsViewModel = { ...this.ownerForm.value }
      this.ownerDetailsViewModel.commercialRegisterDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterDate);
      this.ownerDetailsViewModel.commercialRegisterExpireDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterExpireDate);
      if (this.responsiblePersons.length > 0) {
        this.ownerDetailsViewModel.responsiblePersons = [...this.responsiblePersons]

      } else {
        this.ownerDetailsViewModel.responsiblePersons = [];
      }

      this.ownerDetailsViewModel.ownerIntegrationSettings = this.ownerIntegrationSetting;
    }
  }
  onSave() {
    //this.ownerForm.markAllAsTouched();
     
    if (this.ownerForm.valid) {
      if (this.id == 0) {
        this.setOwnerViewModelData();
        this.ownerForm.value.Id = 0;
        this.setInputData();
        this.spinner.show();
        this.confirmSave().then(a => {
          this.spinner.hide();
        }).catch(e => {
          this.spinner.hide();
        });
      }
    } else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.ownerForm.markAllAsTouched();
    }
  }
  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.ownerService.addWithResponse<Owner>('AddWithCheck?uniques=NameAr&uniques=NameEn&uniques=Code',
        this.ownerDetailsViewModel as any).subscribe({
          next: (result: ResponseResult<Owner>) => {
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
          error: (error) => {
            this.showResponseMessage(
              false,
              AlertTypes.error,
              this.translate.transform("messages.connection-error")
            );
            resolve();
            console.error(error)
          }
        });
      this.subsList.push(sub);
    });
  }

  onUpdate() {
    this.ownerForm.markAllAsTouched();
    if (this.ownerForm.valid) {
      this.ownerForm.value.id = this.id;
      this.setInputData();
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
      return this.ownerForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      console.log(this.ownerForm.value)
       

      let sub = this.ownerService.updateWithUrl("UpdateWithCheck?uniques=NameAr&uniques=NameEn&uniques=Code", this.ownerForm.value).subscribe({
        next: (result: ResponseResult<Owner>) => {
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
          this.showResponseMessage(
            false,
            AlertTypes.error,
            this.translate.transform("messages.connection-error")
          );
          //reject(err);
          resolve();
        },
        complete: () => {
        },
      });
      this.subsList.push(sub);
    });
  }
  activeTap: number = 0;
  onCheckIsAddResponsiblePerson() {
    if (this.ownerForm.value.isAddResponsiblePerson) {
      this.activeTap = 1;
    } else {
      this.activeTap = 3;
    }
  }
  onCheckIsAddPersonAuthorized() {
    if (this.ownerForm.value.isAddPersonAuthorized) {
      this.activeTap = 1;
    } else {
      this.activeTap = 3;
    }
  }
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
  setInputData() {
    this.ownerForm.value.commercialRegisterDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterDate ?? this.dateService.getCurrentDate());
    this.ownerForm.value.commercialRegisterExpireDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterExpireDate ?? this.dateService.getCurrentDate());
    this.ownerForm.value.responsiblePersons = this.responsiblePersons;

    // if(this.id)
    // {
    //   this.ownerIntegrationSetting.ownerId = this.id;
    // }
    this.ownerForm.value.ownerIntegrationSettings = this.ownerIntegrationSetting;
  }
  getOwnerById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.ownerService.getWithResponse<Owner>("GetById?Id=" + id + "&includes=ResponsiblePersons,OwnerIntegrationSettings").subscribe({
        next: (res: ResponseResult<Owner>) => {
          resolve();
          if (res.data) {
            this.onChangeCountry(res.data.addressCountryId);
            this.onChangeRegion(res.data.addressRegionId);
            this.onChangeCity(res.data.addressCityId);
            if (res.data.ownerIntegrationSettings) {
              this.ownerIntegrationSetting = res.data.ownerIntegrationSettings;
            }



            if (!this.generalAccountIntegration) {
              if (this.ownerIntegrationSetting) {
                if (this.ownerIntegrationSetting.accIntegrationType == AccIntegrationTypeEnum.Resort) {
                  this.getResortAccountsByOwner(id);
                }
                else if (this.ownerIntegrationSetting.accIntegrationType == AccIntegrationTypeEnum.Web) {
                  this.getWebAccountsByOwner(id);
                }
                else {

                  this.getAccounts();
                }
              }
              else {
                this.getAccounts();
              }
            }
            else {
              if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.None) {
                this.getAccounts();
              }
            }


            this.ownerForm.setValue({
              id: this.id,
              code: res.data.code,
              registrationTypeId: res.data.registrationTypeId,
              //ownerNumber: res.data.ownerNumber,
              nameAr: res.data.nameAr,
              nameEn: res.data.nameEn,
              phone: res.data.phone,
              mobile: res.data.mobile,
              fax: res.data.fax,
              email: res.data.email,
              nationalityId: res.data.nationalityId,
              companyActivityId: res.data.companyActivityId,
              companyPhone: res.data.companyPhone,
              companyMobile: res.data.companyMobile,
              companyFax: res.data.companyFax,
              companyPostalBoxNumber:
                res.data.companyPostalBoxNumber != null
                  ? res.data.companyPostalBoxNumber
                  : '',
              commercialRegisterNumber: res.data.commercialRegisterNumber,
              taxNumber: res.data.taxNumber,
              commercialRegisterDate: this.dateService.getDateForCalender(
                res.data.commercialRegisterDate
              ),
              commercialRegisterExpireDate: res.data.commercialRegisterExpireDate,
              commercialRegisterPlace: res.data.commercialRegisterPlace,
              companyEmail: res.data.companyEmail,
              addressCountryId: res.data.addressCountryId,
              addressRegionId: res.data.addressRegionId,
              addressCityId: res.data.addressCityId,
              addressDistrictId: res.data.addressDistrictId,
              addressBlockNumber: res.data.addressBlockNumber,
              addressApartmentNumber: res.data.addressApartmentNumber,
              addressPostalCode: res.data.addressPostalCode,
              addressAdditionalCODE: res.data.addressAdditionalCODE + '',
              address: res.data.address,
              ownerAccountId: res.data.ownerAccountId,
              insuranceAccountId: res.data.insuranceAccountId,
              taxAccountId: res.data.taxAccountId,
              serviceAccountId: res.data.serviceAccountId,
              deferredRevenueAccountId: res.data.deferredRevenueAccountId,
              //accuredRevenueAccountId: res.data.accuredRevenueAccountId,
              responsiblePersons: res.data.responsiblePersons,
              ownerIntegrationSettings: this.ownerIntegrationSetting,
              clientAccountId:res.data.clientAccountId
            });
            (this.commercialRegisterDate = this.dateService.getDateForCalender(
              res.data.commercialRegisterDate
            )),
              this.commercialRegisterExpireDate = this.dateService.getDateForCalender(res.data.commercialRegisterExpireDate)
             ;
            this.sharedServices.setResponsibleListData([...res.data.responsiblePersons])
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
    return this.ownerForm.controls;
  }
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
            this.toolbarPathData.componentAdd = "component-names.add-owner";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.ownerForm.reset();
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

  getCommercialRegisterExpireDate(selectedDate: DateModel) {
    this.isCommercialRegisterGreater =
      this.dateService.compareStartDateIsGreater(
        this.commercialRegisterDate,
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

  getCommRegDate(selectedDate: DateModel) {
    this.commercialRegisterDate = selectedDate;
  }

  getCommRegEndDate(selectedDate: DateModel) {
    this.commercialRegisterExpireDate = selectedDate;
  }


  onRegisterationTypeChange(e: any) {
    let comRegControl = this.ownerForm.get('commercialRegisterNumber')
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

  getNewCode() {
    return new Promise<string>((resolve, reject) => {
      let sub = this.ownerService.getWithResponse<NewCode[]>("GetNewCode").subscribe({
        next: (res) => {

          let newCode: string = "";
          if (res.data && res.data.length) {
            newCode = res.data[0].code;
          }
          resolve(newCode);


        },
        error: (err) => {
          resolve('');
        },
        complete: () => { }
      });
      this.subsList.push(sub);
    });

  }


  getAccConnectionTypes() {
    if (this.lang == 'en') {
      this.connectionTypes = convertEnumToArray(ConnectionTypeEnum);
    }
    else {
      this.connectionTypes = convertEnumToArray(ConnectionTypeEnum);

    }
  }

  getAccIntegrationTypes() {
    if (this.lang == 'en') {
      this.accIntegrationTypes = convertEnumToArray(AccIntegrationTypeEnum);
    }
    else {
      this.accIntegrationTypes = convertEnumToArray(AccIntegrationTypeArEnum);

    }
  }


  checkConnection() {
    this.spinner.show();
    let sub = this.ownerIntegrationSettingService.post("CheckConnection", this.ownerIntegrationSetting).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.showResponseMessage(res.success, AlertTypes.success, this.translate.transform("messages.connection-succes"))
        }
        else {
          this.showResponseMessage(res.success, AlertTypes.error, this.translate.transform("messages.connection-fail"))
        }

      },
      error: (err) => {
        this.spinner.hide();
      },
      complete: () => { }
    });

    this.subsList.push(sub);
  }


  syncAccountData() {
    this.spinner.show();
    let sub = this.ownerIntegrationSettingService.getWithResponseNormal("SyncAccountData?ownerId=" + this.id).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.showResponseMessage(res.success, AlertTypes.success, this.translate.transform("messages.sync-acc-success"))
        }
        else {
          this.showResponseMessage(res.success, AlertTypes.error, this.translate.transform("messages." + res.message))
        }

      },
      error: (err) => {
        this.spinner.hide();
      },
      complete: () => { }
    });

    this.subsList.push(sub);
  }


}
