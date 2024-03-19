import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,

} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertTypes,
  convertEnumToArray,
  RegisterationTypeEnum,
  RegisterationTypeArEnum,
  ToolbarActions,
  delegationTypeArEnum,
  delegationTypeEnum,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Cities } from 'src/app/core/models/cities';
import { CompaniesActivities } from 'src/app/core/models/companies-activities';
import { Countries } from 'src/app/core/models/countries';
import { Nationality } from 'src/app/core/models/nationality';
import { Region } from 'src/app/core/models/regions';
import { CompaniesActivitiesVM } from 'src/app/core/models/ViewModel/companies-activities-vm';
import { NationalityVM } from 'src/app/core/models/ViewModel/nationality-vm';
import { CompaniesActivitiesService } from 'src/app/core/services/backend-services/companies-activities.service';
import { NationalityService } from 'src/app/core/services/backend-services/nationality.service';
import { DistrictsService } from 'src/app/core/services/backend-services/district.service';
import { District } from 'src/app/core/models/district';
import { PeopleOfBenefitsService } from 'src/app/core/services/backend-services/people-of-benefits.service';
import { Office } from 'src/app/core/models/offices';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { Subscription } from 'rxjs';
import { DateModel } from 'src/app/core/view-models/date-model';
import { PeopleOfBenefit } from 'src/app/core/models/people-of-benefits';
import { TranslatePipe } from '@ngx-translate/core';
import { EMAIL_REQUIRED_VALIDATORS, EMAIL_VALIDATORS, FAX_VALIDATORS, MOBILE_REQUIRED_VALIDATORS, MOBILE_VALIDATORS, NAME_REQUIRED_VALIDATORS, NAME_VALIDATORS, PHONE_VALIDATORS, Phone_REQUIRED_VALIDATORS, REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { Store } from '@ngrx/store';
import { OfficeSelectors } from 'src/app/core/stores/selectors/office.selectors';
import { OfficeModel } from 'src/app/core/stores/store.model.ts/office.store.model';
import { CitySelectors } from 'src/app/core/stores/selectors/city.selectors';
import { RegionSelectors } from 'src/app/core/stores/selectors/region.selectors';
import { RegionsModel } from 'src/app/core/stores/store.model.ts/regions.store.model';
import { CountrySelectors } from 'src/app/core/stores/selectors/country.selectors';
import { CountriesModel } from 'src/app/core/stores/store.model.ts/countries.store.model';
import { CitiesModel } from 'src/app/core/stores/store.model.ts/cities.store.model';
import { DistrictSelectors } from 'src/app/core/stores/selectors/district.selectors';
import { DistrictModel } from 'src/app/core/stores/store.model.ts/district.store.model';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { PeopleOfBenefitsActions } from 'src/app/core/stores/actions/peopleofbenefits.actions';
const PAGEID=14; // from pages table in database seeding table
@Component({
  selector: 'app-people-of-benefits',
  templateUrl: './people-of-benefits.component.html',
  styleUrls: ['./people-of-benefits.component.scss'],
})
export class PeopleOfBenefitsComponent implements OnInit, OnDestroy , AfterViewInit{

  peopleBenefitForm: FormGroup = new FormGroup({});;
  peopleOfBenifits: PeopleOfBenefit = new PeopleOfBenefit();
  regsiterTypes: ICustomEnum[] = [];
  delegationTypes: ICustomEnum[] = [];
  nationalities: Nationality[] = [];
  offices: Office[] = [];
  companiesActivities: CompaniesActivities[] = [];
  lang: string = '';
  countries: Countries[] = [];
  searchCountries: Countries[] = [];

  cities: Cities[] = [];
  searchCities: Cities[] = [];

  regions: Region[] = [];
  searchRegions: Region[] = [];

  districts: District[] = [];
  searchDistricts: District[] = [];


  url: any;
  submited: boolean = false;
  errorMessage = '';
  errorClass = '';

  currnetUrl;
  addUrl: string = '/control-panel/definitions/add-benefit-person';
  updateUrl: string = '/control-panel/definitions/update-benefit-person/';
  listUrl: string = '/control-panel/definitions/people-of-benefits-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-benefit-person",
    componentAdd: "component-names.add-benefit-person",
  };

  //#endregion

  //#region Constructor
  constructor(
    private nationalityService: NationalityService,
    private companiesActivitiesService: CompaniesActivitiesService,
    private alertsService: NotificationsAlertsService,
    private peopleOfBenefitsService: PeopleOfBenefitsService,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private rolesPerimssionsService:RolesPermissionsService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private store: Store<any>,

  ) {
    this.createForm();
  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)

  }
  //#endregion

  ngAfterViewInit(): void {
    this.loadData();
  }
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
  //#region Permissions
  rolePermission!:RolesPermissionsVm;
  userPermissions!:UserPermission;
  getPagePermissions(pageId)
  {
    const promise = new Promise<void>((resolve, reject) => {
        this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId="+pageId).subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
             this.userPermissions=JSON.parse(this.rolePermission.permissionJson);
             this.sharedServices.setUserPermissions(this.userPermissions);
            resolve();

          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise;

  }
//#endregion

  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  loadData() {
    this.currnetUrl = this.router.url;
    this.sharedServices.changeButton({action:"Save",submitMode:false} as ToolbarData)
    this.listenToClickedButton();
    this.changePath();
    this.getRegisterTypes();
    this.getDelegationTypes();
    this.spinner.show();
    Promise.all([
      this.getOffices(),
      this.getNationalities(),
      this.getCompanyActivities(),
      this.getDistricts(),
      this.getRegions(),
      this.getCities(),
      this.getCountries()

    ]).then(a => {

      this.spinner.hide();
      let sub = this.route.params.subscribe((params) => {

        if (params["id"]) {
          localStorage.setItem("RecordId",params["id"]);
          this.getPeopleOfBenefitsById(params["id"]);
          this.sharedServices.changeButton({action:"Update",submitMode:false} as ToolbarData)
        }
        this.url = this.router.url.split('/')[2];
      });

      this.subsList.push(sub);



    }).catch((err) => {

      this.spinner.hide();
    })

  }




  createForm() {
    this.peopleBenefitForm = this.fb.group({
      id: 0,
      registrationTypeId: REQUIRED_VALIDATORS,
      personNumber: REQUIRED_VALIDATORS,
      nameAr: NAME_REQUIRED_VALIDATORS,
      nameEn: NAME_REQUIRED_VALIDATORS,
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
      companyNameAr: NAME_VALIDATORS,
      companyNameEn: '',
      isConnectWithWaterAndElectric: false,
      numberWaterAcc: '',
      numberElectricAcc: '',
      officeId: '',
      companyActivityId: '',
      companyPhone: '',
      companyMobile: MOBILE_VALIDATORS,
      companyFax: FAX_VALIDATORS,
      CompanyPostalBoxNumber: '',
      commercialRegisterNumber: '',
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
      signMobile: '',
      signatureNationalId: '',
      signIdentityDate: '',
      signatureIdentityEnd: '',
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
    });




  }



  setInitialDates() {
    this.productionDateIdentity = this.dateService.getCurrentDate();
    this.signatureIdentityEnd = this.dateService.getCurrentDate();
    this.signIdentityDate = this.dateService.getCurrentDate();
    this.respoIdentityExpireDate = this.dateService.getCurrentDate();
    this.respoIdentityDate = this.dateService.getCurrentDate();
    this.expireDateOfNationalIdNumber = this.dateService.getCurrentDate();
    this.commercialRegisterDate = this.dateService.getCurrentDate();
    this.commercialRegisterExpireDate = this.dateService.getCurrentDate();
  }

  getCountries() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(CountrySelectors.selectors.getListSelector).subscribe({
        next: (res: CountriesModel) => {
          this.countries = JSON.parse(JSON.stringify(res.list));
          resolve();

        },
        error: (err: any) => {
          resolve();
        },
        complete: () => {
          resolve();
        },
      });
      this.subsList.push(sub);
    });

  }
  getRegions() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(RegionSelectors.selectors.getListSelector).subscribe({
        next: (res: RegionsModel) => {

          this.regions = JSON.parse(JSON.stringify(res.list));
          resolve();

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
  getCities() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(CitySelectors.selectors.getListSelector).subscribe({
        next: (res: CitiesModel) => {
          this.cities = JSON.parse(JSON.stringify(res.list));
          resolve();
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
  getDistricts() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(DistrictSelectors.selectors.getListSelector).subscribe({
        next: (res: DistrictModel) => {
          this.districts = JSON.parse(JSON.stringify(res.list));
          resolve();
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
  getLanguage()
  {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getRegisterTypes() {
    if(this.lang=='en')
    {
    this.regsiterTypes = convertEnumToArray(RegisterationTypeEnum);
    }
    else
    {
      this.regsiterTypes = convertEnumToArray(RegisterationTypeArEnum);

    }
  }
  getDelegationTypes() {
    if(this.lang=='en')
    {
    this.delegationTypes = convertEnumToArray(delegationTypeEnum);
    }
    else
    {
      this.delegationTypes = convertEnumToArray(delegationTypeArEnum);

    }
  }
  getNationalities() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.nationalityService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.nationalities = res.data.map((res: NationalityVM[]) => {
            return res;
          });
          resolve();

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
  getOffices() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(OfficeSelectors.selectors.getListSelector).subscribe({
        next: (res: OfficeModel) => {
          this.offices = JSON.parse(JSON.stringify(res.list))
          resolve();
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


  getCompanyActivities() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.companiesActivitiesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.companiesActivities = res.data.map(
            (res: CompaniesActivitiesVM[]) => {
              return res;
            }
          );
          resolve();

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
  //#endregion

  //#region CRUD Operations

  onSave() {

    this.submited = true;
    if (this.peopleBenefitForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})

      this.setInputData();
      return this.saveData()
    }
    else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.peopleBenefitForm.markAllAsTouched();
    }
  }


  setInputData() {

    this.peopleBenefitForm.value.productionDateIdentity = this.dateService.getDateForInsertISO_Format(this.productionDateIdentity??this.dateService.getCurrentDate());
    this.peopleBenefitForm.value.signatureIdentityEnd = this.dateService.getDateForInsertISO_Format(this.signatureIdentityEnd??this.dateService.getCurrentDate());
    this.peopleBenefitForm.value.signIdentityDate = this.dateService.getDateForInsertISO_Format(this.signIdentityDate??this.dateService.getCurrentDate());
    this.peopleBenefitForm.value.respoIdentityDate = this.dateService.getDateForInsertISO_Format(this.respoIdentityDate??this.dateService.getCurrentDate());
    this.peopleBenefitForm.value.expireDateOfNationalIdNumber = this.dateService.getDateForInsertISO_Format(this.expireDateOfNationalIdNumber??this.dateService.getCurrentDate());
    this.peopleBenefitForm.value.commercialRegisterDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterDate??this.dateService.getCurrentDate());
    this.peopleBenefitForm.value.commercialRegisterExpireDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterExpireDate??this.dateService.getCurrentDate());
    this.peopleBenefitForm.value.commercialRegisterExpireDate = this.dateService.getDateForInsertISO_Format(this.commercialRegisterExpireDate??this.dateService.getCurrentDate());

    let keys = Object.keys(this.peopleBenefitForm.controls);
    //((keys);


    if(this.peopleOfBenifits){
      keys.forEach(k=>{
        this.peopleOfBenifits[k] = this.peopleBenefitForm.controls[k].value;
      })
    }



  }

  saveData() {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      let sub = this.peopleOfBenefitsService.addWithResponse("Add?checkAll=false", this.peopleOfBenifits!).subscribe({
        next: (res) => {
          this.spinner.hide();
          if(res.success){
            this.store.dispatch(PeopleOfBenefitsActions.actions.insert({
              data: JSON.parse(JSON.stringify({ ...res.data }))
            }));
            this.showResponseMessage(res.success, AlertTypes.success, this.translate.transform("messages.add-success"));
            this.navigateUrl(this.listUrl);
          }
          resolve();

        },
        error: (err: any) => {
          this.spinner.hide();
          resolve();
        },
        complete: () => {
          resolve();
        },
      });

      this.subsList.push(sub)
    });
  }



  onUpdate() {
    this.submited = true;
    if (this.peopleBenefitForm.value != null && this.peopleBenefitForm.valid) {
     this.setInputData();
      return this.updateData();
    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.peopleBenefitForm.markAllAsTouched();
    }
  }


  updateData() {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      let sub = this.peopleOfBenefitsService.updateWithResponse('Update?idColName=Id&checkAll=false', this.peopleBenefitForm.value).subscribe({
        next: (result: any) => {
          this.spinner.hide();
          this.store.dispatch(PeopleOfBenefitsActions.actions.update({
            data: JSON.parse(JSON.stringify({ ...result.data }))
          }));
          this.showResponseMessage(result.success, AlertTypes.success, this.translate.transform("messages.update-success"));
          resolve();
          this.navigateUrl(this.listUrl);


          // setTimeout(() => {
          //   this.spinner.hide();
          //   this.showResponseMessage(result.success, AlertTypes.success, result.message);
          //   this.navigateUrl(this.listUrl);
          // },500);
        },
        error: (err: any) => {
          //reject(err);
          resolve();
          this.spinner.hide();
        },
        complete: () => {
          ////(('complete');
          resolve();
          this.spinner.hide();
        },
      });
      this.subsList.push(sub);
    });
  }

  getPeopleOfBenefitsById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.peopleOfBenefitsService.getWithResponse<PeopleOfBenefit>("GetByFieldName?fieldName=Id&fieldValue=" + id).subscribe({
        next: (res) => {
          if (res.success) {
            this.peopleOfBenifits = JSON.parse(JSON.stringify(res.data));
            //(("getPeopleOfBenefitsById peopleOfBenifits ",this.peopleOfBenifits);
            this.setFormValue();
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
    return this.peopleBenefitForm.controls;
  }



  //#endregions

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
          } else if (currentBtn.action == ToolbarActions.New ) {
            this.toolbarPathData.componentAdd = "component-names.add-benefit-person";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate([this.addUrl])
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode ) {
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


  setFormValue() {
    this.peopleBenefitForm.setValue({
      id: this.peopleOfBenifits?.id,
      registrationTypeId: this.peopleOfBenifits?.registrationTypeId,
      personNumber: this.peopleOfBenifits?.personNumber,
      nameAr: this.peopleOfBenifits?.nameAr,
      nameEn: this.peopleOfBenifits?.nameEn,
      phone: this.peopleOfBenifits?.phone,
      mobile: this.peopleOfBenifits?.mobile,
      fax: this.peopleOfBenifits?.fax,
      email: this.peopleOfBenifits?.email,
      identityNo: this.peopleOfBenifits?.identityNo,
      productionPlaceOfIdenity: this.peopleOfBenifits?.productionPlaceOfIdenity,
      nationalityId: this.peopleOfBenifits?.nationalityId,
      jobTitle: this.peopleOfBenifits?.jobTitle,
      productionDateIdentity: this.peopleOfBenifits?.productionDateIdentity,
      expireDateOfNationalIdNumber: this.peopleOfBenifits?.expireDateOfNationalIdNumber,
      companyNameAr: this.peopleOfBenifits?.companyNameAr,
      companyNameEn: this.peopleOfBenifits?.companyNameEn,
      isConnectWithWaterAndElectric: this.peopleOfBenifits?.isConnectWithWaterAndElectric,
      numberWaterAcc: this.peopleOfBenifits?.numberWaterAcc,
      numberElectricAcc: this.peopleOfBenifits?.numberElectricAcc,
      officeId: this.peopleOfBenifits?.officeId || null,
      companyActivityId: this.peopleOfBenifits?.companyActivityId || null,
      companyPhone: this.peopleOfBenifits?.companyPhone,
      companyMobile: this.peopleOfBenifits?.companyMobile,
      companyFax: this.peopleOfBenifits?.companyFax,
      CompanyPostalBoxNumber: this.peopleOfBenifits?.companyPostalBoxNumber || null,
      commercialRegisterNumber: this.peopleOfBenifits?.commercialRegisterNumber,
      taxNumber: this.peopleOfBenifits?.taxNumber,
      commercialRegisterDate: this.peopleOfBenifits?.commercialRegisterDate,
      commercialRegisterExpireDate: this.peopleOfBenifits?.commercialRegisterExpireDate || null,
      commercialRegisterPlace: this.peopleOfBenifits?.commercialRegisterPlace,
      companyEmail: this.peopleOfBenifits?.companyEmail,
      responsibleNameAr: this.peopleOfBenifits?.responsibleNameAr,
      responsibleNameEn: this.peopleOfBenifits?.responsibleNameEn,
      respoMobile: this.peopleOfBenifits?.respoMobile,
      respoIdentityNo: this.peopleOfBenifits?.respoIdentityNo,
      respoIdentityDate: this.peopleOfBenifits?.respoIdentityDate || null,
      respoIdentityExpireDate: this.peopleOfBenifits?.respoIdentityExpire || null,
      respoIdentityPlace: this.peopleOfBenifits?.respoIdentityPlace,
      respoJob: this.peopleOfBenifits?.respoJob,
      signNameAr: this.peopleOfBenifits?.signNameAr,
      signNameEn: this.peopleOfBenifits?.signNameEn,
      signMobile: this.peopleOfBenifits?.signMobile,
      signatureNationalId: this.peopleOfBenifits?.signatureNationalId,
      signIdentityDate: this.peopleOfBenifits?.signIdentityDate || null,
      signatureIdentityEnd: this.peopleOfBenifits?.signatureIdentityEnd || null,
      signatureIdentityPlace: this.peopleOfBenifits?.signatureIdentityPlace || null,
      delegationType: this.peopleOfBenifits?.delegationType || null,
       addressCountryId: this.peopleOfBenifits?.addressCountryId,
       addressRegionId: this.peopleOfBenifits?.addressRegionId,
       addressCityId: this.peopleOfBenifits?.addressCityId,
       addressDistrictId: this.peopleOfBenifits?.addressDistrictId,
       addressBlockNumber: this.peopleOfBenifits?.addressBlockNumber,
       addressApartmentNumber: this.peopleOfBenifits?.addressApartmentNumber,
       addressPostalCode: this.peopleOfBenifits?.addressPostalCode,
      addressAdditionalCode: this.peopleOfBenifits?.addressAdditionalCode || null,
      address: this.peopleOfBenifits?.address,


    });

    this.productionDateIdentity = this.dateService.getDateForCalender(this.peopleOfBenifits?.productionDateIdentity||this.dateService.getCurrentDate());
    this.signatureIdentityEnd = this.dateService.getDateForCalender(this.peopleOfBenifits?.signatureIdentityEnd);
    this.signIdentityDate = this.dateService.getDateForCalender(this.peopleOfBenifits?.signIdentityDate);
    this.respoIdentityExpireDate = this.dateService.getDateForCalender(this.peopleOfBenifits?.respoIdentityExpire);
    this.respoIdentityDate = this.dateService.getDateForCalender(this.peopleOfBenifits?.respoIdentityDate);
    this.expireDateOfNationalIdNumber = this.dateService.getDateForCalender(this.peopleOfBenifits?.expireDateOfNationalIdNumber);
    this.commercialRegisterDate = this.dateService.getDateForCalender(this.peopleOfBenifits?.commercialRegisterDate);
    this.commercialRegisterExpireDate = this.dateService.getDateForCalender(this.peopleOfBenifits?.commercialRegisterExpireDate);
    //(("this.peopleBenefitForm.value getby id",this.peopleBenefitForm.value)

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


  onChangeCountry(countryId:any){

    this.searchRegions = this.regions.filter(x=>x.countryId == countryId);
  }

  onChangeRegion(regionId:any){

    this.searchCities = this.cities.filter(x=>x.regionId == regionId);
  }

  onChangeCity(cityId:any){
    this.searchDistricts = this.districts.filter(x=>x.cityId == cityId);
  }


  //#endregion
}
