import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { accountType, AlertTypes, convertEnumToArray, MaintenanceContractDuesEnum, MaintenanceContractPeriodTypesArEnum, MaintenanceContractPeriodTypesEnum, MaintenanceMethodTypesArEnum, MaintenanceMethodTypesEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { TranslatePipe } from '@ngx-translate/core';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Store } from '@ngrx/store';
import { ProductsReceiptDetailsSelectors } from 'src/app/core/stores/selectors/productsreceiptdetails.selectors';
import { ProductsReceiptDetailsModel } from 'src/app/core/stores/store.model.ts/productsreceiptdetails.store.model';
import { VwMaintenancecontractsDetails } from 'src/app/core/models/ViewModel/vw-maintenance-contracts-details';
import { MaintenanceServices } from 'src/app/core/models/maintenance-services';
import { MaintenanceContracts } from 'src/app/core/models/maintenance-contracts';
import { SuppliersSelectors } from 'src/app/core/stores/selectors/suppliers.selectors';
import { MaintenanceServicesSelectors } from 'src/app/core/stores/selectors/maintenanceservices.selectors';
import { ProductsCategoriesSelectors } from 'src/app/core/stores/selectors/productscategories.selectors';
import { MaintenanceServicesModel } from 'src/app/core/stores/store.model.ts/maintenanceservices.store.model';
import { SuppliersModel } from 'src/app/core/stores/store.model.ts/suppliers.store.model';
import { ProductCategoriesModel } from 'src/app/core/stores/store.model.ts/productcategories.store.model';
import { ProductCategory } from 'src/app/core/models/Product-category';
import { Products } from 'src/app/core/models/products';
import { MaintenanceContractsService } from 'src/app/core/services/backend-services/maintenance-contracts.service';
import { Suppliers } from 'src/app/core/models/suppliers';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { MaintenanceContractsDetailsService } from 'src/app/core/services/backend-services/maintenance-contracts-details.service';
import { MaintenanceContractDues } from 'src/app/core/models/maintenance-contract-dues';
import { MaintenanceContractDuesService } from 'src/app/core/services/backend-services/maintenance-contracts-dues.service';
import { MaintenanceContractsSettingsDetailsService } from 'src/app/core/services/backend-services/maintenance-contracts-Settings-details.service';
import { MaintenanceContractsSettingsDetails } from 'src/app/core/models/maintenance-contract-settings-details';
import { Accounts } from 'src/app/core/models/accounts';
import { AccountsModel } from 'src/app/core/stores/store.model.ts/accounts.store.model';
import { AccountsSelectors } from 'src/app/core/stores/selectors/accounts.selectors';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { ProductsService } from 'src/app/core/services/backend-services/products.service';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { ContractsSettingsService } from 'src/app/core/services/backend-services/contracts-settings.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ContractSettingsRolePermissions } from 'src/app/core/models/contract-settings-role-permissions';
import { ContractSettingsUsersPermissionsService } from 'src/app/core/services/backend-services/contract-settings-users-permissions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';

@Component({
  selector: 'app-maintenance-contracts',
  templateUrl: './maintenance-contracts.component.html',
  styleUrls: ['./maintenance-contracts.component.scss'],
})
export class MaintenanceContractsComponent implements OnInit, OnDestroy {
  constructor(
    private dateService: DateConverterService,
    private dateService2: DateCalculation,
    private maintenanceContractsService: MaintenanceContractsService,
    private maintenanceContractsDetailsService: MaintenanceContractsDetailsService,
    private maintenanceContractDuesService: MaintenanceContractDuesService,
    private maintenanceContractsSettingsDetailsService: MaintenanceContractsSettingsDetailsService,
    private router: Router,
    private alertsService: NotificationsAlertsService,
    private SharedServices: SharedService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private store: Store<any>,
    private searchDialog: SearchDialogService,
    private productsService: ProductsService,
    private contractSettingService: ContractsSettingsService,
    private SystemSettingsService: SystemSettingsService,
    private contractSettingsUserPermisionsService: ContractSettingsUsersPermissionsService,
    private modalService: NgbModal,


  ) { }

