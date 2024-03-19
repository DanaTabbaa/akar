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
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { Cities } from 'src/app/core/models/cities';
import { Countries } from 'src/app/core/models/countries';
import { Nationality } from 'src/app/core/models/nationality';
import { Region } from 'src/app/core/models/regions';
import { NationalityVM } from 'src/app/core/models/ViewModel/nationality-vm';
import { NationalityService } from 'src/app/core/services/backend-services/nationality.service';
import { CountriesService } from 'src/app/core/services/backend-services/countries.service';
import { RegionsService } from 'src/app/core/services/backend-services/regions.service';
import { CitiesService } from 'src/app/core/services/backend-services/cities.service';
import { DistrictsService } from 'src/app/core/services/backend-services/district.service';
import { District } from 'src/app/core/models/district';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Subscription } from 'rxjs';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Suppliers } from 'src/app/core/models/suppliers';
import { SuppliersService } from 'src/app/core/services/backend-services/suppliers.service';
import { TranslatePipe } from '@ngx-translate/core';
import {
  EMAIL_REQUIRED_VALIDATORS,
  FAX_VALIDATORS,
  MOBILE_REQUIRED_VALIDATORS,
  MOBILE_VALIDATORS,
  NAME_VALIDATORS,
  PHONE_VALIDATORS,
  Phone_REQUIRED_VALIDATORS,
  REQUIRED_VALIDATORS,
} from 'src/app/core/constants/input-validators';
import { SuppliersVM } from 'src/app/core/models/ViewModel/suppliers-vm';
import { Accounts } from 'src/app/core/models/accounts';
import { AccountsSelectors } from 'src/app/core/stores/selectors/accounts.selectors';
import { AccountsModel } from 'src/app/core/stores/store.model.ts/accounts.store.model';
import { Store } from '@ngrx/store';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { SuppliersActions } from 'src/app/core/stores/actions/suppliers.actions';
const PAGEID = 23; // from pages table in database seeding table

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit, OnDestroy {
  changeSuppliersFlag: number = 0;
  unusedInputFlag = false;
  //#region Main Declarations
  supplierForm!: FormGroup;
  nationalities: Nationality[] = [];
  suppliers: Suppliers[] = [];
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  supplierAccounts: Accounts[] = [];
  expenseAccounts: Accounts[] = [];
  taxAccounts: Accounts[] = [];
  sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;
  emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  lang;
  addUrl: string = '/control-panel/maintenance/add-supplier';
  updateUrl: string = '/control-panel/maintenance/update-supplier/';
  listUrl: string = '/control-panel/maintenance/suppliers-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.suppliers',
    componentAdd: 'suppliers.add-supplier',
  };

  submited: boolean = false;
  Response!: ResponseResult<Suppliers>;

  //#endregion

  //#region Constructor
  constructor(
    private NationalityService: NationalityService,
    private CountriesService: CountriesService,
    private RegionsService: RegionsService,
    private CitiesService: CitiesService,
    private DistrictsService: DistrictsService,
    private suppliersService: SuppliersService,
    private rolesPerimssionsService: RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private store: Store<any>
  ) {
    this.createSupplierForm();
  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem('PageId', PAGEID.toString());

    this.loadData();
    this.getLanguage();
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem('RecordId', params['id']);
          this.sharedServices.changeButton({
            action: 'Update',
            submitMode: false,
          } as ToolbarData);
          this.toolbarPathData.componentAdd = 'suppliers.update-supplier';
          this.getSupplierById(this.id);
          this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
        }
      } else {
        this.sharedServices.changeButton({
          action: 'SinglePage',
        } as ToolbarData);
      }
    });
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
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

  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  createSupplierForm() {
    this.supplierForm = this.fb.group({
      id: 0,
      supplierNameAr: REQUIRED_VALIDATORS,
      supplierNameEn: REQUIRED_VALIDATORS,
      phone: Phone_REQUIRED_VALIDATORS,
      mobile: MOBILE_REQUIRED_VALIDATORS,
      fax: FAX_VALIDATORS,
      email: EMAIL_REQUIRED_VALIDATORS,
      identityNumber: '',
      identityIssuanceDate: '',
      identityIssuancePlace: '',
      identityExpireDate: '',
      nationalityId: '',
      job: '',
      countryId: '',
      regionId: '',
      cityId: '',
      districtId: '',
      blockNumber: '',
      apartmentNumber: '',
      postalCode: '',
      additionalCode: '',
      detailedAddress: '',
      supplierAccountId: '',
      expenseAccountId: '',
      taxAccountId: '',
    });
    this.identityIssuanceDate = this.dateService.getCurrentDate();
    this.identityExpireDate = this.dateService.getCurrentDate();
  }

  loadData() {
    this.getPagePermissions(PAGEID);
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
    this.spinner.show();
    Promise.all([
      this.getNationalities(),
      this.getCountries(),
      this.getRegions(),
      this.getCities(),
      this.getDistricts(),
      this.getAccounts(),
    ]).then((a) => {
      this.spinner.hide();
    });
  }
  getAccounts() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store
        .select(AccountsSelectors.selectors.getListSelector)
        .subscribe({
          next: (res: AccountsModel) => {
            this.supplierAccounts = JSON.parse(
              JSON.stringify(
                res.list.filter((x) => x.accountType == accountType.Supplier)
              )
            );
            this.expenseAccounts = JSON.parse(
              JSON.stringify(
                res.list.filter((x) => x.accountType == accountType.Expenses)
              )
            );
            this.taxAccounts = JSON.parse(
              JSON.stringify(
                res.list.filter((x) => x.accountType == accountType.Tax)
              )
            );

            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {},
        });
      this.subsList.push(sub);
    });
  }
  getCountries() {
    const promise = new Promise<void>((resolve, reject) => {
      this.CountriesService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.countries = res.data.map((res: Countries[]) => {
            return res;
          });
          resolve();
          //(("res", res);
          //((" this.countries", this.countries);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  getRegions(countryId?: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.RegionsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          if (res != null) {
            this.regions = res.data
              .filter((x) => x.countryId == countryId)
              .map((res: Region[]) => {
                return res;
              });
          } else {
            this.regions = res.data.map((res: Region[]) => {
              return res;
            });
          }

          resolve();
          //(("res", res);
          //((" this.regions", this.regions);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  getCities(regionId?: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.CitiesService.getAll('GetAll').subscribe({
        next: (res: any) => {
          if (res != null) {
            this.cities = res.data
              .filter((x) => x.regionId == regionId)
              .map((res: Cities[]) => {
                return res;
              });
          } else {
            this.cities = res.data.map((res: Cities[]) => {
              return res;
            });
          }

          resolve();
          //(("res", res);
          //((" this.cities", this.cities);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  getDistricts(cityId?: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.DistrictsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          if (res != null) {
            this.districts = res.data
              .filter((x) => x.cityId == cityId)
              .map((res: District[]) => {
                return res;
              });
          } else {
            this.districts = res.data.map((res: District[]) => {
              return res;
            });
          }

          resolve();
          //(("res", res);
          //((" this.districts", this.districts);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  getNationalities() {
    const promise = new Promise<void>((resolve, reject) => {
      this.NationalityService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.nationalities = res.data.map((res: NationalityVM[]) => {
            return res;
          });
          resolve();
          //(("res", res);
          //((" this.nationalities", this.nationalities);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  getSuppliers() {
    const promise = new Promise<void>((resolve, reject) => {
      this.suppliersService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.suppliers = res.data.map((res: SuppliersVM[]) => {
            return res;
          });
          resolve();
          //(("res", res);
          //((" this.suppliers", this.suppliers);
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
  getSupplierById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.suppliersService.getById(id).subscribe({
        next: (res: any) => {
          //(("result data getbyid", res.data);
          this.supplierForm.setValue({
            id: this.id,
            supplierNameAr: res.data.supplierNameAr,
            supplierNameEn: res.data.supplierNameEn,
            phone: res.data.phone,
            mobile: res.data.mobile,
            fax: res.data.fax,
            email: res.data.email,
            identityNumber: res.data.identityNumber,
            identityIssuanceDate: res.data.identityIssuanceDate,
            identityIssuancePlace: res.data.identityIssuancePlace,
            identityExpireDate: res.data.identityExpireDate,
            nationalityId: res.data.nationalityId,
            job: res.data.job,
            blockNumber: res.data.blockNumber,
            apartmentNumber: res.data.apartmentNumber,
            postalCode: res.data.postalCode,
            additionalCode: res.data.additionalCode,
            detailedAddress: res.data.detailedAddress,
            countryId: res.data.countryId,
            regionId: res.data.regionId,
            cityId: res.data.cityId,
            districtId: res.data.districtId,
            supplierAccountId: res.data.supplierAccountId,
            expenseAccountId: res.data.expenseAccountId,
            taxAccountId: res.data.taxAccountId,
          });
          this.getRegions(res.data.countryId);
          this.getCities(res.data.regionId);
          this.getDistricts(res.data.cityId);
          this.identityIssuanceDate = this.dateService.getDateForCalender(
            res.data.identityIssuanceDate
          );

          this.identityExpireDate = this.dateService.getDateForCalender(
            res.data.identityExpireDate
          );
          //(("this.supplierForm.value set value", this.supplierForm.value)
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {},
      });
    });
    return promise;
  }
  setDataForInsert() {

    this.supplierForm.value.identityIssuanceDate =
      this.dateService.getDateForInsertISO_Format(this.identityIssuanceDate);
    this.supplierForm.value.identityExpireDate =
      this.dateService.getDateForInsertISO_Format(this.identityExpireDate);
  }
  onSave() {
    this.spinner.show();
    if (this.supplierForm.valid) {
      this.setDataForInsert();
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.suppliersService
          .addWithUrl('insert', this.supplierForm.value)
          .subscribe({
            next: (result: any) => {

              // this.Response = { ...result.response };
              if (result != null) {
                if (result.success && !result.isFound) {
                  this.store.dispatch(
                    SuppliersActions.actions.insert({
                      data: JSON.parse(JSON.stringify({ ...result.data })),
                    })
                  );
                  // this.createSupplierForm();
                  this.changeSuppliersFlag++;


                    this.spinner.hide();
                    this.showResponseMessage(
                      true,
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
      this.spinner.hide();
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.supplierForm.markAllAsTouched();
    }
  }

  onUpdate() {

    if (this.supplierForm.value != null) {
      this.supplierForm.value.id = this.id;
      this.setDataForInsert();
      const promise = new Promise<void>((resolve, reject) => {
        this.suppliersService.updateWithUrl("Update",this.supplierForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result.response };
            if(result!=null)
            {

            if(result.success&&!result.isFound)
            {
            this.store.dispatch(
              SuppliersActions.actions.update({
                data: JSON.parse(JSON.stringify({ ...result.data })),
              })
            );
            //this.createSupplierForm();
          this.changeSuppliersFlag++;
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                true,
                AlertTypes.success,
                this.translate.transform('messages.update-success')
              );
              this.navigateUrl(this.addUrl);
            }, 500);
          }else if(result.isFound){
            this.sharedServices.changeButton({
              action: 'SinglePage',
            } as ToolbarData);
            this.spinner.hide();
            this.checkResponseMessages(result.message)
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
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.supplierForm.markAllAsTouched();
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
  //#endregion

  //#region Helper Functions
  // showResponseMessage(responseStatus, message) {
  //   if (responseStatus != false) {
  //     this.alertsService.showSuccess(message,  this.translate.transform('messages.done'));
  //   } else {
  //     this.alertsService.showError(message, this.translate.transform('messages.error'));
  //   }
  // }
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

  get f(): { [key: string]: AbstractControl } {
    return this.supplierForm.controls;
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
            this.toolbarPathData.componentAdd = 'suppliers.add-supplier';
            this.router.navigate([this.addUrl]);
            this.createSupplierForm();
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

  //#region Date Picker

  identityIssuanceDate!: DateModel;
  identityExpireDate!: DateModel;

  getIdentityExpireDate(selectedDate: DateModel) {
    this.identityExpireDate = selectedDate;
  }
  getIdentityIssuanceDate(selectedDate: DateModel) {
    this.identityIssuanceDate = selectedDate;
  }

  //#endregion
}
