import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { accountType, AlertTypes, convertEnumToArray, delegationTypeArEnum, delegationTypeEnum, RegisterationTypeArEnum, RegisterationTypeEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Cities } from 'src/app/core/models/cities';
import { CompaniesActivities } from 'src/app/core/models/companies-activities';
import { Countries } from 'src/app/core/models/countries';
import { Nationality } from 'src/app/core/models/nationality';
import { Region } from 'src/app/core/models/regions';

import { District } from 'src/app/core/models/district';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { Owner } from 'src/app/core/models/owners';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs'
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Tenants } from 'src/app/core/models/tenants';
import { DateModel } from 'src/app/core/view-models/date-model';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMAIL_REQUIRED_VALIDATORS, EMAIL_VALIDATORS, FAX_VALIDATORS, IDENTITY_REQUIRED_VALIDATORS, MOBILE_REQUIRED_VALIDATORS, MOBILE_VALIDATORS, PHONE_VALIDATORS, Phone_REQUIRED_VALIDATORS, REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { TranslatePipe } from '@ngx-translate/core';
;
import { Accounts } from 'src/app/core/models/accounts';

import { QuickModalService } from 'src/app/shared/services/quick-modal.service';
import { ResponsiblePersonsComponent } from '../../responsible-persons/responsible-persons.component';
import { ResponsiblePersons } from 'src/app/core/models/responsible-persons';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { TenantRole, TenantRolesData } from 'src/app/core/models/ViewModel/tenant-roles';
import { NewCode } from 'src/app/core/view-models/new-code';
const PAGEID = 10; // from pages table in database seeding table
@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit, OnDestroy {
  //properties
  currnetUrl: any;
  lang: string = '';
  tenantAccounts: Accounts[] = [];
  addUrl: string = '/control-panel/definitions/add-tenant';
  updateUrl: string = '/control-panel/definitions/update-tenant/';
  listUrl: string = '/control-panel/definitions/tenants-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-tenants",
    componentAdd: "component-names.add-tenant",
  };
  tenantForm!: FormGroup;
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
  tenantRoles: TenantRolesData = new TenantRolesData();
  selectedTenantRoles: TenantRole[] = [];

  id: any = 0;
  url: any;
  submited: boolean = false;
  //Response!: ResponseResult<Tenants>;
  //systemSettings!: SystemSettings
  //
  //constructor
  constructor(
    private translate: TranslatePipe,
    private tenantsService: TenantsService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private router: Router, private fb: FormBuilder, private route: ActivatedRoute,
    private quickModalServices: QuickModalService,
    private managerService: ManagerService) {
    this.createTenantForm();
  }
  //
  createTenantForm() {
    this.tenantForm = this.fb.group({
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
      addressAdditionalCode: '',
      address: '',
      ownerId: ['', Validators.compose([Validators.required])],
      tenantAccountId: '',
      responsiblePersons: [],
      recordRole: ['', Validators.compose([Validators.required])]

    });

    this.commercialRegisterDate = this.dateService.getCurrentDate();
    this.commercialRegisterExpireDate = this.dateService.getCurrentDate();
  }
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    this.sharedServices.setResponsibleListData([]);

    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
    this.managerService.destroy();
  }
  currentUserId!: number;
  //#endregion
  //ngOnInit
  ngOnInit(): void {
    localStorage.setItem("PageId", PAGEID.toString());
    this.lang = localStorage.getItem('language')!;
    this.getRegisterTypes();
    this.getDelegationTypes();
    this.spinner.show();

    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),
      this.managerService.loadSystemSettings(),
      this.managerService.loadNationalities(),
      this.managerService.loadOwners(),
      this.managerService.loadCompanyActivities(),
      this.managerService.loadCountries(),
      this.managerService.loadAccounts(),
      this.managerService.loadRegions(),
      this.managerService.loadCities(),
      this.managerService.loadDistricts()

    ])
      .then(a => {

        this.owners = this.managerService.getOwners();
        this.nationalities = this.managerService.getNationalities();
        this.countries = this.managerService.getCountries();
        this.companiesActivities = this.managerService.getCompanyActivities();

        this.getSystemSettings();
        this.getAccounts();
        this.getRouteData();
        this.changePath();
        this.listenToClickedButton();
      }).catch(e => {
        this.spinner.hide();
      });


    //this.sharedServices.changeButton({ action: 'Save', submitMode: false } as ToolbarData);
    this.listenToResponsibleListData();



  }

  getRouteData() {
    let sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getTenantById(this.id).then(a => {
            this.spinner.hide();
            this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", params["id"]);
          }).catch(e => {
            this.spinner.hide();
          });

        }
        else {

          this.getNewCode().then(newCode=>{
            this.selectedTenantRoles = [];
            this.selectedTenantRoles.push(this.tenantRoles.data[0]);
            this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
            this.tenantForm.controls['code'].setValue(newCode);
          }).catch(e=>{
            this.spinner.hide();
          });
        }
      }
      else {
        this.getNewCode().then(newCode=>{
          this.spinner.hide();
          this.selectedTenantRoles = [];
          this.selectedTenantRoles.push(this.tenantRoles.data[0]);
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
          this.tenantForm.controls['code'].setValue(newCode);
        }).catch(e=>{
          this.spinner.hide();
        });
      }
      // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      this.url = this.router.url.split('/')[2];
    });
    this.subsList.push(sub);
  }
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe({
        next: (res) => {
          this.lang = res;
          resolve();
        },
        error: (err) => {
          resolve();
        }
      });

      this.subsList.push(sub);
    });

  }



  //
  //methods
  IdentityNumberDigits: number = 14;
  identityNoDigits: number = 14;
  getSystemSettings() {
    if (this.managerService.getSystemSettings().length) {

      this.identityNoDigits = this.managerService.getSystemSettings()[0].numberOfIdentityNo != null || 0 ? this.managerService.getSystemSettings()[0].numberOfIdentityNo : this.IdentityNumberDigits;
    }






  }

  getAccounts() {
    if (this.managerService.getAccounts().length) {
      this.tenantAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tenant);
    }

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

  showResponseMessage(responseStatus, alertType, message) {

    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"))
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"))
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"))
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"))
    }
  }
  //#endregion
  onSave() {
    this.submited = true;
     
    this.setInputData();
   
    
    
    if (this.tenantForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true });
      this.tenantForm.value.id = this.id;
      
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
      return this.tenantForm.markAllAsTouched();
    }
  }

  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.tenantsService.
        addWithResponse<Tenants>("AddWithCheck?uniques=NameAr&uniques=NameEn&uniques=Code", this.tenantForm.value).subscribe({
          next: (result: ResponseResult<Tenants>) => {
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
          error: (err: any) => {
            this.showResponseMessage(
              false,
              AlertTypes.error,
              this.translate.transform("messages.connection-error")
            );
            reject(err);
          },
          complete: () => {

          },
        });
      this.subsList.push(sub);
    });

  }
  setInputData() {
     

    //this.tenantForm.value.productionDateIdentity = this.dateService.getDateForInsertISO_Format(this.productionDateIdentity ?? this.dateService.getCurrentDate());
    //this.tenantForm.value.signatureIdentityEnd = this.dateService.getDateForInsertISO_Format(this.signatureIdentityEnd ?? this.dateService.getCurrentDate());
    //this.tenantForm.value.signIdentityDate = this.dateService.getDateForInsertISO_Format(this.signIdentityDate ?? this.dateService.getCurrentDate());
    //this.tenantForm.value.respoIdentityDate = this.dateService.getDateForInsertISO_Format(this.respoIdentityDate ?? this.dateService.getCurrentDate());
    //this.tenantForm.value.respoIdentityExpireDate = this.dateService.getDateForInsertISO_Format(this.respoIdentityExpireDate ?? this.dateService.getCurrentDate());

    //this.tenantForm.value.expireDateOfNationalIdNumber = this.dateService.getDateForInsertISO_Format(this.expireDateOfNationalIdNumber ?? this.dateService.getCurrentDate());
    this.tenantForm.value.commercialRegisterDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterDate ?? this.dateService.getCurrentDate());
    this.tenantForm.value.commercialRegisterExpireDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterExpireDate ?? this.dateService.getCurrentDate());
    this.tenantForm.value.responsiblePersons = this.responsiblePersons;
    this.tenantForm.controls["recordRole"].setValue(this.prepareSelectedRoleForInsert());


  }
  onUpdate() {
    this.submited = true;
    this.setInputData();
    if (this.tenantForm.valid) {      
     
      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      })

    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.tenantForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.tenantsService.updateWithUrl("UpdateWithCheck?uniques=NameAr&uniques=NameEn&uniques=Code", this.tenantForm.value).subscribe({
        next: (result: ResponseResult<Tenants>) => {
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
        error: (err: any) => {
          this.showResponseMessage(
            false,
            AlertTypes.error,
            this.translate.transform("messages.connection-error")
          );
          resolve();
        },
        complete: () => {

        },
      });
      this.subsList.push(sub);
    });
  }

  getTenantById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.tenantsService.getWithResponse<Tenants>("GetById?id=" + id + "&includes=ResponsiblePersons").subscribe({
        next: (res: ResponseResult<Tenants>) => {
          resolve();
          //(("result data getbyid", res.data);
          if (res.data) {
            this.prepareViewSelectedRole(res.data.recordRole);
            this.tenantForm.setValue({
              id: this.id,
              registrationTypeId: res.data.registrationTypeId,
              code: res.data.code,
              nameAr: res.data.nameAr,
              nameEn: res.data.nameEn,
              phone: res.data.phone,
              mobile: res.data.mobile,
              fax: res.data.fax,
              email: res.data.email,
              nationalityId: res.data.nationalityId,
              ownerId: res.data.ownerId,
              companyActivityId: res.data.companyActivityId,
              companyPhone: res.data.companyPhone,
              companyMobile: res.data.companyMobile,
              companyFax: res.data.companyFax,
              companyPostalBoxNumber: res.data.companyPostalBoxNumber,
              commercialRegisterNumber: res.data.commercialRegisterNumber,
              taxNumber: res.data.taxNumber,
              commercialRegisterDate: res.data.commercialRegisterDate,
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
              addressAdditionalCode: res.data.addressAdditionalCode,
              address: res.data.address,
              tenantAccountId: res.data.tenantAccountId,
              responsiblePersons: res.data.responsiblePersons,
              recordRole:res.data.recordRole
            });

            (this.commercialRegisterDate = this.dateService.getDateForCalender(
              res.data.commercialRegisterDate
            )),
              this.commercialRegisterExpireDate = this.dateService.getDateForCalender(res.data.commercialRegisterExpireDate)
            this.sharedServices.setResponsibleListData([...res.data.responsiblePersons]);

            this.onChangeCountry(res.data.addressCountryId);
            this.onChangeRegion(res.data.addressRegionId);
            this.onChangeCity(res.data.addressCityId);
          }

          //(("this.TenantForm.value set value", this.TenantForm.value)
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
    return this.tenantForm.controls;
  }
  ///////
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
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-tenant";
            //this.createTenantForm();
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
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  //#endregion

  //#region Date Picker
  //productionDateIdentity!: DateModel;
  //signatureIdentityEnd!: DateModel;
  //signIdentityDate!: DateModel;
  //respoIdentityExpireDate!: DateModel;
  //respoIdentityDate!: DateModel;
  //expireDateOfNationalIdNumber!: DateModel;
  commercialRegisterExpireDate!: DateModel;
  commercialRegisterDate!: DateModel;
  //isProductionDateIdentityGreater: boolean = false;
  isCommercialRegisterGreater: boolean = false;
  //isSignatureIdentityEndGreater: boolean = false;
  //isRespoIdentityExpireDateGreater: boolean = false;
  onSelectRespoIdentityExpireDate: boolean = false;
  onSelectExpireDateOfNationalId: boolean = false;
  onSelectCommercialRegisterExpireDate: boolean = false;
  onSelectSignatureIdentityEnd: boolean = false;
  // getProductionDateIdentity(selectedDate: DateModel) {
  //   this.productionDateIdentity = selectedDate;
  // }


  getCommRegDate(selectedDate: DateModel) {
    this.commercialRegisterDate = selectedDate;
  }

  // getCommRegEndDate(selectedDate: DateModel) {
  //   this.commercialRegisterExpireDate = selectedDate;
  // }
  // getSignatureIdentityEnd(selectedDate: DateModel) {
  //   this.isSignatureIdentityEndGreater =
  //     this.dateService.compareStartDateIsGreater(
  //       this.productionDateIdentity,
  //       selectedDate
  //     );
  //   if (this.isSignatureIdentityEndGreater == false) {
  //     this.onSelectSignatureIdentityEnd = true;
  //     this.signatureIdentityEnd = selectedDate;
  //   } else {
  //     this.onSelectSignatureIdentityEnd = false;
  //   }
  // }
  // getSignIdentityDate(selectedDate: DateModel) {
  //   this.signIdentityDate = selectedDate;
  // }

  //getRespoIdentityExpireDate(selectedDate: DateModel) {
  //this.respoIdentityExpireDate = selectedDate;

  // this.isRespoIdentityExpireDateGreater =
  //   this.dateService.compareStartDateIsGreater(
  //     this.productionDateIdentity,
  //     selectedDate
  //   );
  // if (this.isRespoIdentityExpireDateGreater == false) {
  //   this.onSelectRespoIdentityExpireDate = true;
  //   this.respoIdentityExpireDate = selectedDate;
  // } else {
  //   this.onSelectRespoIdentityExpireDate = false;
  // }
  //}
  // getRespoIdentityDate(selectedDate: DateModel) {
  //   this.respoIdentityDate = selectedDate;
  // }

  // getExpireDateOfNationalIdNumber(selectedDate: DateModel) {
  //   this.isProductionDateIdentityGreater =
  //     this.dateService.compareStartDateIsGreater(
  //       this.productionDateIdentity,
  //       selectedDate
  //     );
  //   if (this.isProductionDateIdentityGreater == false) {
  //     this.onSelectExpireDateOfNationalId = true;
  //     this.expireDateOfNationalIdNumber = selectedDate;
  //   } else {
  //     this.onSelectExpireDateOfNationalId = false;
  //   }

  // }

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
    let comRegControl = this.tenantForm.get('commercialRegisterNumber')
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

  prepareViewSelectedRole(recordRole: string) {
    this.selectedTenantRoles = [];
    if (recordRole) {
      recordRole.split(",").forEach(id => {
        let role = this.tenantRoles.data.find(x => x.id.toString() == id);
        if (role) {
          this.selectedTenantRoles.push(role);
        }
      })

    }
  }


  prepareSelectedRoleForInsert() {

    let rolesValue: string = ""
    rolesValue = this.selectedTenantRoles.reduce((p, c, i) => {
      return p + c.id + ","
    }, "");

    if (rolesValue) {
      rolesValue = rolesValue.substring(0, rolesValue.length - 1);
    }
    return rolesValue;
  }


  getNewCode(){
    return new Promise<string>((resolve,reject)=>{
      let sub = this.tenantsService.getWithResponse<NewCode[]>("GetNewCode").subscribe({
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