  addUrl: string = '/control-panel/maintenance/add-maintenance-contract';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-contract/';
  listUrl: string = '/control-panel/maintenance/maintenance-contracts-list';
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.maintenance-contracts',
    componentAdd: 'maintenance-contracts.add-maintenance-contract',
  };
  //region properties
  contractsSettings: ContractsSettings = new ContractsSettings();
  lang: string = '';
  contractNumber: any;
  contractData: string = '';
  settingId: any;
  maintenancecontractsDetails: VwMaintenancecontractsDetails[] = [];
  maintenanceContractsForm: FormGroup = new FormGroup({});
  subsList: Subscription[] = [];
  suppliers: Suppliers[] = [];
  maintenanceServices: MaintenanceServices[] = [];
  productsCategories: ProductCategory[] = [];
  products: Products[] = [];
  searhProducts: Products[] = [];
  maintenanceContracts!: MaintenanceContracts;
  maintenanceContractDues: MaintenanceContractDues[] = [];
  maintenanceContractSettingsDetails!: MaintenanceContractsSettingsDetails;
  supplierAccounts: Accounts[] = [];
  taxAccounts: Accounts[] = [];
  expenseAccounts: Accounts[] = [];
  periodTypes: ICustomEnum[] = [];
  paymentMethodTypes: ICustomEnum[] = [];
  date!: DateModel;
  startDate!: DateModel;
  endDate!: DateModel;
  firstDueDate!: DateModel;
  paymentMethodType: any;
  url: any;
  queryParams: any;
  submited: boolean = false;
  productCategoryId: any;
  productId: any;
  price: number = 0;
  quantity: number = 0;
  valueBeforeTax: any;
  taxRatio: any;
  taxValue: any;
  valueAfterTax: any;
  totalBeforeTax: any;
  totalTax: any;
  totalAfterTax: any;
  errorMessage = '';
  errorClass = '';
  id: any = 0;
  sub: any;
  paymentsCount: any;
  periodType: any;
  periodBetweenPayments: any;
  isGenerateEntryByDue: boolean = false;
  Response!: ResponseResult<MaintenanceContracts>;
  contractSettings: ContractsSettings = new ContractsSettings();
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number;
  //endregion
  ngOnInit(): void {
    this.queryParams = this.route.queryParams.subscribe((params) => {
       
      if (params['settingid'] != null) {
        this.settingId = params['settingid'];
      } else {
        this.settingId = localStorage.getItem('maintenanceContractSettingId');
      }
    });

    this.addUrl =
      '/control-panel/maintenance/add-maintenance-contract?settingid=' +
      this.settingId;
    this.updateUrl =
      '/control-panel/maintenance/update-maintenance-contract?id=' +
      this.id +
      '&settingid=' +
      this.settingId;
    this.listUrl =
      '/control-panel/maintenance/maintenance-contracts-list?settingid=' +
      this.settingId;
    this.toolbarPathData = {
      listPath: this.listUrl,
      updatePath: this.updateUrl,
      addPath: this.addUrl,
      componentList: 'menu.maintenance-contracts',
      componentAdd: 'maintenance-contracts.add-maintenance-contract',
    };

    this.initalizeDates();
    this.getPagePermissions();
    this.cleanMaintenanceContracts();
    this.cleanProduct();
    this.maintenancecontractsDetails = [];
    this.listenToClickedButton();
    this.changePath();
    this.getLanguage();
    this.getMaintenanceContractsPeriodTypes();
    this.getMaintenanceMethodTypesEnum();

    Promise.all([
      this.getSystemSettings(),
      this.getProducts(),
      this.getSuppliers(),
      this.getMaintenanceServices(),
      this.getProductsCategories(),
      this.getAccounts(),
    ])
      .then((a) => {
        let sub = this.route.params.subscribe((params) => {
          if (params['id']) {
            this.getMaintenanceContractsById(params['id']);
            this.getMaintenanceContractsDetailsById(params['id']);

          }
          else
          {
            this.getLastContractCode(this.settingId);

          }
        });

        this.subsList.push(sub);
      })
      .catch((err) => {

      });
    this.getContractSettings();
     


  }
  ngAfterViewInit(): void {
    this.setToolbarComponentData();
    this.endDate = this.dateService2.calculateEndDateForGregrion(1, 2, this.dateService.getCurrentDate(), 0);
    this.endDate = this.dateService2.getDateForCalender(
      this.endDate.month + 1 + '/' + this.endDate.day + '/' + this.endDate.year);
  }
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  initalizeDates() {
    this.date = this.dateService.getCurrentDate();
    this.startDate = this.dateService.getCurrentDate();
    this.firstDueDate = this.dateService.getCurrentDate();
  }
  cleanMaintenanceContracts() {
    this.maintenanceContractsForm = this.fb.group({
      id: '',
      contractNumber: REQUIRED_VALIDATORS,
      date: REQUIRED_VALIDATORS,
      maintenanceContractSettingId: '',
      startDate: REQUIRED_VALIDATORS,
      endDate: REQUIRED_VALIDATORS,
      firstDueDate: REQUIRED_VALIDATORS,
      supplierId: '',
      maintenanceServiceId: REQUIRED_VALIDATORS,
      paymentsCount: { value: 0, disabled: true },
      periodBetweenPayments: REQUIRED_VALIDATORS,
      periodType: REQUIRED_VALIDATORS,
      period: 1,
      paymentMethodType: 2,
      supplierAccountId: '',
      expenseAccountId: '',
      taxAccountId: '',
      totalBeforeTax: '',
      totalTax: '',
      totalAfterTax: '',
      contractStatus: '',
    });
    this.totalBeforeTax = 0;
    this.totalTax = 0;
    this.totalAfterTax = 0;
    this.paymentMethodType = 2;
    this.periodType = 1;
  }
  cleanProduct() {
    this.productCategoryId = '';
    this.productId = '';
    this.quantity = 0;
    this.price = 0;
    this.valueBeforeTax = 0;
    this.taxRatio = 0;
    this.taxValue = 0;
    this.valueAfterTax = 0;
  }
  getSystemSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.SystemSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.showDecimalPoint = res.data[0].showDecimalPoint
          this.showThousandsComma = res.data[0].showThousandsComma
          this.showRoundingFractions = res.data[0].showRoundingFractions
          this.numberOfFraction = res.data[0].numberOfFraction
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  getLastContractCode(settingId) {
    const promise = new Promise<string>((resolve, reject) => {
      this.maintenanceContractsService.getByIdWithUrl("GetLastContractCode?settingId=" + settingId).subscribe({
        next: (res: any) => {
          this.maintenanceContractsForm.value.contractNumber = res.data;
          this.contractNumber = res.data;

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });

    });
    return promise;
  }
  //#region Permissions
  pagePermission!: ContractSettingsRolePermissions;
  userPermissions!: UserPermission;
  getPagePermissions() {

    const promise = new Promise<void>((resolve, reject) => {
      this.contractSettingsUserPermisionsService.getAll("GetContractSettingsUsersPermissionsOfCurrentUser").subscribe({
        next: (res: any) => {
           
          let permissions: ContractSettingsRolePermissions[] = JSON.parse(JSON.stringify(res.data));
          this.pagePermission = permissions.find(x => x.contractSettingId == Number(this.settingId))!
          this.userPermissions = JSON.parse(this.pagePermission?.permissionsJson);
          this.SharedServices.setUserPermissions(this.userPermissions);
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;

  }
  //#endregion
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getContractSettings() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.contractSettingService.getAll("GetAll").subscribe({
        next: (res) => {
          if (res.success) {
            this.contractSettings = JSON.parse(JSON.stringify(res.data.find(x => x.id == this.settingId)));
            // localStorage.setItem("contractArName", this.contractSettings.contractArName);
            // localStorage.setItem("contractEnName", this.contractSettings.contractEnName);
            this.toolbarPathData.componentAdd =
              this.lang == 'ar'
                ? 'اضافة' + ' ' + this.contractSettings.contractArName
                : 'Add' + ' ' + this.contractSettings.contractEnName;
            this.toolbarPathData.componentList =
              this.lang == 'ar'
                ? this.contractSettings.contractArName
                : this.contractSettings.contractEnName;
            this.SharedServices.changeToolbarPath(this.toolbarPathData);


          }
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
    // return new Promise<void>((resolve, reject) => {

    //   let sub = this.store.select(ContractSettingSelectors.selectors.getListSelector).subscribe({
    //     next: (res: ContractSettingModel) => {
    //       resolve();
    //       this.contractSettings = res.list.find(x => x.id == this.settingId) ?? new ContractsSettings();

    //     },
    //     error: (err: any) => {
    //       resolve();
    //     },
    //     complete: () => {
    //       resolve();

    //     },
    //   });
    //   this.subsList.push(sub);

    // });



  }
  getSuppliers() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store
        .select(SuppliersSelectors.selectors.getListSelector)
        .subscribe({
          next: (res: SuppliersModel) => {
            this.suppliers = JSON.parse(JSON.stringify(res.list));
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }
  getMaintenanceServices() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store
        .select(MaintenanceServicesSelectors.selectors.getListSelector)
        .subscribe({
          next: (res: MaintenanceServicesModel) => {
            this.maintenanceServices = JSON.parse(JSON.stringify(res.list));
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }

  getProductsCategories() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store
        .select(ProductsCategoriesSelectors.selectors.getListSelector)
        .subscribe({
          next: (res: ProductCategoriesModel) => {
            this.productsCategories = JSON.parse(JSON.stringify(res.list));
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }

  // getProducts() {
  //   ;
  //   if (this.selectMaintenancecontractsDetails.productCategoryId != null && this.selectMaintenancecontractsDetails.productCategoryId > 0) {
  //     return new Promise<void>((resolve, reject) => {
  //       let sub = this.store
  //         .select(ProductsSelectors.selectors.getListSelector)
  //         .subscribe({
  //           next: (res: ProductsModel) => {
  //             this.products = JSON.parse(
  //               JSON.stringify(
  //                 res.list.filter(
  //                   (x) => x.productCategoryId == this.selectMaintenancecontractsDetails.productCategoryId
  //                 )
  //               )
  //             );
  //             resolve();
  //           },
  //           error: (err: any) => {
  //             reject(err);
  //           },
  //           complete: () => {},
  //         });
  //       this.subsList.push(sub);
  //     });
  //   } else {
  //     this.products = [];
  //     return;
  //   }
  // }
  getProducts() {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.searhProducts = JSON.parse(JSON.stringify(res.data));
          console.log("res==============>", res)
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }


  getContractDate(selectedDate: DateModel) {
    this.date = selectedDate;
  }

  onSave() {
    this.submited = true;
    if (this.settingId == null || this.settingId == '') {
      //'maintenance-contracts.maintenance-contract-setting-id-required'

      this.errorMessage = this.translate.transform('messages.error-occurred-fail');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('general.error')
      );
      return;
    } else {
      this.maintenanceContractsForm.value.maintenanceContractSettingId =
        this.settingId;
    }
    if (this.maintenanceContractsForm.valid) {
      this.SharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.setInputData();
      return this.saveData();
    } else {
      this.SharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.maintenanceContractsForm.markAllAsTouched();
    }
  }

  setInputData() {
    if (
      this.maintenancecontractsDetails.length == 0 ||
      this.maintenancecontractsDetails == null
    ) {
      this.errorMessage = this.translate.transform('general.add-products');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('general.error')
      );
      return;
    } else {
      this.calculateContractDuesList(this.periodType);
    }

    this.maintenanceContractsForm.value.id = this.id;
    this.maintenanceContractsForm.value.date =
      this.dateService.getDateForInsertISO_Format(
        this.date ?? this.dateService.getCurrentDate()
      );
    this.maintenanceContractsForm.value.startDate =
      this.dateService.getDateForInsertISO_Format(
        this.startDate ?? this.dateService.getCurrentDate()
      );
    this.maintenanceContractsForm.value.endDate =
      this.dateService.getDateForInsertISO_Format(
        this.endDate ?? this.dateService.getCurrentDate()
      );
    this.maintenanceContractsForm.value.firstDueDate =
      this.dateService.getDateForInsertISO_Format(
        this.firstDueDate ?? this.dateService.getCurrentDate()
      );
    this.maintenanceContractsForm.value.periodType = this.periodType;
    this.maintenanceContractsForm.value.paymentsCount = this.paymentsCount;
    this.maintenanceContractsForm.value.totalBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalBeforeTax).toFixed(this.numberOfFraction)
        : this.totalBeforeTax);
    this.maintenanceContractsForm.value.totalTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalTax).toFixed(this.numberOfFraction)
        : this.totalTax);

    this.maintenanceContractsForm.value.totalAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalAfterTax).toFixed(this.numberOfFraction)
        : this.totalAfterTax);
  }

  saveData() {
    // if (
    //   this.maintenanceContractDues.length == 0 ||
    //   this.maintenanceContractDues == null
    // ) {
    //   this.errorMessage = this.translate.transform('general.add-products');
    //   this.errorClass = this.translate.transform('general.error-message');
    //   this.alertsService.showError(
    //     this.errorMessage,
    //     this.translate.transform('general.error')
    //   );
    //   return;
    // }

    this.maintenanceContractsForm.value.contractStatus = 0;
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceContractsService
        .addWithResponse(
          'Add?checkAll=false',
          this.maintenanceContractsForm.value
        )
        .subscribe({
          next: (res) => {
            if (res != null) {
              this.spinner.show();
              let maintenanceContractId = res.data.id;
              this.maintenancecontractsDetails.forEach((element) => {
                element.id = 0;
                element.maintenanceContractId = maintenanceContractId;
                this.maintenanceContractsDetailsService
                  .addWithResponse('Add?checkAll=false', element)
                  .subscribe({
                    next: (res) => {
                      if (res != null) {
                      }
                    },
                  });
              });

              this.maintenanceContractDues.forEach((element) => {
                element.id = 0;
                element.maintenanceContractId = maintenanceContractId;
                //element.isEntryGenerated = this.isGenerateEntryByDue;
                this.maintenanceContractDuesService
                  .addWithResponse('Add?checkAll=false', element)
                  .subscribe({
                    next: (res) => {
                      if (res != null) {
                      }
                    },
                  });
              });
            }
            this.spinner.hide();
            if (res.success) {
              this.showResponseMessage(true, AlertTypes.add);
              // this.navigateUrl(this.listUrl);
              this.router.navigate(
                ['/control-panel/maintenance/maintenance-contracts-list'],
                { queryParams: { settingid: this.settingId } }
              );
            }
            resolve();
          },
          error: (err: any) => {
            this.spinner.hide();
            resolve();
          },
          complete: () => {
            resolve();
            this.spinner.hide();
          },
        });

      this.subsList.push(sub);
    });
  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  showResponseMessage(responseStatus, alertType) {
    if (responseStatus == true && AlertTypes.add == alertType) {
      this.alertsService.showSuccess(
        this.translate.transform('general.added-successfully'),
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.update == alertType) {
      this.alertsService.showSuccess(
        this.translate.transform('general.updated-successfully'),
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.issue == alertType) {
      this.alertsService.showSuccess(
        this.translate.transform('general.issued-successfully'),
        this.translate.transform('messageTitle.done')
      );
    }
  }
  onUpdate() {
    if (this.settingId == null || this.settingId == '') {
      this.errorMessage = this.translate.transform(
        'maintenance-contracts.maintenance-contract-setting-id-required'
      );
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('general.error')
      );
      return;
    } else {
      this.maintenanceContractsForm.value.maintenanceContractSettingId =
        this.settingId;
    }
    this.submited = true;

    if (this.maintenanceContractsForm.value != null) {
      this.setInputData();
      this.deleteContractForUpdate(this.id);
      return this.updateData();
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.maintenanceContractsForm.markAllAsTouched();
    }
  }
  updateData() {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceContractsService
        .updateWithResponse(
          'Update?idColName=Id&checkAll=false',
          this.maintenanceContractsForm.value
        )
        .subscribe({
          next: (result: any) => {
            if (result != null) {

              let maintenanceContractId = result.data.id;
              this.maintenanceContractsService.deleteMaintenanceContractAndRealtivesForUpdate(maintenanceContractId).subscribe((resonse) => {

                this.maintenancecontractsDetails.forEach((element) => {

                  element.id = 0;
                  element.maintenanceContractId = maintenanceContractId;
                  this.maintenanceContractsDetailsService
                    .addWithResponse('Add?checkAll=false', element)
                    .subscribe({
                      next: (res) => {
                        if (res != null) {
                        }
                      },
                    });
                });

                this.maintenanceContractDues.forEach((element) => {
                  element.id = 0;
                  element.maintenanceContractId = maintenanceContractId;
                  // element.isEntryGenerated = this.isGenerateEntryByDue;
                  this.maintenanceContractDuesService
                    .addWithResponse('Add?checkAll=false', element)
                    .subscribe({
                      next: (res) => {
                        if (res != null) {
                        }
                      },
                    });
                });
              });


              // if (this.isGenerateEntryByDue == true) {
              //   this.maintenanceContractsService.generateEntry(maintenanceContractId).subscribe({
              //     next: (res) => {
              //       if (res != null) {
              //       }
              //     }
              //   })
              // }
            }
            this.spinner.hide();
            this.showResponseMessage(true, AlertTypes.update);
            resolve();
            //  this.navigateUrl(this.listUrl);
            this.router.navigate(
              ['/control-panel/maintenance/maintenance-contracts-list'],
              { queryParams: { settingid: this.settingId } }
            );
          },
          error: (err: any) => {
            //reject(err);
            resolve();
          },
          complete: () => {
            ////(('complete');
            resolve();
          },
        });
      this.subsList.push(sub);
    });
  }
  deleteContractForUpdate(contractId: any) {
    let sub = this.maintenanceContractsService
      .deleteMaintenanceContractAndRealtivesForUpdate(contractId)
      .subscribe((resonse) => { });

    this.subsList.push(sub);
  }
  getMaintenanceContractsPeriodTypes() {
    if (this.lang == 'en') {
      this.periodTypes = convertEnumToArray(MaintenanceContractPeriodTypesEnum);
    }
    else {
      this.periodTypes = convertEnumToArray(MaintenanceContractPeriodTypesArEnum);

    }
  }
  getMaintenanceMethodTypesEnum() {
    if (this.lang == 'en') {
      this.paymentMethodTypes = convertEnumToArray(MaintenanceMethodTypesEnum);
    }
    else {
      this.paymentMethodTypes = convertEnumToArray(MaintenanceMethodTypesArEnum);

    }
  }
  onChangeProductCatgeory() {
    this.products = this.searhProducts.filter(
      (x) => x.productCategoryId == this.selectMaintenancecontractsDetails.productCategoryId
    );
  }
  onChangeProduct() {

    this.selectMaintenancecontractsDetails.price = this.products.find((x) => x.id == this.selectMaintenancecontractsDetails.productId)?.sellPrice;
    if (this.selectMaintenancecontractsDetails.quantity > 0 && this.selectMaintenancecontractsDetails.price > 0) {
      this.onChangeQuantityOrPrice();
    }
  }
  onChangeQuantityOrPrice() {
    this.selectMaintenancecontractsDetails.valueBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenancecontractsDetails.quantity) * Number(this.selectMaintenancecontractsDetails.price)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenancecontractsDetails.quantity) * Number(this.selectMaintenancecontractsDetails.price))
    this.selectMaintenancecontractsDetails.valueAfterTax = this.selectMaintenancecontractsDetails.valueBeforeTax
  }
  onChangeQuantityOrPriceAdded(i:any) {
    this.maintenancecontractsDetails[i].valueBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.maintenancecontractsDetails[i].quantity) * Number(this.maintenancecontractsDetails[i].price)).toFixed(this.numberOfFraction)
        : Number(this.maintenancecontractsDetails[i].quantity) * Number(this.maintenancecontractsDetails[i].price))
    this.maintenancecontractsDetails[i].valueAfterTax = this.maintenancecontractsDetails[i].valueBeforeTax
  }
  addProduct() {
    if (this.selectMaintenancecontractsDetails.productCategoryId == undefined || this.selectMaintenancecontractsDetails.productCategoryId == null || this.selectMaintenancecontractsDetails.productCategoryId == 0) {
      this.errorMessage = this.translate.transform('general.product-category-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectMaintenancecontractsDetails.productId == undefined || this.selectMaintenancecontractsDetails.productId == null || this.selectMaintenancecontractsDetails.productId == 0) {
      this.errorMessage = this.translate.transform('general.product-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectMaintenancecontractsDetails.quantity == undefined || this.selectMaintenancecontractsDetails.quantity == null || this.selectMaintenancecontractsDetails.quantity == 0) {
      this.errorMessage = this.translate.transform('general.quantity-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectMaintenancecontractsDetails.price == undefined || this.selectMaintenancecontractsDetails.price == null || this.selectMaintenancecontractsDetails.price == 0) {
      this.errorMessage = this.translate.transform('general.price-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    this.maintenancecontractsDetails.push({
      id: undefined,
      maintenanceContractId: undefined,
      productCategoryId: this.selectMaintenancecontractsDetails.productCategoryId,
      categoryNameAr: this.selectMaintenancecontractsDetails?.categoryNameAr ?? '',
      categoryNameEn: this.selectMaintenancecontractsDetails?.categoryNameEn ?? '',
      productId: this.selectMaintenancecontractsDetails?.productId ?? 0,
      productNameAr: this.selectMaintenancecontractsDetails?.productNameAr ?? '',
      productNameEn: this.selectMaintenancecontractsDetails?.productNameEn ?? '',
      quantity: Number(this.selectMaintenancecontractsDetails?.quantity ?? 0),
      price: Number(this.selectMaintenancecontractsDetails?.price ?? 0),
      valueBeforeTax: Number(this.selectMaintenancecontractsDetails?.valueBeforeTax ?? ''),
      userId: undefined,
      taxRatio: Number(this.selectMaintenancecontractsDetails?.taxRatio ?? 0),
      taxValue: Number(this.selectMaintenancecontractsDetails?.taxValue ?? 0),
      valueAfterTax: Number(this.selectMaintenancecontractsDetails?.valueAfterTax ?? 0),
    });

    this.totalBeforeTax +=
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenancecontractsDetails?.valueBeforeTax ?? 0)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenancecontractsDetails?.valueBeforeTax ?? 0));

    this.totalTax +=
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenancecontractsDetails?.taxValue ?? 0)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenancecontractsDetails?.taxValue ?? 0))
    this.totalAfterTax +=
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenancecontractsDetails?.valueAfterTax ?? 0)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenancecontractsDetails?.valueAfterTax ?? 0))
    this.cleanProduct();
    this.cleanMaintenancecontractsDetails();
  }
  // deleteProduct(item: VwMaintenancecontractsDetails) {
  //   if (item != null) {
  //     let removedItem = this.products.find((x) => x.id == item.productId);
  //     const index: number = this.products.indexOf(removedItem!);
  //     //const index: number = this.maintenancecontractsDetails.indexOf(item);
  //     if (index !== -1) {
  //       this.maintenancecontractsDetails.splice(index, 1);
  //       this.totalBeforeTax = this.totalBeforeTax - item.valueBeforeTax;
  //       this.totalTax = this.totalTax - item.taxValue;
  //       this.totalAfterTax = this.totalAfterTax - item.valueAfterTax;
  //     }
  //   }
  // }
  ContractIssued() {
     
    if (this.isGenerateEntryByDue == true) {
      if (
        this.maintenanceContracts.supplierId == '' ||
        this.maintenanceContracts.supplierId == null ||
        this.maintenanceContracts.supplierId == undefined
      ) {
        this.errorMessage = this.translate.transform(
          'general.supplier-required'
        );
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(
          this.errorMessage,
          this.translate.transform('general.error')
        );
        return;
      }
      if (
        this.maintenanceContracts.supplierAccountId == '' ||
        this.maintenanceContracts.supplierAccountId == null ||
        this.maintenanceContracts.supplierAccountId == undefined
      ) {
        this.errorMessage = this.translate.transform(
          'general.supplier-account-required'
        );
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(
          this.errorMessage,
          this.translate.transform('general.error')
        );
        return;
      }
      if (
        this.maintenanceContracts.expenseAccountId == '' ||
        this.maintenanceContracts.expenseAccountId == null ||
        this.maintenanceContracts.expenseAccountId == undefined
      ) {
        this.errorMessage = this.translate.transform(
          'general.expense-account-required'
        );
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(
          this.errorMessage,
          this.translate.transform('general.error')
        );
        return;
      }
      if (this.totalTax > 0) {
        if (
          this.maintenanceContracts.taxAccountId == '' ||
          this.maintenanceContracts.taxAccountId == null ||
          this.maintenanceContracts.taxAccountId == undefined
        ) {
          this.errorMessage = this.translate.transform(
            'general.tax-account-required'
          );
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(
            this.errorMessage,
            this.translate.transform('general.error')
          );
          return;
        }
      }
      this.maintenanceContractsService
        .generateEntry(this.maintenanceContractsForm.value.id)
        .subscribe({
          next: (res) => {
            if (res != null) {
            }
          },
        });
    }


    this.maintenanceContractsService
      .addWithUrl(
        "updateContractStatus",
        this.maintenanceContractsForm.value.id
      ).subscribe({
        next: (res) => {
           
          this.showResponseMessage(true, AlertTypes.issue);
          this.router.navigate(
            ['/control-panel/maintenance/maintenance-contracts-list'],
            { queryParams: { settingid: this.settingId } }
          );

        },
        error: (err) => {
          this.spinner.hide();
        },
        complete: () => { }
      });

  }
  setToolbarComponentData() {
    let contractEnName = localStorage.getItem("contractEnName")!;
    let contractArName = localStorage.getItem("contractArName")!;
    this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'اضافة' + ' ' + contractArName : 'Add' + ' ' + contractEnName
    this.toolbarPathData.componentList = this.lang == 'ar' ? contractArName : contractEnName
    this.contractData = this.lang == 'ar' ? 'بيانات' + ' ' + contractArName : contractEnName + ' ' + 'data'
  }
  listenToClickedButton() {
    let sub = this.SharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.setToolbarComponentData();
            this.SharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate(
              ['/control-panel/maintenance/maintenance-contracts-list'],
              { queryParams: { settingid: this.settingId } }
            );
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {

            this.setToolbarComponentData();
            this.router.navigate([this.addUrl]);
            this.cleanMaintenanceContracts();
            this.maintenancecontractsDetails = [];
            this.SharedServices.changeToolbarPath(this.toolbarPathData);
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
            this.onUpdate();
          } else if (
            currentBtn.action == ToolbarActions.Issue &&
            currentBtn.submitMode
          ) {
            this.ContractIssued();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.SharedServices.changeToolbarPath(this.toolbarPathData);
  }
  get pr(): { [key: string]: AbstractControl } {
    return this.maintenanceContractsForm.controls;
  }
  getStartDate(selectedDate: { year: number; month: number; day: number }) {
    this.startDate = selectedDate;
  }
  getEndDate(selectedDate: { year: number; month: number; day: number }) {
    this.endDate = selectedDate;
  }
  getFirstDueDate(selectedDate: { year: number; month: number; day: number }) {
    this.firstDueDate = selectedDate;
  }
  getEndDate2() {
    this.endDate = this.dateService.getDateForCalender(
      this.startDate.month +
      1 +
      '/' +
      this.startDate.day +
      '/' +
      (this.startDate.year + 1)
    );
  }
  getProductsReceiptDetails(maintenanceRequestId: any) {
    if (maintenanceRequestId != null && maintenanceRequestId > 0) {
      return new Promise<void>((resolve, reject) => {
        let sub = this.store
          .select(ProductsReceiptDetailsSelectors.selectors.getListSelector)
          .subscribe({
            next: (res: ProductsReceiptDetailsModel) => {
              if (res != null) {
                this.maintenancecontractsDetails = JSON.parse(
                  JSON.stringify(
                    res.list.filter(
                      (x) => x.maintenanceRequestId == maintenanceRequestId
                    )
                  )
                );
              } else {
                this.maintenancecontractsDetails = [];
              }
              resolve();
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => { },
          });
        this.subsList.push(sub);
      });
    } else {
      this.maintenancecontractsDetails = [];
      return;
    }
  }

  getMaintenanceContractsById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceContractsService
        .getWithResponse<MaintenanceContracts>(
          'GetByFieldName?fieldName=Id&fieldValue=' + id
        )
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.maintenanceContracts = JSON.parse(JSON.stringify(res.data));
              this.setFormValue();
              resolve();
            }
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }


  getMaintenanceContractsDetailsById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceContractsDetailsService
        .getWithResponse<VwMaintenancecontractsDetails[]>(
          'GetListByFieldNameVM?fieldName=Maintenance_Contract_Id&fieldValue=' +
          id
        )
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.maintenancecontractsDetails = JSON.parse(
                JSON.stringify(
                  res.data?.filter((x) => x.maintenanceContractId == id)
                )
              );
            }
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }

  getMaintenanceContractsSettingsDetailsById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceContractsSettingsDetailsService
        .getWithResponse<any>(
          'GetListByFieldNameVM?fieldName=Contract_Setting_Id&fieldValue=' + id
        )
        .subscribe({
          next: (res) => {
            if (res.success) {
              ;
              this.isGenerateEntryByDue = res.data[0].isGenerateEntryByDue;
            }
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
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
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }
  setFormValue() {
    this.maintenanceContractsForm.setValue({
      id: this.maintenanceContracts?.id,
      contractNumber: this.maintenanceContracts?.contractNumber,

      maintenanceContractSettingId:
        this.maintenanceContracts?.maintenanceContractSettingId,
      supplierId: this.maintenanceContracts?.supplierId,
      maintenanceServiceId: this.maintenanceContracts?.maintenanceServiceId,
      date: this.dateService.getDateForCalender(
        this.maintenanceContracts?.date
      ),
      startDate: this.dateService.getDateForCalender(
        this.maintenanceContracts?.startDate
      ),
      endDate: this.dateService.getDateForCalender(
        this.maintenanceContracts?.endDate
      ),
      paymentsCount: this.maintenanceContracts?.paymentsCount,
      periodBetweenPayments: this.maintenanceContracts?.periodBetweenPayments,
      periodType: this.maintenanceContracts?.periodType,
      firstDueDate: this.dateService.getDateForCalender(
        this.maintenanceContracts?.firstDueDate
      ),
      totalBeforeTax:
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.maintenanceContracts?.totalBeforeTax).toFixed(this.numberOfFraction)
          : this.maintenanceContracts?.totalBeforeTax),
      totalTax:
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.maintenanceContracts?.totalTax).toFixed(this.numberOfFraction)
          : this.maintenanceContracts?.totalTax),
      totalAfterTax:
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.maintenanceContracts?.totalAfterTax).toFixed(this.numberOfFraction)
          : this.maintenanceContracts?.totalAfterTax),
      period: this.maintenanceContracts?.period,
      paymentMethodType: this.maintenanceContracts?.paymentMethodType,
      supplierAccountId: this.maintenanceContracts?.supplierAccountId,
      expenseAccountId: this.maintenanceContracts?.expenseAccountId,
      taxAccountId: this.maintenanceContracts?.taxAccountId,
      contractStatus: this.maintenanceContracts?.contractStatus,
    });

    this.id = this.maintenanceContracts?.id;
    this.contractNumber = this.maintenanceContracts?.contractNumber;
    this.settingId = this.maintenanceContracts?.maintenanceContractSettingId;
    this.startDate = this.dateService.getDateForCalender(
      this.maintenanceContracts?.startDate
    );
    this.endDate = this.dateService.getDateForCalender(
      this.maintenanceContracts?.endDate
    );
    this.totalBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.maintenanceContracts?.totalBeforeTax).toFixed(this.numberOfFraction)
        : this.maintenanceContracts?.totalBeforeTax);
    this.totalTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.maintenanceContracts?.totalTax).toFixed(this.numberOfFraction)
        : this.maintenanceContracts?.totalTax);
    this.totalAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.maintenanceContracts?.totalAfterTax).toFixed(this.numberOfFraction)
        : this.maintenanceContracts?.totalAfterTax);

    this.getMaintenanceContractsSettingsDetailsById(this.settingId);
  }
  getInstallmentsCount() {
    this.paymentsCount = 0;
    if (this.periodType == 1) {
      this.paymentsCount =
        (12 * this.maintenanceContractsForm.value.period) /
        this.periodBetweenPayments;
      // this.amountPerTime = (this.annualRentAmount * this.periodBetweenRemainAmount) / 12
    }
    if (this.periodType == 2) {
      this.periodBetweenPayments = 1;
      this.paymentsCount = this.maintenanceContractsForm.value.period;
    }
  }
  calculateContractDuesList(periodType: any) {
    this.maintenanceContractDues = [];
    let startContractDate;
    let endContractDate;
    let monthNo = 0;
    let taxAmount = 0;
    let expenseAmount = this.totalBeforeTax / this.paymentsCount;
    if (this.totalTax > 0) {
      taxAmount = this.totalTax;
      /// this.paymentsCount;
    }
    if (taxAmount > 0) {
      this.maintenanceContractDues.push({
        id: 0,
        maintenanceContractId: 0,
        dueAmount: taxAmount,
        dueStartDate: this.startDate.month +
          1 +
          '/' +
          this.startDate.day +
          '/' +
          this.startDate.year,
        dueEndDate: this.endDate.month +
          1 +
          '/' +
          this.endDate.day +
          '/' +
          this.endDate.year,
        isEntryGenerated: false,
        typeId: MaintenanceContractDuesEnum.Tax,
        paid: undefined,
        isInvoiced: false,
      });
    }
    for (let index = 0; index < this.paymentsCount; index++) {
      if (periodType == 1) {
        if (index == 0) {
          startContractDate =
            this.firstDueDate.month +
            1 +
            '/' +
            this.firstDueDate.day +
            '/' +
            this.firstDueDate.year;
          if (
            new Date(startContractDate).getMonth() +
            1 +
            this.periodBetweenPayments <=
            12
          ) {
            endContractDate =
              new Date(startContractDate).getMonth() +
              1 +
              this.periodBetweenPayments +
              '/' +
              new Date(startContractDate).getDate() +
              '/' +
              new Date(startContractDate).getFullYear();
          } else {
            monthNo =
              new Date(startContractDate).getMonth() +
              1 +
              this.periodBetweenPayments -
              12;
            endContractDate =
              monthNo +
              '/' +
              new Date(startContractDate).getDate() +
              '/' +
              (new Date(startContractDate).getFullYear() + 1);
            monthNo = 0;
          }
        } else {
          startContractDate = endContractDate;
          if (
            new Date(startContractDate).getMonth() +
            1 +
            this.periodBetweenPayments <=
            12
          ) {
            endContractDate =
              new Date(startContractDate).getMonth() +
              1 +
              this.periodBetweenPayments +
              '/' +
              new Date(startContractDate).getDate() +
              '/' +
              new Date(startContractDate).getFullYear();
          } else {
            monthNo =
              new Date(startContractDate).getMonth() +
              1 +
              this.periodBetweenPayments -
              12;
            endContractDate =
              monthNo +
              '/' +
              new Date(startContractDate).getDate() +
              '/' +
              (new Date(startContractDate).getFullYear() + 1);
            monthNo = 0;
          }
        }
      } else if (periodType == 2) {
        if (index == 0) {
          startContractDate =
            this.firstDueDate.month +
            1 +
            '/' +
            this.firstDueDate.day +
            '/' +
            this.firstDueDate.year;
          endContractDate =
            new Date(startContractDate).getMonth() +
            1 +
            '/' +
            new Date(startContractDate).getDate() +
            '/' +
            (new Date(startContractDate).getFullYear() + 1);
        } else {
          startContractDate = endContractDate;
          endContractDate =
            new Date(startContractDate).getMonth() +
            1 +
            '/' +
            new Date(startContractDate).getDate() +
            '/' +
            (new Date(startContractDate).getFullYear() + 1);
        }
      }
      this.maintenanceContractDues.push({
        id: 0,
        maintenanceContractId: 0,
        dueAmount: expenseAmount,
        dueStartDate: startContractDate,
        dueEndDate: endContractDate,
        isEntryGenerated: false,
        typeId: MaintenanceContractDuesEnum.Expense,
        paid: undefined,
        isInvoiced: false,
      });

    }

  }
  getEndContractDateByPeriod() {
    if (
      this.maintenanceContractsForm.value.period != null &&
      this.maintenanceContractsForm.value.paymentMethodType == 2
    ) {
      let period = this.maintenanceContractsForm.value.period;
      this.endDate = this.dateService.getDateForCalender(
        this.startDate.month +
        1 +
        '/' +
        this.startDate.day +
        '/' +
        (this.startDate.year + period)
      );
      this.paymentsCount = this.paymentsCount * period;
      // if (this.maintenanceContractsForm.value.paymentMethodType > 0) {
      //   this.calculateContractDuesList(this.maintenanceContractsForm.value.paymentMethodType);
      // }
    }
  }
  onChangeTaxRatio() {
    this.selectMaintenancecontractsDetails.taxValue =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenancecontractsDetails.valueBeforeTax) * Number(this.selectMaintenancecontractsDetails.taxRatio / 100)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenancecontractsDetails.valueBeforeTax) * Number(this.selectMaintenancecontractsDetails.taxRatio / 100));

    if (this.selectMaintenancecontractsDetails.taxValue > 0) {
      this.selectMaintenancecontractsDetails.valueAfterTax =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenancecontractsDetails.valueBeforeTax) + Number(this.selectMaintenancecontractsDetails.taxValue)).toFixed(this.numberOfFraction)
          : Number(this.selectMaintenancecontractsDetails.valueBeforeTax) + Number(this.selectMaintenancecontractsDetails.taxValue));
    } else {
      this.selectMaintenancecontractsDetails.valueAfterTax =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenancecontractsDetails.valueBeforeTax)).toFixed(this.numberOfFraction)
          : Number(this.selectMaintenancecontractsDetails.valueBeforeTax))

    }
  }
  onChangeTaxRatioAdded(i) {
    this.maintenancecontractsDetails[i].taxValue =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.maintenancecontractsDetails[i].valueBeforeTax) * Number(this.maintenancecontractsDetails[i].taxRatio / 100)).toFixed(this.numberOfFraction)
        : Number(this.maintenancecontractsDetails[i].valueBeforeTax) * Number(this.maintenancecontractsDetails[i].taxRatio / 100));

    if (this.maintenancecontractsDetails[i].taxValue > 0) {
      this.maintenancecontractsDetails[i].valueAfterTax =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.maintenancecontractsDetails[i].valueBeforeTax) + Number(this.maintenancecontractsDetails[i].taxValue)).toFixed(this.numberOfFraction)
          : Number(this.maintenancecontractsDetails[i].valueBeforeTax) + Number(this.maintenancecontractsDetails[i].taxValue));
    } else {
      this.maintenancecontractsDetails[i].valueAfterTax =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.maintenancecontractsDetails[i].valueBeforeTax)).toFixed(this.numberOfFraction)
          : Number(this.maintenancecontractsDetails[i].valueBeforeTax))

    }
  }
  //#region Tabulator

  selectMaintenancecontractsDetails: VwMaintenancecontractsDetails =
    new VwMaintenancecontractsDetails();

  openProductCategorySearchDialog(i = -1) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectMaintenancecontractsDetails?.categoryNameAr ?? '';
    } else {
      searchTxt = this.maintenancecontractsDetails[i].categoryNameAr;
    }

    let data = this.productsCategories.filter((x) => {
      return (
        (x.categoryNameAr + ' ' + x.categoryNameAr)
          .toLowerCase()
          .includes(searchTxt) ||
        (x.categoryNameEn + ' ' + x.categoryNameEn)
          .toUpperCase()
          .includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectMaintenancecontractsDetails!.categoryNameAr =
          data[0].categoryNameAr;
        this.selectMaintenancecontractsDetails!.productCategoryId = data[0].id;
      } else {
        this.maintenancecontractsDetails[i].categoryNameAr =
          data[0].categoryNameAr;
        this.maintenancecontractsDetails[i].productCategoryId = data[0].id;
      }
      this.getProducts();
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم الانجليزى'];
      let names = ['id', 'categoryNameAr', 'categoryNameEn'];
      let title = 'بحث عن الصنف';

      let sub = this.searchDialog
        .showDialog(lables, names, this.productsCategories, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {
              this.selectMaintenancecontractsDetails!.categoryNameAr =
                d.categoryNameAr;
              this.selectMaintenancecontractsDetails!.productCategoryId = d.id;
            } else {
              this.maintenancecontractsDetails[i].categoryNameAr =
                d.categoryNameAr;
              this.maintenancecontractsDetails[i].productCategoryId = d.id;
            }
            this.onChangeProductCatgeory();
          }
        });
      this.subsList.push(sub);
    }
    // this.onVoucherDetailsChange.emit(this.productsReceiptDetails);
  }

  openProductSearchDialog(i = -1) {

    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectMaintenancecontractsDetails?.productNameAr ?? '';
    } else {
      searchTxt = this.products[i].productNameAr;
    }

    let data = this.products.filter((x) => {
      return (
        (x.productNameAr + ' ' + x.productNameAr)
          .toLowerCase()
          .includes(searchTxt) ||
        (x.productNameEn + ' ' + x.productNameEn)
          .toUpperCase()
          .includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectMaintenancecontractsDetails!.productNameAr =
          data[0].productNameAr;
        this.selectMaintenancecontractsDetails!.productId = data[0].id;
      } else {
        this.maintenancecontractsDetails[i].productNameAr =
          data[0].productNameAr;
        this.maintenancecontractsDetails[i].productId = data[0].id;
      }
      this.onChangeProduct();
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم اللاتيني'];
      let names = ['id', 'productNameAr', 'productNameEn'];
      let title = 'بحث عن الصنف';

      let sub = this.searchDialog
        .showDialog(lables, names, this.products, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {
              this.selectMaintenancecontractsDetails!.productNameAr =
                d.productNameAr;
              this.selectMaintenancecontractsDetails!.productId = d.id;
            } else {
              this.maintenancecontractsDetails[i].productNameAr =
                d.productNameAr;
              this.maintenancecontractsDetails[i].productId = d.id;
            }
            this.onChangeProduct()
          }
        });
      this.subsList.push(sub);
    }
  }
  cleanMaintenancecontractsDetails() {
    this.selectMaintenancecontractsDetails = {
      id: 0,
      productId: '',
      valueBeforeTax: 0,
      price: 0,
      taxRatio: 0,
      taxValue: 0,
      quantity: 0,
      valueAfterTax: 0,
      productNameAr: '',
      productNameEn: '',
      maintenanceContractId: 0,
      productCategoryId: 0,
      categoryNameAr: '',
      categoryNameEn: '',
      userId: 0,
    };
  }
  deleteItem(index) {

    if (this.maintenancecontractsDetails.length) {
      let maintenanceContractObj = this.maintenancecontractsDetails[index];
      if (this.maintenancecontractsDetails.length == 1) {
        this.maintenancecontractsDetails = [];
      } else {
        this.maintenancecontractsDetails.splice(index, 1);
      }
      if (index !== -1) {

        this.totalBeforeTax = this.totalBeforeTax - maintenanceContractObj?.valueBeforeTax ?? 0;
        this.totalTax = this.totalTax - maintenanceContractObj?.taxValue ?? 0;
        this.totalAfterTax = this.totalAfterTax - maintenanceContractObj?.valueAfterTax ?? 0;
        this.cleanMaintenancecontractsDetails();
      }
    }
    this.cleanMaintenancecontractsDetails();
  }
  updateMaintenanceContractDetailsData(item: VwMaintenancecontractsDetails) {
    if (this.maintenancecontractsDetails.length > 0) {
      this.deleteMaintenanceContractDetailsForUpdate(item);
      this.addMaintenanceContractDetailsForUpdate(item);
    }

  }
  deleteMaintenanceContractDetailsForUpdate(item: VwMaintenancecontractsDetails) {
    if (item != null) {
      const index: number = this.maintenancecontractsDetails.indexOf(item);
      if (index !== -1) {
        this.maintenancecontractsDetails.splice(index, 1);
        this.totalBeforeTax = 0;
        this.totalTax = 0;
        this.totalAfterTax = 0;

      }

    }

  }
  showConfirmMaintenanceContractDetailsAddedMessage(item) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("general.confirm-delete");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      if (rs == "Confirm") {
        this.deleteMaintenanceContractDetails(item);
      }
    })

  }
  deleteMaintenanceContractDetails(item: VwMaintenancecontractsDetails) {
    if (item != null) {
      const index: number = this.maintenancecontractsDetails.indexOf(item);
      if (index !== -1) {
        this.maintenancecontractsDetails.splice(index, 1);
         ;
        this.totalBeforeTax = this.totalBeforeTax - item.valueBeforeTax;
        this.totalTax = this.totalTax - item.taxValue;
        this.totalAfterTax = this.totalAfterTax - item.valueAfterTax;


      }

    }


  }
  addMaintenanceContractDetailsForUpdate(item: VwMaintenancecontractsDetails) {
    this.maintenancecontractsDetails.push(
      {
        id: item.id,
        maintenanceContractId: item.maintenanceContractId,
        productCategoryId: item.productCategoryId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        valueBeforeTax: item.valueBeforeTax,
        taxRatio: item.taxRatio,
        taxValue: item.taxValue,
        valueAfterTax: item.valueAfterTax,
        categoryNameAr: item.categoryNameAr,
        categoryNameEn: item.categoryNameEn,
        productNameAr: item.productNameAr,
        productNameEn: item.productNameEn,
        userId: undefined
      }
    )

    this.maintenancecontractsDetails.forEach(item => {
       
     this.totalBeforeTax+=item.valueBeforeTax
     this.totalTax+=item.taxValue
     this.totalAfterTax+=item.valueAfterTax



    }
    )

  }


}


