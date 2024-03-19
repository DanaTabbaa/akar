import { Component, OnInit, OnDestroy } from '@angular/core';
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
  TechnicianTypeArEnum,
  TechnicianTypeEnum,
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
import { Technicians } from 'src/app/core/models/technicians';
import { TechniciansService } from 'src/app/core/services/backend-services/technicians.service';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { MaintenanceServices } from 'src/app/core/models/maintenance-services';
import { MaintenanceServicesService } from 'src/app/core/services/backend-services/maintenance-services.service';
import { TechniciansMaintenanceServicesVM } from 'src/app/core/models/ViewModel/technicians-maintenance-services-vm';
import { TechniciansMaintenanceServicesService } from 'src/app/core/services/backend-services/technicians-maintenance-services.service';
import { TranslatePipe } from '@ngx-translate/core';
import {
  EMAIL_REQUIRED_VALIDATORS,
  FAX_VALIDATORS,
  MOBILE_REQUIRED_VALIDATORS,
  MOBILE_VALIDATORS,
  NAME_REQUIRED_VALIDATORS,
  PHONE_VALIDATORS,
  Phone_REQUIRED_VALIDATORS,
} from 'src/app/core/constants/input-validators';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
const PAGEID = 22; // from pages table in database seeding table
@Component({
  selector: 'app-technicians',
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss'],
})
export class TechniciansComponent implements OnInit, OnDestroy {
  changeTechniciansFlag: number = 0;
  //#region Main Declarations
  technicianForm!: FormGroup;
  technicianMaintenanceServicesForm!: FormGroup;
  nationalities: Nationality[] = [];
  technicians: Technicians[] = [];
  countries: Countries[] = [];
  cities: Cities[] = [];
  regions: Region[] = [];
  districts: District[] = [];
  technicianTypes: ICustomEnum[] = [];
  maintenanceServices: MaintenanceServices[] = [];
  selectedTechniciansMaintenanceServices: TechniciansMaintenanceServicesVM[] =
    [];
  sub: any;
  id: any = 0;
  url: any;
  errorMessage = '';
  errorClass = '';
  currnetUrl: any;
  emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  addUrl: string = '/control-panel/maintenance/add-technician';
  updateUrl: string = '/control-panel/maintenance/update-technician/';
  listUrl: string = '/control-panel/maintenance/technicians-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.technicians',
    componentAdd: 'technicians.add-technician',
  };

  submited: boolean = false;
  Response!: ResponseResult<Technicians>;

  //#endregion

  //#region Constructor
  constructor(
    private NationalityService: NationalityService,
    private MaintenanceServicesService: MaintenanceServicesService,
    private TechniciansMaintenanceServicesService: TechniciansMaintenanceServicesService,
    private CountriesService: CountriesService,
    private RegionsService: RegionsService,
    private CitiesService: CitiesService,
    private rolesPerimssionsService: RolesPermissionsService,
    private DistrictsService: DistrictsService,
    private TechniciansService: TechniciansService,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private dateService: DateConverterService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslatePipe,
    private searchDialog: SearchDialogService
  ) {
    this.createTechnicianForm();
  }
  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem('PageId', PAGEID.toString());
    this.loadData();
    //this.sharedServices.changeButton({action:"New"}as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.sharedServices.changeButton({
            action: 'Update',
            submitMode: false,
          } as ToolbarData);
          this.toolbarPathData.componentAdd = 'technicians.update-technician';
          this.getTechnicianById(this.id);
          this.getTechnicianMaintenanceServicesByTechnicianId(this.id);
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
          complete: () => { },
        });
    });
    return promise;
  }
  //#endregion

  //#region  State Management
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  createTechnicianForm() {
    this.technicianForm = this.fb.group({
      id: 0,
      technicianNameAr: NAME_REQUIRED_VALIDATORS,
      technicianNameEn: NAME_REQUIRED_VALIDATORS,
      technicianType: ['', Validators.compose([Validators.required])],
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
    });
    this.identityIssuanceDate = this.dateService.getCurrentDate();
    this.identityExpireDate = this.dateService.getCurrentDate();
    this.technicianMaintenanceServicesForm = this.fb.group({
      id: 0,
      technicianId: '',
      maintenanceServiceId: ['', Validators.compose([Validators.required])],
    });
  }

  loadData() {
    this.getPagePermissions(PAGEID);
    this.currnetUrl = this.router.url;
    this.listenToClickedButton();
    this.changePath();
    this.getLanguage();
    this.getTechnicianTypes();
    this.spinner.show();
    Promise.all([
      this.getNationalities(),
      this.getCountries(),
      this.getRegions(),
      this.getCities(),
      this.getDistricts(),
      this.getMaintenanceServices(),
    ]).then((a) => {
      this.spinner.hide();
    });
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
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
        complete: () => { },
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
        complete: () => { },
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
        complete: () => { },
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
        complete: () => { },
      });
    });
    return promise;
  }

  getNationalities() {
    const promise = new Promise<void>((resolve, reject) => {
      let sub = this.NationalityService.getAll('GetAll').subscribe({
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
        complete: () => { },
      });
      this.subsList.push(sub);
    });
    return promise;
  }

  getMaintenanceServices() {
    const promise = new Promise<void>((resolve, reject) => {
      this.MaintenanceServicesService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.maintenanceServices = res.data.map(
            (res: MaintenanceServices[]) => {
              return res;
            }
          );
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
    return promise;
  }

  getTechnicianTypes() {
    if (this.lang == 'en') {
      this.technicianTypes = convertEnumToArray(TechnicianTypeEnum);
    } else {
      this.technicianTypes = convertEnumToArray(TechnicianTypeArEnum);
    }
  }
  //#endregion

  //#region CRUD Operations
  getTechnicianById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.TechniciansService.getById(id).subscribe({
        next: (res: any) => {
          //(("result data getbyid", res.data);
          this.technicianForm.setValue({
            id: this.id,
            technicianNameAr: res.data.technicianNameAr,
            technicianNameEn: res.data.technicianNameEn,
            technicianType: res.data.technicianType,
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
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
    return promise;
  }
  getTechnicianMaintenanceServicesByTechnicianId(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.TechniciansMaintenanceServicesService.getById(id).subscribe({
        next: (res: any) => {
          if (res.data != null && res.data.length > 0) {
            res.data.forEach((element) => {
              this.selectedTechniciansMaintenanceServices.push({
                id: element.id,
                technicianId: element.technicianId,
                maintenanceServiceId: element.maintenanceServiceId,
                serviceNameAr: element.serviceNameAr,
                serviceNameEn: element.serviceNameEn,
                technicianNameAr: '',
                technicianNameEn: '',
              });
            });

            this.defineGridColumn();
          }
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
    return promise;
  }
  setData() {
    this.technicianForm.value.identityIssuanceDate =
      this.dateService.getDateForInsertISO_Format(this.identityIssuanceDate);
    this.technicianForm.value.identityExpireDate =
      this.dateService.getDateForInsertISO_Format(this.identityExpireDate);
  }

  onSave() {
    this.submited = true;
    if (this.technicianForm.valid) {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      this.technicianForm.value.id = this.id;
      this.setData();

      const promise = new Promise<void>((resolve, reject) => {
        this.TechniciansService.addWithUrl(
          'Insert',
          this.technicianForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            if (result != null) {
              if (result.success && !result.isFound) {
                let technicianId = result.data.id;
                if (this.selectedTechniciansMaintenanceServices.length > 0) {
                  this.selectedTechniciansMaintenanceServices.forEach(
                    (element) => {
                      element.technicianId = technicianId;
                    }
                  );
                  this.TechniciansMaintenanceServicesService.addAllWithUrl(
                    'insert',
                    this.selectedTechniciansMaintenanceServices
                  ).subscribe((_result) => { });
                }

                //this.createTechnicianForm();

                setTimeout(() => {
                  this.spinner.hide();

                  this.showResponseMessage(
                    result.success,
                    AlertTypes.success,
                    this.translate.transform('messages.add-success')
                  );
                  this.navigateUrl(this.listUrl);
                }, 500);
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
          complete: () => { },
        });
      });
      return promise;
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
      return this.technicianForm.markAllAsTouched();
    }
  }

  onUpdate() {
    this.submited = true;
    if (this.technicianForm.value != null) {
      this.setData();
      const promise = new Promise<void>((resolve, reject) => {
        this.TechniciansService.updateWithUrl(
          'Update',
          this.technicianForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            if (result != null) {
              if (result.success && !result.isFound) {
                let technicianId = result.data.id;
                if (this.selectedTechniciansMaintenanceServices.length > 0) {
                  this.selectedTechniciansMaintenanceServices.forEach(
                    (element) => {
                      element.technicianId = technicianId;
                    }
                  );
                }

                this.TechniciansMaintenanceServicesService.updateAllWithUrl(
                  'update',
                  this.selectedTechniciansMaintenanceServices
                ).subscribe((_result) => { });
                this.createTechnicianForm();

                setTimeout(() => {
                  this.spinner.hide();
                  // this.showResponseMessage(result.success, AlertTypes.success, result.message);
                  this.showResponseMessage(
                    true,
                    AlertTypes.success,
                    this.translate.transform('messages.update-success')
                  );
                  this.navigateUrl(this.addUrl);
                }, 500);
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
          complete: () => { },
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
      return this.technicianForm.markAllAsTouched();
    }
  }

  // hashed by mohamed kandil 10-4-2023
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

  selectedMaintainanceServices: MaintenanceServices = new MaintenanceServices();
  isEmptyInput: boolean = false;
  addMaintenanceService() {
    if (this.selectedMaintainanceServices.serviceNameEn ?? null) {
      this.isEmptyInput = false;
      var maintenanceService: any = '';
      if (
        this.technicianMaintenanceServicesForm.value.maintenanceServiceId != ''
      ) {
        this.maintenanceServices.forEach((element) => {
          if (
            element.id ==
            this.technicianMaintenanceServicesForm.value.maintenanceServiceId
          ) {
            maintenanceService = element;
          }
        });
      }
      this.selectedTechniciansMaintenanceServices.push({
        maintenanceServiceId: this.selectedMaintainanceServices?.id ?? 0,
        serviceNameAr: this.selectedMaintainanceServices?.serviceNameAr ?? '',
        serviceNameEn: this.selectedMaintainanceServices?.serviceNameEn ?? '',
        id: 0,
        technicianId: undefined,
        technicianNameAr: '',
        technicianNameEn: '',
      });
      this.clearSelectedItemData();
    } else {
      this.isEmptyInput = true;
    }
  }

  deleteTechniciansMaintenanceServices(item: TechniciansMaintenanceServicesVM) {
    if (item != null) {
      let removedItem = this.selectedTechniciansMaintenanceServices.find(
        (x) => x.maintenanceServiceId == item.maintenanceServiceId
      );
      const index: number = this.selectedTechniciansMaintenanceServices.indexOf(
        removedItem!
      );
      if (index !== -1) {
        this.selectedTechniciansMaintenanceServices.splice(index, 1);
        this.defineGridColumn();
      }
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

  get f(): { [key: string]: AbstractControl } {
    return this.technicianForm.controls;
  }
  get tms(): { [key: string]: AbstractControl } {
    return this.technicianMaintenanceServicesForm.controls;
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
            //  this.router.navigate([this.listUrl]);
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = 'technicians.add-technician';
            this.router.navigate([this.addUrl]);
            this.createTechnicianForm();
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

  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  columnNames: any[] = [];
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
      this.columnNames = [
        this.lang == 'ar'
          ? { title: 'الخدمة', field: 'serviceNameAr' }
          : { title: ' Service  ', field: 'serviceNameEn' },

        this.lang == 'ar'
          ? {
            title: 'حذف',
            field: 'maintenanceServiceId',
            formatter: this.deleteFormatIcon,
            cellClick: (e, cell) => {
              this.deleteTechniciansMaintenanceServices(
                cell.getRow().getData()
              );
            },
          }
          : {
            title: 'Delete',
            field: 'maintenanceServiceId',
            formatter: this.deleteFormatIcon,
            cellClick: (e, cell) => {
              this.deleteTechniciansMaintenanceServices(
                cell.getRow().getData()
              );
            },
          },
      ];
    });
  }
  editFormatIcon() {
    //plain text value
    return "<i class=' fa fa-edit'></i>";
  }
  deleteFormatIcon() {
    //plain text value
    return "<i class=' fa fa-trash'></i>";
  }
  CheckBoxFormatIcon() {
    //plain text value
    return "<input id='yourID' type='checkbox' />";
  }

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
  };

  direction: string = 'ltr';

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'serviceNameAr', type: 'like', value: searchTxt },
        { field: 'serviceNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  openAddSelectedTechniciansMaintenanceServices() { }

  onMenuActionSelected(event: ITabulatorActionsSelected) {
    if (event != null) {
      if (event.actionName == 'Delete') {
        this.deleteTechniciansMaintenanceServices(event.item);
      }
    }
  }

  //#endregion
  deleteItem(index) {
    if (this.selectedTechniciansMaintenanceServices.length) {
      if (this.selectedTechniciansMaintenanceServices.length == 1) {
        this.selectedTechniciansMaintenanceServices = [];
      } else {
        this.selectedTechniciansMaintenanceServices.splice(index, 1);
      }
    }
  }
  // editItem(index) {
  //   ;
  //   console.log("------------",this.selectedMaintenanceServices)
  //   let item = this.selectedTechniciansMaintenanceServices[index];
  //   if(item??null)
  //   {
  //     this.selectedTechniciansMaintenanceServices[index].maintenanceServiceId=this.selectedMaintainanceServices.id;
  //     this.selectedTechniciansMaintenanceServices[index].serviceNameAr=this.selectedMaintainanceServices.serviceNameAr;
  //     this.selectedTechniciansMaintenanceServices[index].serviceNameEn=this.selectedMaintainanceServices.serviceNameEn;

  //   }

  // }
  selectedMaintenanceServices: MaintenanceServices = new MaintenanceServices();
  maintenanceService: MaintenanceServices = new MaintenanceServices();
  openSerivcesSearchDialog(i = -1) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedMaintainanceServices?.serviceNameEn ?? '';
    } else {
      searchTxt = this.selectedTechniciansMaintenanceServices[i].serviceNameEn;
    }

    let data = this.maintenanceServices.filter((x) => {
      return (
        (x.serviceNameEn + ' ' + x.serviceNameEn)
          .toLowerCase()
          .includes(searchTxt) ||
        (x.serviceNameAr + ' ' + x.serviceNameAr)
          .toUpperCase()
          .includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectedMaintainanceServices!.serviceNameAr =
          data[0].serviceNameEn;
        this.selectedMaintainanceServices!.id = data[0].id;
      } else {
        this.selectedTechniciansMaintenanceServices[i].serviceNameEn =
          data[0].serviceNameEn;
        this.selectedTechniciansMaintenanceServices[i].maintenanceServiceId =
          data[0].id;
      }
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم اللاتيني'];
      let names = ['id', 'serviceNameAr', 'serviceNameEn'];
      let title = this.lang == 'ar' ? 'بحث عن الوحدة' : 'Search Units';

      let sub = this.searchDialog
        .showDialog(lables, names, this.maintenanceServices, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {
              this.selectedMaintainanceServices!.serviceNameEn =
                d.serviceNameEn;
              this.selectedMaintainanceServices!.id = d.id;
            } else {
              this.selectedTechniciansMaintenanceServices[i].serviceNameEn =
                d.serviceNameEn;
              this.selectedTechniciansMaintenanceServices[
                i
              ].maintenanceServiceId = d.id;
            }
          }
        });
      this.subsList.push(sub);
    }
    // this.onVoucherDetailsChange.emit(this.voucherDetails);
  }

  clearSelectedItemData() {
    this.selectedMaintainanceServices = {
      serviceNameAr: '',
      serviceNameEn: '',
      id: 0,
    };
  }
}
