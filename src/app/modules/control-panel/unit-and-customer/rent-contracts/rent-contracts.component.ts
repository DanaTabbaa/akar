import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnualIncreaseInRentEnum, PaymentTimeTypesEnum, ContractUnitsServicesAccountsEnum, CalendarTypesEnum, CalendarTypesArEnum, ContractMarketingTypeEnum, convertEnumToArray, OfficAmountTypeEnum, PaymentDateEnum, PaymentMethodsEnum, pursposeTypeEnum, pursposeTypeArEnum, RentContractTypeEnum, RentPeriodTypeEnum, SubLeasingEnum, TenantRepresentativeEnum, PaymentsMethodsInRentContractEnum, CalculateMethodsInRentContractEnum, RentContractDuesEnum, RentContractStatusEnum, UnitStatusEnum, PaymentMethodsArEnum, RentPeriodTypeArEnum, ContractMarketingTypeArEnum, RentContractTypeArEnum, PaymentDateArEnum, OfficAmountTypeArEnum, AnnualIncreaseInRentArEnum, TenantRepresentativeArEnum, PaymentTimeTypesArEnum, PaymentsMethodsInRentContractArEnum, CalculateMethodsInRentContractArEnum, ContractUnitsServicesAccountsArEnum, AlertTypes, accountType, PermissionType, AccIntegrationTypeEnum } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Building } from 'src/app/core/models/buildings';
import { Owner } from 'src/app/core/models/owners';
import { Realestate } from 'src/app/core/models/realestates';
import { Tenants } from 'src/app/core/models/tenants';
import { Unit } from 'src/app/core/models/units';
import { RentContractUnit } from 'src/app/core/models/rent-contract-units';
import { Vendors } from 'src/app/core/models/vendors';
import { VendorCommissions } from 'src/app/core/models/vendor-commissions';
import { RentContractsMaintenance } from 'src/app/core/models/rent-contracts-maintenance';
import { MaintenanceServices } from 'src/app/core/models/maintenance-services';
import { RentContract } from 'src/app/core/models/rent-contracts';
import { Office } from 'src/app/core/models/offices';
import { UnitServices } from 'src/app/core/models/unit-services';
import { RentContractUnitsServices } from 'src/app/core/models/rent-contract-units-services';
import { RentContractServiceModel } from 'src/app/core/models/rent-contract-services';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { RentContractDues } from 'src/app/core/models/rent-contract-dues';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { Accounts } from 'src/app/core/models/accounts';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectedUnit } from 'src/app/core/models/offer-unit-details';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { SystemSettings } from 'src/app/core/models/system-settings';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { DatePipe } from '@angular/common';
import { NewCode } from 'src/app/core/view-models/new-code';
import { GeneralIntegrationSettings } from 'src/app/core/models/general-integration-settings';

@Component({
  selector: 'app-rent-contracts',
  templateUrl: './rent-contracts.component.html',
  styleUrls: ['./rent-contracts.component.scss']
})
export class RentContractsComponent implements OnInit, AfterViewInit, OnDestroy {
  subsList: Subscription[] = [];
  selectedContrcatService: RentContractServiceModel = new RentContractServiceModel();
  activeTab = 1;
  showIssue: boolean = true;
  contractsSettings: ContractsSettings = new ContractsSettings();
  showWhenTenentShouldPay: boolean = true;
  parentContractId: any;
  addUrl: any;
  updateUrl: any;
  listUrl: any;
  toolbarPathData: ToolbarPath = {
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: 'component-names.list-rent-contracts',
    componentAdd: '',

  };
  contractForm!: FormGroup;
  annualIncreaseRatio!: number;
  annualIncreaseAmount!: number;
  annualIncreaseChecked!: number;
  systemSettings: SystemSettings = new SystemSettings();
  contractDate!: DateModel;
  firstDueDate!: DateModel;
  startContractDate!: DateModel;
  endContractDate!: DateModel;
  maintenanceDate!: DateModel;
  calendarTypes: ICustomEnum[] = [];
  paymentMethodTypes: ICustomEnum[] = [];
  contractMarketingTypes: ICustomEnum[] = [];
  rentContractTypes: ICustomEnum[] = [];
  officeAmountTypes: ICustomEnum[] = [];
  annualIncreaseInRent: ICustomEnum[] = [];
  rentMethodTypes: ICustomEnum[] = [];
  paymentDate: ICustomEnum[] = [];
  paymentTimeTypes: ICustomEnum[] = [];
  paymentsMethodsInRentContract: ICustomEnum[] = [];
  calculateMethodsInRentContract: ICustomEnum[] = [];
  fromServiceAccount: ICustomEnum[] = [];
  toServiceAccount: ICustomEnum[] = [];
  owners: Owner[] = [];
  tenants: Tenants[] = [];
  realestates: Realestate[] = [];
  buildings: Building[] = [];
  units: Unit[] = [];
  maintenanceUnits: Unit[] = [];
  vendors: Vendors[] = [];
  offices: Office[] = [];
  vendorCommissions: VendorCommissions[] = [];
  maintenanceServices: MaintenanceServices[] = [];
  selectedRentContractUnits: RentContractUnit[] = [];
  selectedSearchRentContractUnit: RentContractUnit = new RentContractUnit();
  selectedRentContractUnitsServices: RentContractUnitsServices[] = [];
  selectedRentContractServices: RentContractServiceModel[] = [];
  selectedRentContractsMaintenance: RentContractsMaintenance[] = [];
  rentContractsMaintenance: RentContractsMaintenance[] = [];
  unitServices: UnitServices[] = [];
  ownerAccounts: Accounts[] = [];
  tenantAccounts: Accounts[] = [];
  ownerInsurranceAccounts: Accounts[] = [];
  ownerTaxAccounts: Accounts[] = [];
  //ownerAccurredRevenueAccounts: Accounts[] = [];
  ownerDeferredRevenueAccounts: Accounts[] = [];
  rentContractDues: RentContractDues[] = []
  rentContractDueList: RentContractDues[] = [];
  tenantRepresentative: ICustomEnum[] = [];
  id: any = 0;
  officeAmountType: any;
  showOfficeAmountPercentage: boolean = false;
  showOfficeAmountValue: boolean = false;
  showAnnualIncreaseInRent: boolean = false;
  showAnnualIncreaseAmount: boolean = false;
  showRealestateDeveloper: boolean = false;
  showWhenTheTenantShouldPay: boolean = false;
  showInstallments: boolean = false;
  maintenanceDescription: any;
  maintenanceServiceId: any;
  maintenanceUnitId: any;
  contractValueTotal: number = 0;
  contractSetting?: ContractsSettings;
  settingId: any;
  displayNameInEnglish!: string;
  renewContract = 0;
  renewType?: string;
  public url?: string;
  orginalUrlPage?: string;
  isRenew!: string;
  lang: string = '';
  contractData: string = '';
  generalAccountIntegration!: GeneralIntegrationSettings | null;

  //
  //#region constructor

  constructor(
    private sharedServices: SharedService,
    private rentContractsService: RentContractsService,
    private alertsService: NotificationsAlertsService,
    private systemSettingsService: SystemSettingsService,
    private dateService: DateCalculation,
    private dateConverterService: DateConverterService,
    private translate: TranslatePipe,
    private router: Router,
    private fb: FormBuilder, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private searchDialog: SearchDialogService,
    private modalService: NgbModal,
    private managerService: ManagerService,
    private datePipe: DatePipe
  ) {
    this.createForm();

  }
  //#endregion

  //oninit
  ngOnInit(): void {
    this.sharedServices.setPermissionsStatus({ permissionStatus: PermissionType.Contract });

    this.startContractDate = this.dateService.getCurrentDate();
    this.endContractDate = this.dateService.getCurrentDate();
    this.contractDate = this.dateService.getCurrentDate();
    this.firstDueDate = this.dateService.getCurrentDate();
    this.getCalendarTypes();
    this.getMarketingType();
    this.getRentContractTypes();
    this.getOfficeAmountTypes();
    this.getAnnualIncrease();
    this.getPaymentMethodTypes();
    this.getRentMethodTypes();
    this.getPaymentDate();
    this.getPaymentTimeTypes();
    this.getPaymentsMethodsInRentContract();
    this.getCalculateMethodsInRentContract();
    this.getContractUnitsServicesAccountsEnum();
     
    this.spinner.show();

    Promise.all([
      this.managerService.loadGeneralAccountIntegrationSetting(),
      this.getLanguage(),
      this.managerService.loadOwners(),
      this.managerService.loadRealestate(),
      this.managerService.loadBuildings(),
      this.managerService.loadUnitsByPurpose("1"),
      this.managerService.loadOffices(),
      this.managerService.loadSystemSettings(),
      this.managerService.loadTenantsByRole("0"),
      this.managerService.loadVendors(),
      this.managerService.loadUnitservices(),
      this.managerService.loadContractSettings(),
      this.managerService.loadAccounts(),
      this.managerService.loadVendors(),
      this.managerService.loadVendorCommissions(),
      this.managerService.loadCurrentRoleAndPermission(),
    ])
      .then(a => {
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

        this.spinner.hide();
        this.updateContractEndDate();
        this.unitServices = this.managerService.getUnitServices();
        this.getSystemSettings();
        this.owners = this.managerService.getOwners();
        this.realestates = this.managerService.getRealestates();
        this.offices = this.managerService.getOffices();
        this.tenants = this.managerService.getTenants();
        this.vendors = this.managerService.getVendors();
        this.vendorCommissions = this.managerService.getVendorCommissions();

        this.getRouteData();
        this.changePath();
        this.listenToClickedButton();
      })
      .catch(err => {
        this.spinner.hide();
      });
  }
  getRouteData() {
    let sub = this.route.queryParams.subscribe(params => {
      if (params['settingId'] || params['settingid']) {
        this.settingId = params['settingId'] ?? params['settingid'];

        this.contractForm.controls["rentContractSettingId"].setValue(this.settingId);
        this.contractSetting = this.managerService.getContractSettings().find(x => x.id == this.settingId);

        if (this.contractSetting) {

          this.setToolbarComponentData();

          if (this.managerService.getCurrentRole()) {
            let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
            if (perm) {
              this.sharedServices.setContractPermissions(perm);
            }
          }
        }
      }
      // else {
      //   this.settingId = localStorage.getItem("ContractSettingId")
      // }

      // this.loadContractPermission(this.settingId).then(a => {
      if (params['contractId']) {
        this.id = +params['contractId'];
        if (this.id == 0) {
          this.showIssue = false;

        }
        if (this.id) {
          localStorage.setItem("RecordId", params["id"]);

          this.getContractById(this.id).then(a => {
            this.spinner.hide();
            if (params['issue'] == 1) {
              this.sharedServices.changeButton({ action: 'Issue' } as ToolbarData);
            }
            else {
              this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
            }
            console.log("Listen To Click 1")

            // this.listenToClickedButton();

          }).catch(e => {
            this.spinner.hide();
          });

          // let contractEnName = localStorage.getItem("contractEnName")!;
          // let contractArName = localStorage.getItem("contractArName")!;

        } else {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: "New" } as ToolbarData);
          console.log("Listen To Click 2")
          //this.listenToClickedButton();
        }

      }
      else {

        this.getNewCode().then(newCode => {

          this.spinner.hide();
          this.contractForm.controls['code'].setValue(newCode);
          this.sharedServices.changeButton({ action: "New" } as ToolbarData);

          //this.listenToClickedButton();

        }).catch(e => {
          this.spinner.hide();
        })

      }





      if (params['renew'] != null) {
        this.isRenew = params['renew'];
      }
      if (this.isRenew == "true") {
        this.renewContract = 1;
        this.showIssue = false;
      }

      this.setRouteUrl(this.settingId, this.id, this.isRenew)
      // }).catch(e => {
      //   this.spinner.hide();
      // });

    });
    this.subsList.push(sub);
  }

  setToolbarComponentData() {

    this.contractData = this.lang == "ar" ? (this.contractSetting?.contractArName ?? "") : (this.contractSetting?.contractEnName ?? "");
    this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.contractData : 'Update' + ' ' + this.contractData
    this.toolbarPathData.componentList = this.contractData
    this.contractData = this.lang == 'ar' ? 'بيانات' + ' ' + this.contractData : this.contractData + ' ' + 'data';
    this.sharedServices.changeToolbarPath(this.toolbarPathData);

  }

  // loadContractPermission(settingId: any) {
  //   return this.managerService.loadContractSettingPagePermissions(settingId);
  // }

  setRouteUrl(settingId, contractId, renew) {
    let queryParams = "";
    if (settingId) {
      queryParams += "settingId=" + settingId
    }
    if (contractId) {
      queryParams += "contractId=" + contractId;
    }

    if (renew) {
      queryParams += "renew=" + renew;
    }
    if (queryParams) {
      queryParams = "?" + queryParams;
    }

    this.listUrl = '/control-panel/definitions/rent-contracts-list' + queryParams;
    this.addUrl = '/control-panel/definitions/add-rent-contract' + queryParams;
    this.updateUrl = '/control-panel/definitions/update-rent-contract' + queryParams;
    this.toolbarPathData = {
      listPath: this.listUrl,
      updatePath: this.updateUrl,
      addPath: this.addUrl,
      componentList: 'component-names.list-rent-contracts',
      componentAdd: 'component-names.add-rent-contract',
    };
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy() {
     
    this.subsList.forEach((s) => {
      if (s) {
         
        s.unsubscribe();
      }
    });
    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
    this.managerService.destroy();
    this.sharedServices.setPermissionsStatus({ permissionStatus: PermissionType.Pages });

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

  getSystemSettings() {
    if (this.managerService.getSystemSettings()?.length) {
      this.systemSettings = this.managerService.getSystemSettings()[0];
    }
  }
  updateEndDate(period, rentMethodType) {
    if (this.contractForm.value.calendarType == CalendarTypesEnum.Gregorian) {
      //1 == عقد ميلادي
      this.endContractDate = this.dateService.calculateEndDateForGregrion(period, rentMethodType, this.startContractDate, 1)
    }
    else {
      //2 == عقد هجري
      this.endContractDate = this.dateService.calculateEndDateForHijri(period, rentMethodType, this.startContractDate, 1)
    }
  }

  createForm() {


    this.contractForm = this.fb.group({
      id: 0,
      code: ['', Validators.compose([Validators.required])],
      rentMethodType: 2,
      period: '1',
      contractDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      createDate: '',
      startContractDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      endContractDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      calendarType: 1,
      whenTenentShouldPay: 1,
      amountPerTime: 0,
      ownerId: ['', Validators.compose([Validators.required])],
      tenantId: ['', Validators.compose([Validators.required])],
      realestateId: '',
      buildingId: ['', Validators.compose([Validators.required])],
      paymentMethodType: ['', Validators.compose([Validators.required])],
      advancedPayment: 0,
      countOfInstallments: '',
      periodBetweenInstallment: '1',
      unitBookingId: '',
      unitPriceOfferId: '',
      tenantAccountId: '',
      renewStartDate: '',
      renewEndDate: '',
      evacuationDate: '',
      contractStatus: '',
      paymentTimeType: '1',
      servicesOwnerAccountId: '',

      //
      ownerTaxAccountId: '',
      ownerInsurranceAccountId: '',
      ownerVendorAccountId: '',
      enableMaintainance: false,
      maintainanceCost: 0,
      officeAccountId: '',
      ownerAccountId: '',
      currencyId: '',
      vendorId: '',
      vendorCommissionTypeId: '',
      commissionId: '',
      contractAcceptanceDate: '',
      contractMarketingType: '',
      vendorAccountId: '',
      commissionTaxType: '',
      commissionTax: 0,
      commissionRatio: 0,
      brokerageFee: 0,
      securityDeposit: 0,
      brokerAgeFeeType: 0,
      securityDeposiType: 0,
      paidToDate: '',
      totalArea: 0,
      averagePriceOfMeter: 0,
      totalAmountOfRent: 0,
      totalInsurance: 0,
      totalWithTaxesAndInsurrance: 0,
      totalTaxes: 0,
      totalServiceTaxes: 0,
      totalAmountOfService: 0,
      officeAmountPercentage: 0,
      officeAmountValue: 0,
      officeAmountType: '',
      officeId: '',
      ownerDefferRevenueAccId: '',
      //ownerAccrudRevenueAccId: '',
      valueForTenant: 0,
      valueForOwner: 0,
      annualIncreaseRatio: 0,
      annualIncreaseAmount: 0,
      annualIncreaseChecked: 1,
      contractTenantRepresentativeId: '',
      parentContractId: 0,
      isArchivedContract: false,
      contractTypeId: '',
      annualRentAmount: 0,
      payOn: "1",
      contractPurpose: '',
      contractValueTotal: 0,
      paidAmount: 0,
      remainingAmount: 0,
      firstDueDate: [this.dateService.getCurrentDate()],
      rentContractSettingId: '',
      rentContractsUnits: [],
      rentContractsServices: [],
      rentContractsDues: [],
      settelmentServiceAccId: '',
      isRenew: false,
      previousContractStatus: ''
    })
  }

  getContractById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.rentContractsService.getWithResponse<RentContract>(`GetById?Id=${id}&includes=RentContractsUnits,RentContractsServices,RentContractsMaintenanace,RentContractsDues`).subscribe({
        next: (res: ResponseResult<RentContract>) => {
          resolve();
          if (res.data) {
            console.log("Contract Data===============", res.data);
            this.onChangeRealestate(res.data.realestateId);
            this.onChangeBuilding(res.data.buildingId);
            this.selectedRentContractUnitsServices = [];
            res.data.rentContractsUnits.forEach(a => {
              let unit = this.units.find(x => x.id == a.unitId)
              a.unitNameAr = unit?.unitNameAr ?? "";
              a.unitNameEn = unit?.unitNameEn ?? "";

              this.selectedRentContractUnitsServices.push({
                id: a.unitId,
                unitNameAr: a.unitNameAr,
                unitNameEn: a.unitNameEn
              })
            })

            this.selectedRentContractUnits = res.data.rentContractsUnits ?? [];
            this.contractForm.patchValue({
              ...res.data
            });


            this.rentContractDueList = res.data.rentContractsDues;
            res.data.rentContractsServices.forEach(a => {
              if (a.unitId) {
                let u = this.units.find(x => x.id == a.unitId);
                if (u) {
                  a.unitNameAr = u.unitNameAr;
                  a.unitNameEn = u.unitNameEn;

                }
              }
              if (a.serviceId) {
                let s = this.unitServices.find(x => x.id == a.serviceId);
                if (s) {
                  a.unitServiceNameAr = s.unitServiceArName;
                  a.unitServiceNameEn = s.unitServiceEnName;

                }
              }
              if (a.calcMethodType) {
                let m = this.calculateMethodsInRentContract.find(x => x.id == a.calcMethodType);
                if (m) {
                  a.calcMethodTypeName = m.name;
                }
              }

              if (a.payOnTimeId) {
                let m = this.paymentsMethodsInRentContract.find(x => x.id == a.payOnTimeId);
                if (m) {
                  a.payOnTimeName = m.name;
                }
              }
              if (a.fromAccount) {
                let m = this.fromServiceAccount.find(x => x.id == a.fromAccount);
                if (m) {
                  a.fromAccountName = m.name;
                }
              }

              if (a.toAccount) {
                let m = this.toServiceAccount.find(x => x.id == a.toAccount);
                if (m) {
                  a.toAccountName = m.name;
                }
              }
            });

            this.selectedRentContractServices = res.data.rentContractsServices;
            this.contractDate = this.dateService.getDateForCalender(res.data.contractDate);
            this.startContractDate = this.dateService.getDateForCalender(res.data.startContractDate);
            this.endContractDate = this.dateService.getDateForCalender(res.data.endContractDate);

            if (res.data.paymentMethodType == PaymentMethodsEnum.Installments) {
              this.showInstallments = true;
              this.showWhenTenentShouldPay = false;
            }
            else {
              this.showInstallments = false;
              this.showWhenTenentShouldPay = true;
            }



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



  getCalendarTypes() {
    if (this.lang == 'en') {
      this.calendarTypes = convertEnumToArray(CalendarTypesEnum);
    }
    else {
      this.calendarTypes = convertEnumToArray(CalendarTypesArEnum);

    }
  }
  getPaymentMethodTypes() {
    if (this.lang == 'en') {
      this.paymentMethodTypes = convertEnumToArray(PaymentMethodsEnum);
    }
    else {
      this.paymentMethodTypes = convertEnumToArray(PaymentMethodsArEnum);
    }
  }
  //getPaymentTimeTypes
  getPaymentTimeTypes() {
    if (this.lang == 'en') {
      this.paymentTimeTypes = convertEnumToArray(PaymentTimeTypesEnum);
    }
    else {
      this.paymentTimeTypes = convertEnumToArray(PaymentTimeTypesArEnum);
    }
  }
  getPaymentsMethodsInRentContract() {
    if (this.lang == 'en') {
      this.paymentsMethodsInRentContract = convertEnumToArray(PaymentsMethodsInRentContractEnum);
    }
    else {
      this.paymentsMethodsInRentContract = convertEnumToArray(PaymentsMethodsInRentContractArEnum);

    }
  }

  getCalculateMethodsInRentContract() {
    if (this.lang == 'en') {
      this.calculateMethodsInRentContract = convertEnumToArray(CalculateMethodsInRentContractEnum);
    }
    else {
      this.calculateMethodsInRentContract = convertEnumToArray(CalculateMethodsInRentContractArEnum);
    }
  }

  getContractUnitsServicesAccountsEnum() {
    if (this.lang == 'en') {
      this.fromServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsEnum);
      this.toServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsEnum);
    }
    else {
      this.fromServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsArEnum);
      this.toServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsArEnum);
    }
  }
  getRealestateDeveloper(contractMarketingTypeId: any) {
    this.showRealestateDeveloper = false
    if (contractMarketingTypeId == 1) {
      this.showRealestateDeveloper = true

    }
  }



  calculateInsuranceRatio(item: RentContractUnit) {
    if (item.annualRent) {
      item.insuranceRatio = this.systemSettingsService.setDecimalNumberSetting(100 * item.inssuranceAmount / item.annualRent, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
    }
    this.calculateContractTotals();
  }

  calculateInsuranceAmount(item: RentContractUnit) {
    if (item.annualRent) {
      item.inssuranceAmount = this.systemSettingsService.setDecimalNumberSetting(item.insuranceRatio * item.annualRent / 100, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
    }
    this.calculateContractTotals();
  }

  onChangeTaxRatio(item: RentContractUnit) {

    if (item.annualRent) {
      item.taxesAmount = this.systemSettingsService.setDecimalNumberSetting(item.taxRatio * item.annualRent / 100, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
    }
    this.calculateContractTotals();
  }

  calculateUnitTotals(item: RentContractUnit) {
    if (item.areaSize != 0 && item.pricePerMeter != 0) {
      item.annualRent = this.systemSettingsService.setDecimalNumberSetting(item.areaSize * item.pricePerMeter, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      item.monthlyRent = this.systemSettingsService.setDecimalNumberSetting((item.areaSize * item.pricePerMeter) / 12, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      item.inssuranceAmount = this.systemSettingsService.setDecimalNumberSetting((item.areaSize * item.pricePerMeter) * (item.insuranceRatio / 100), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      item.taxesAmount = this.systemSettingsService.setDecimalNumberSetting((item.areaSize * item.pricePerMeter) * (item.taxRatio / 100), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);

    }
    else {
      item.annualRent = 0;
      item.monthlyRent = 0;
      item.inssuranceAmount = 0;
      item.taxesAmount = 0;
    }
    this.calculateContractTotals();
  }
  onChangeAnnualRent(item: RentContractUnit) {
    if (item.areaSize) {
      item.pricePerMeter = this.systemSettingsService.setDecimalNumberSetting(item.annualRent / item.areaSize, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      this.calculateUnitTotals(item);
    }
    this.calculateContractTotals();
  }

  onChangeMonthlyRent(item: RentContractUnit) {
    if (item.areaSize) {
      item.annualRent = this.systemSettingsService.setDecimalNumberSetting(item.monthlyRent * 12, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      item.pricePerMeter = this.systemSettingsService.setDecimalNumberSetting(item.annualRent / item.areaSize, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      //this.calculateUnitTotals(item);
      item.inssuranceAmount = this.systemSettingsService.setDecimalNumberSetting((item.areaSize * item.pricePerMeter) * (item.insuranceRatio / 100), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      item.taxesAmount = this.systemSettingsService.setDecimalNumberSetting((item.areaSize * item.pricePerMeter) * (item.taxRatio / 100), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);

    }
    this.calculateContractTotals();
  }

  showConfirmDeleteUnitAddedMessage(item) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("rent-contracts.confirm-delete-unit");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      if (rs == "Confirm") {
        this.deleteContractUnit(item);

      }
    })



  }
  deleteContractUnit(item: RentContractUnit) {
    if (item != null) {
      const index: number = this.selectedRentContractUnits.indexOf(item);
      if (index !== -1) {
        let unitId = this.selectedRentContractUnits[index].unitId;
        this.selectedRentContractUnits.splice(index, 1);
        //this.selectedRentContractUnitsServices.splice(index, 1);        
        let serviceIndex = this.selectedRentContractServices.findIndex(x => x.unitId == unitId);
        while (serviceIndex != -1) {
          this.selectedRentContractServices.splice(serviceIndex, 1);
          serviceIndex = this.selectedRentContractServices.findIndex(x => x.unitId == unitId);
        }
        this.calculateContractTotals();
        this.refreshUnitServiceAmount();
        this.calculateContractDue();
      }
    }
  }

  deleteContractServices(item: RentContractServiceModel) {

    if (item != null) {
      const index: number = this.selectedRentContractServices.indexOf(item);
      if (index !== -1) {
        this.selectedRentContractServices.splice(index, 1);

      }

      this.calculateContractDue();

    }


  }
  deleteContractMaintenanceUnits(item: RentContractsMaintenance) {
    if (item != null) {

      const index: number = this.selectedRentContractsMaintenance.indexOf(item);
      if (index !== -1) {
        this.selectedRentContractsMaintenance.splice(index, 1);


      }


    }
  }
  getMarketingType() {
    if (this.lang == 'en') {
      this.contractMarketingTypes = convertEnumToArray(ContractMarketingTypeEnum);
    }
    else {
      this.contractMarketingTypes = convertEnumToArray(ContractMarketingTypeArEnum);

    }
  }
  getRentContractTypes() {
    if (this.lang == 'en') {
      this.rentContractTypes = convertEnumToArray(RentContractTypeEnum);
    }
    else {
      this.rentContractTypes = convertEnumToArray(RentContractTypeArEnum);

    }
  }
  getOfficeAmountTypes() {
    if (this.lang == 'en') {
      this.officeAmountTypes = convertEnumToArray(OfficAmountTypeEnum);
    }
    else {
      this.officeAmountTypes = convertEnumToArray(OfficAmountTypeArEnum);

    }

  }

  changePaymentMethodTypes(paymentMethodType: any) {


    let annualRentAmount = Number(this.contractForm.controls['totalAmountOfRent'].value);
    let countOfInstallments = Number(this.contractForm.controls['countOfInstallments'].value);


    this.showInstallments = false;

    this.showWhenTenentShouldPay = false;
    let amountPerTime = 0
    if (paymentMethodType == PaymentMethodsEnum.Monthly) {
      this.showWhenTenentShouldPay = true;

      amountPerTime = this.systemSettingsService.setDecimalNumberSetting(annualRentAmount / 12, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
    }
    if (paymentMethodType == PaymentMethodsEnum.Yearly) {

      this.showWhenTenentShouldPay = true;
      amountPerTime = this.systemSettingsService.setDecimalNumberSetting(annualRentAmount, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
    }


    if (paymentMethodType == PaymentMethodsEnum.Installments) {
      this.showInstallments = true;
      this.contractForm.controls['paymentTimeType'].setValue(PaymentTimeTypesEnum.Month);
      amountPerTime = this.systemSettingsService.setDecimalNumberSetting(annualRentAmount / countOfInstallments, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      this.calculateCountOfInstallments();

    }
    if (paymentMethodType == PaymentMethodsEnum.Daily) {
      this.showWhenTenentShouldPay = true;

      // this.showWhenTheTenantShouldPay=true;
      if (this.contractForm.controls['calendarType'].value == CalendarTypesEnum.Gregorian) {
        amountPerTime = this.systemSettingsService.setDecimalNumberSetting(annualRentAmount / 365, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      }
      else {
        amountPerTime = this.systemSettingsService.setDecimalNumberSetting(annualRentAmount / 355, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      }
      //this.calculateContractDue();
    }
    //this.contractForm.value.amountPerTime = amountPerTime;

    this.calculateContractDue();
  }

  getRentMethodTypes() {
    if (this.lang == 'en') {
      this.rentMethodTypes = convertEnumToArray(RentPeriodTypeEnum);
    }
    else {
      this.rentMethodTypes = convertEnumToArray(RentPeriodTypeArEnum);

    }
  }
  getPaymentDate() {
    if (this.lang == 'en') {
      this.paymentDate = convertEnumToArray(PaymentDateEnum);
    }
    else {
      this.paymentDate = convertEnumToArray(PaymentDateArEnum);

    }

  }
  getAnnualIncrease() {
    if (this.lang == 'en') {
      this.annualIncreaseInRent = convertEnumToArray(AnnualIncreaseInRentEnum);
    }
    else {
      this.annualIncreaseInRent = convertEnumToArray(AnnualIncreaseInRentArEnum);

    }

  }
  getValue(optionId: any) {
    this.showOfficeAmountPercentage = false;
    this.showOfficeAmountValue = false;

    if (optionId == 1) {
      this.showOfficeAmountPercentage = true;
    }
    if (optionId == 2) {
      this.showOfficeAmountValue = true;

    }

  }
  //getAnnualIncreaseValue
  getAnnualIncreaseValue(optionId: any) {
    this.showOfficeAmountPercentage = false;
    this.showOfficeAmountValue = false;

    if (optionId == 1) {
      this.showOfficeAmountPercentage = true;
    }
    if (optionId == 2) {
      this.showOfficeAmountValue = true;

    }

  }
  getAnnualIncreaseChecked(optionId: any) {
    this.showAnnualIncreaseAmount = false;
    if (optionId == 1) {
      this.showAnnualIncreaseAmount = true;

    }

  }

  showInstallmentFields() {
    if (this.contractForm.controls["paymentMethodType"].value == PaymentMethodsEnum.Installments) {
      this.showInstallments = true;
    }
    else {
      this.showInstallments = false;
    }
  }

  getAmountPerTime() {
    if (this.contractForm.controls["rentMethodType"].value == PaymentMethodsEnum.Installments) {
      this.showInstallments = true;
    }
    else {
      this.showInstallments = false;
    }

    this.changePaymentMethodTypes(this.contractForm.value.paymentMethodType)
    let whenTenentShouldPay = Number(this.contractForm.controls["whenTenentShouldPay"].value)
    if (whenTenentShouldPay > 0) {
      let amountPerTime = Number(this.contractForm.controls["amountPerTime"].value);
      this.contractForm.controls["amountPerTime"].setValue(amountPerTime * whenTenentShouldPay);
    }
    this.calculateContractDue();
  }


  getTenantRepresentative() {
    if (this.lang == 'en') {
      this.tenantRepresentative = convertEnumToArray(TenantRepresentativeEnum);
    }
    else {
      this.tenantRepresentative = convertEnumToArray(TenantRepresentativeArEnum);

    }
  }

  showResponseMessage(responseStatus, alertType, message) {
    ;
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning == alertType) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info == alertType) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error == alertType) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }



  get f(): { [key: string]: AbstractControl } {
    return this.contractForm.controls;
  }
  getRemaingAmount() {
    this.contractForm.value.remainingAmount = this.contractForm.value.contractValueTotal - this.contractForm.value.paidAmount;
  }


  getAnnualIncreaseAmount() {
    //this.annualIncreaseAmount = (this.annualRentAmount * this.annualIncreaseRatio) / 100
  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  getContractDate(selectedDate: DateModel) {
    this.contractDate = selectedDate;
  }
  getStartContractDate(selectedDate: DateModel) {
    this.startContractDate = selectedDate;

    this.updateContractEndDate();
  }
  getEndContractDate(selectedDate: DateModel) {
    this.endContractDate = selectedDate;

  }
  getFirstDueDate(selectedDate: DateModel) {
    this.firstDueDate = selectedDate;
  }
  getMaintenanceDate(selectedDate: DateModel) {
    this.maintenanceDate = selectedDate;
  }
  getEndContractDateByPeriod() {

    if (this.contractForm.value.period != null && this.contractForm.value.rentMethodType == RentPeriodTypeEnum.Year) {
      let period = this.contractForm.value.period;
      let countOfInstallments = this.contractForm.value.countOfInstallments;
      this.endContractDate = this.dateService.getDateForCalender(this.startContractDate.month + 1 + "/" + this.startContractDate.day + "/" + (this.startContractDate.year + period));
      countOfInstallments = countOfInstallments * period
      //this.calculateContractDue();
    }

    if (this.contractForm.value.paymentMethodType > 0) {

      this.calculateContractDue();
    }
  }
  //#region Toolbar Service
  //
  currentBtnResult;


  listenToClickedButton() {

    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
         
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate(['/control-panel/definitions/rent-contracts-list'], { queryParams: { settingId: this.settingId } });
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {

            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {

            this.toolbarPathData.componentAdd = "component-names.add-contracts";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.ownerForm.reset();
            this.router.navigate(['/control-panel/definitions/add-rent-contract'], { queryParams: { settingId: this.settingId } });
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.onUpdate();
          }
          else if (currentBtn.action == ToolbarActions.Issue && currentBtn.submitMode) {
            this.spinner.show();
            this.onIssueContract().then(a=>{
              this.spinner.hide();
            }).catch(e=>{
              this.spinner.hide();
            });
          }
        }
      },
    });
    this.subsList.push(sub);
  }

  setDate() {
    this.contractForm.controls["contractDate"].setValue(this.dateConverterService.getDateForInsertISO_Format(this.contractDate));
    this.contractForm.controls["startContractDate"].setValue(this.dateConverterService.getDateForInsertISO_Format(this.startContractDate));
    this.contractForm.controls["endContractDate"].setValue(this.dateConverterService.getDateForInsertISO_Format(this.endContractDate));
    this.contractForm.controls["firstDueDate"].setValue(this.dateConverterService.getDateForInsertISO_Format(this.firstDueDate));
    this.contractForm.controls["firstDueDate"].setValue(this.dateConverterService.getDateForInsertISO_Format(this.firstDueDate));
    this.contractForm.controls["createDate"].setValue(this.dateConverterService.getDateForInsertISO_Format(this.dateService.getCurrentDate()));

  }

  onSave() {

    if (this.contractForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      this.contractForm.value.id = this.id;
      this.contractForm.controls["rentContractsUnits"].setValue([...this.selectedRentContractUnits]);
      this.contractForm.controls["rentContractsServices"].setValue([...this.selectedRentContractServices]);
      this.contractForm.controls["rentContractsDues"].setValue([...this.rentContractDueList]);

      this.contractForm.controls["contractStatus"].setValue(0);


      this.setDate();
      this.calculateCountOfInstallments();
      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    } else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })
      let errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      //this.errorClass = 'errorMessage';
      this.alertsService.showError(
        errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.contractForm.markAllAsTouched();
    }
  }

  confirmSave() {
    return new Promise<void>((resolve, reject) => {

      let sub = this.rentContractsService.addWithResponse<RentContract>("AddWithCheck?uniques=Code", this.contractForm.value).subscribe({
        next: (result: ResponseResult<RentContract>) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            this.router.navigate(['/control-panel/definitions/rent-contracts-list'], { queryParams: { settingid: this.settingId } });
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
        error: (err) => {
          resolve();
        },
        complete: () => {

        }
      });

      this.subsList.push(sub);
    });
  }
  onUpdate() {
    if (this.contractForm.invalid) {
      let errorMessage = this.translate.transform("validation-messages.invalid-data");
      let errorClass = 'errorMessage';
      this.alertsService.showError(errorMessage, this.translate.transform("message-title.wrong"));
      this.contractForm.markAllAsTouched();
      return;
    }
    if (this.contractForm.value != null) {
      this.contractForm.value.id = this.id;
      this.rentContractDueList.forEach(d => {
        d.id = 0;
      });

      this.selectedRentContractServices.forEach(s => {
        s.id = 0;
      });


      this.contractForm.controls["rentContractsUnits"].setValue([...this.selectedRentContractUnits]);
      this.contractForm.controls["rentContractsServices"].setValue([...this.selectedRentContractServices]);
      this.contractForm.controls["rentContractsDues"].setValue([...this.rentContractDueList]);

      this.setDate();
      //(("this.OfficeForm.value on update",  this.OfficeForm.value);
      this.spinner.show();

      this.calculateCountOfInstallments();

      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    } else {
      let errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      let errorClass = 'errorMessage';
      this.alertsService.showError(
        errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.contractForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.rentContractsService.updateWithUrl("UpdateWithCheck?uniques=Code", this.contractForm.value).subscribe({
        next: (result: ResponseResult<RentContract>) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            this.router.navigate(['/control-panel/definitions/rent-contracts-list'], { queryParams: { settingid: this.settingId } });
          } else if (result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else {
            if (result.status == 2) {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.can-not-update")
              );
            }
            else {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.update-failed")
              );
            }

          }
        },
        error: (err) => {
          resolve();
        },
        complete: () => {

        }
      });

      this.subsList.push(sub);
    });
  }

  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //#endregion

  // Reusable unit component Output function
  // onLoadUnits(e: Unit[]) {
  //   this.units = e;
  // }
  onSelectChangeUnits(event: SelectedUnit[]) {
    this.selectedRentContractUnits = [];
  }

  openUnitSearchDialog(i) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedSearchRentContractUnit?.unitNameAr ?? '';
    } else {
      searchTxt = ''
      // this.selectedRentContractUnits[i].unitNameAr!;
    }

    let data = this.units.filter((x) => {
      return (
        (x.unitNameAr + ' ' + x.unitNameEn).toLowerCase().includes(searchTxt) ||
        (x.unitNameAr + ' ' + x.unitNameEn).toUpperCase().includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectedSearchRentContractUnit!.unitNameAr = data[0].unitNameAr;
        this.selectedSearchRentContractUnit!.unitId = data[0].id;
        this.selectedSearchRentContractUnit!.unitNameAr = data[0].unitNameAr;
        this.selectedSearchRentContractUnit!.areaSize = data[0].rentAreaSize;
        this.selectedSearchRentContractUnit!.pricePerMeter = data[0].rentPrice;
        this.selectedSearchRentContractUnit!.insuranceRatio = data[0].insurranceRatio;
        this.selectedSearchRentContractUnit!.inssuranceAmount = data[0].insurranceAmount;
        this.selectedSearchRentContractUnit!.taxRatio = data[0].taxRatio;
        this.calculateUnitTotals(this.selectedSearchRentContractUnit!);
      } else {
        this.selectedRentContractUnits[i].unitNameAr = data[0].unitNameAr;
        this.selectedRentContractUnits[i].unitId = data[0].id;
        this.selectedRentContractUnits[i].areaSize = data[0].rentAreaSize;
        this.selectedRentContractUnits[i].pricePerMeter = data[0].rentPrice;
        this.selectedRentContractUnits[i].insuranceRatio = data[0].insurranceRatio;
        this.selectedRentContractUnits[i].inssuranceAmount = data[0].insurranceAmount;
        this.selectedRentContractUnits[i].taxRatio = data[0].taxRatio;
        this.calculateUnitTotals(this.selectedRentContractUnits[i]);

      }

    } else {
      let lables = ['الكود', 'الاسم', 'الاسم الانجليزى'];
      let names = ['unitCode', 'unitNameAr', 'unitNameEn'];
      let title = 'بحث عن الوحدة';
      let sub = this.searchDialog
        .showDialog(lables, names, this.units, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {

              this.selectedSearchRentContractUnit!.unitNameAr = d.unitNameAr;
              this.selectedSearchRentContractUnit!.unitId = d.id;
              this.selectedSearchRentContractUnit!.unitNameAr = d.unitNameAr;
              this.selectedSearchRentContractUnit!.areaSize = d.rentAreaSize;
              this.selectedSearchRentContractUnit!.pricePerMeter = d.rentPrice;
              this.selectedSearchRentContractUnit!.insuranceRatio = d.insurranceRatio;
              this.selectedSearchRentContractUnit!.inssuranceAmount = d.insurranceAmount;
              this.selectedSearchRentContractUnit!.taxRatio = d.taxRatio;
              this.calculateUnitTotals(this.selectedSearchRentContractUnit!);


            } else {
              this.selectedRentContractUnits[i].unitNameAr = d.unitNameAr;
              this.selectedRentContractUnits[i].unitId = d.id;
              this.selectedRentContractUnits[i].unitNameAr = d.unitNameAr;
              this.selectedRentContractUnits[i].areaSize = d.rentAreaSize;
              this.selectedRentContractUnits[i].pricePerMeter = d.rentPrice;
              this.selectedRentContractUnits[i].insuranceRatio = d.insurranceRatio;
              this.selectedRentContractUnits[i].inssuranceAmount = d.insurranceAmount;
              this.selectedRentContractUnits[i].taxRatio = d.taxRatio;
              this.calculateUnitTotals(this.selectedRentContractUnits[i]);
            }
          }
        });
      this.subsList.push(sub);
    }

  }
  clearSelectedUnitData() {
    this.selectedSearchRentContractUnit = {
      id: 0,
      unitId: 0,
      areaSize: 0,
      pricePerMeter: 0,
      annualRent: 0,
      monthlyRent: 0,
      insuranceRatio: 0,
      inssuranceAmount: 0,
      taxRatio: 0,
      taxesAmount: 0,
      unitNameAr: '',
      unitNameEn: '',
      rentContractId: 0,
      unitDescription: ''
    };
  }

  onChangeOwner(ownerId) {
    let owner = this.owners.find(x => x.id == ownerId);
    if (owner) {
      this.tenants = this.managerService.getTenants().filter(x => x.ownerId == ownerId);
      if (!this.generalAccountIntegration) {
        if (owner.ownerIntegrationSettings) {
          if (owner.ownerIntegrationSettings.accIntegrationType == AccIntegrationTypeEnum.Resort) {
            this.getResortAccountsByOwner(owner.id);
          }
          else if (owner.ownerIntegrationSettings.accIntegrationType == AccIntegrationTypeEnum.Web) {
            this.getWebAccountsByOwner(owner.id);
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
       
      this.setInitOwnerAccount(owner);
    }
  }

  setInitOwnerAccount(owner: Owner) {
     
    //servicesOwnerAccountId,ownerTaxAccountId,ownerInsurranceAccountId,ownerAccountId
    this.contractForm.controls['ownerAccountId'].setValue(owner.ownerAccountId);
    this.contractForm.controls['ownerTaxAccountId'].setValue(owner.taxAccountId);
    this.contractForm.controls['servicesOwnerAccountId'].setValue( owner.serviceAccountId);
    this.contractForm.controls['ownerDefferRevenueAccId'].setValue(owner.deferredRevenueAccountId);
    this.contractForm.controls['ownerInsurranceAccountId'].setValue(owner.insuranceAccountId);
    this.contractForm.controls['tenantAccountId'].setValue(owner.clientAccountId);
  }
  
  onChangeRealestate(realestateId) {
    this.contractForm.controls['buildingId'].setValue('');
    this.buildings = this.managerService.getBuildings().filter(x => x.realestateId == realestateId);
  }
  onChangeBuilding(buildingId) {
    this.units = this.managerService.getUnits().filter(x => x.buildingId == buildingId);
  }

  onChangeVendor(vendorId) {

  }


  addContractUnit() {
    if (this.selectedSearchRentContractUnit.unitId) {
      if (this.selectedRentContractUnits.find(x => x.unitId == this.selectedSearchRentContractUnit.unitId)) {
        this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.selectedUnitExist"));
        return;
      }
      this.selectedRentContractUnits.push({ ...this.selectedSearchRentContractUnit });
      this.selectedRentContractUnitsServices.push({
        id: this.selectedSearchRentContractUnit.unitId,
        unitNameAr: this.selectedSearchRentContractUnit.unitNameAr,
        unitNameEn: this.selectedSearchRentContractUnit.unitNameEn,
      });
      this.selectedSearchRentContractUnit = new RentContractUnit();
    } else {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.selectUnit"));
    }
    this.calculateContractTotals();
    this.calculateContractDue();
  }

  clearSelectedUnit() {
    this.selectedSearchRentContractUnit = new RentContractUnit();
  }

  addContractServiceList() {
    if (this.selectedContrcatService.unitId) {
      let u = this.selectedRentContractUnitsServices.find(x => x.id == this.selectedContrcatService.unitId);
      if (u) {
        this.selectedContrcatService.unitNameAr = u.unitNameAr;
        this.selectedContrcatService.unitNameEn = u.unitNameEn;
      }
    }
    if (this.selectedContrcatService.serviceId) {
      let s = this.unitServices.find(x => x.id == this.selectedContrcatService.serviceId);
      if (s) {
        this.selectedContrcatService.unitServiceNameAr = s.unitServiceArName;
        this.selectedContrcatService.unitServiceNameEn = s.unitServiceEnName;
      }
    } else {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.serviceRequired"));
      return;
    }

    if (this.selectedContrcatService.payOnTimeId) {
      let p = this.paymentsMethodsInRentContract.find(x => x.id == this.selectedContrcatService.payOnTimeId)
      if (p) {
        this.selectedContrcatService.payOnTimeName = p.name;
      }
    }
    else {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.servicePatmentTypeRequired"));
      return;
    }
    if (this.selectedContrcatService.calcMethodType) {
      let p = this.calculateMethodsInRentContract.find(x => x.id == this.selectedContrcatService.calcMethodType)
      if (p) {
        this.selectedContrcatService.calcMethodTypeName = p.name;
      }
    }
    else {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.serviceCalcMethodRequired"));
      return;
    }
    if (this.selectedContrcatService.fromAccount) {
      let a = this.fromServiceAccount.find(x => x.id == this.selectedContrcatService.fromAccount);
      if (a) {
        this.selectedContrcatService.fromAccountName = a.name;
      }
    }
    else {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.serviceFromAccRequired"));
      return;
    }
    if (this.selectedContrcatService.toAccount) {
      let a = this.toServiceAccount.find(x => x.id == this.selectedContrcatService.toAccount);
      if (a) {
        this.selectedContrcatService.toAccountName = a.name;
      }
    }
    else {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.serviceToAccRequired"));
      return;
    }

    this.selectedRentContractServices.push(JSON.parse(JSON.stringify(this.selectedContrcatService)));
    this.selectedContrcatService = new RentContractServiceModel();
    this.calculateContractServiceTotals();
    this.calculateContractDue();
  }

  onChangeCalcMethodType() {
    if (this.selectedContrcatService) {
      if (this.selectedContrcatService.calcMethodType == 1) {
        this.selectedContrcatService.countOfService = 0;
        this.calaculateServiceAmountByRatio();

      }
      else if (this.selectedContrcatService.calcMethodType == 2) {
        this.selectedContrcatService.countOfService = 0;
        this.selectedContrcatService.ratio = 0;
        this.calculateServiceTotalWithTax();
      }
      else if (this.selectedContrcatService.calcMethodType == 3) {
        this.selectedContrcatService.amount = 0;
        this.selectedContrcatService.ratio = 0;
        this.calculateServiceTotalWithTax();
      }
    }
  }



  calculateServiceTotalWithTax() {

    if (this.selectedContrcatService.amount == NaN) {
      this.selectedContrcatService.amount = 0;


    }
    if (this.selectedContrcatService.taxRatio == NaN) {
      this.selectedContrcatService.taxRatio = 0;

    }

    let amount = Number((this.selectedContrcatService.amount ?? 0));
    let taxAmount = Number((this.selectedContrcatService.taxRatio ?? 0)) * amount / 100;


    this.selectedContrcatService.amountWithTax = this.systemSettingsService.setDecimalNumberSetting((amount + taxAmount), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
  }

  calaculateServiceAmountByRatio() {

    if (this.contractSetting?.id) {

      if (this.contractSetting.isCalcServiceDependOnMonthlyRent) {
        this.selectedContrcatService.amount = this.systemSettingsService.setDecimalNumberSetting(Number(this.selectedContrcatService.ratio) * Number(this.contractForm.controls["totalAmountOfRent"].value) / 1200, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      } else {
        this.selectedContrcatService.amount = this.systemSettingsService.setDecimalNumberSetting(Number(this.selectedContrcatService.ratio) * Number(this.contractForm.controls["totalAmountOfRent"].value) / 100, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction)
      }
    }
    this.calculateServiceTotalWithTax();

  }

  calculateContractTotals() {

    if (this.selectedRentContractUnits.length) {
      let totalArea: number = this.selectedRentContractUnits.map(x => x.areaSize).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);
      let totalAnnualRent: number = this.selectedRentContractUnits.map(x => x.annualRent).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);

      let totalInssurance: number = this.selectedRentContractUnits.map(x => x.inssuranceAmount).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);

      let totalTaxes: number = this.selectedRentContractUnits.map(x => x.taxesAmount).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);
      let rentMeterPriceAverage = 0;
      if (totalAnnualRent) {
        rentMeterPriceAverage = Number(totalAnnualRent) / Number(totalArea);
      }
      let totalBeforeServices = totalAnnualRent + totalInssurance + totalTaxes;
      this.contractForm.controls['totalArea'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalArea, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['averagePriceOfMeter'].setValue(this.systemSettingsService.setDecimalNumberSetting(rentMeterPriceAverage, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['totalInsurance'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalInssurance, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['totalTaxes'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalTaxes, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['totalAmountOfRent'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalAnnualRent, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['totalWithTaxesAndInsurrance'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalBeforeServices, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
    } else {
      this.contractForm.controls['totalArea'].setValue(0);
      this.contractForm.controls['averagePriceOfMeter'].setValue(0);
      this.contractForm.controls['totalInsurance'].setValue(0);
      this.contractForm.controls['totalTaxes'].setValue(0);
      this.contractForm.controls['totalAmountOfRent'].setValue(0);
      this.contractForm.controls['totalWithTaxesAndInsurrance'].setValue(0);
    }


    this.calculateContractServiceTotals();
    this.refreshUnitServiceAmount();
  }

  calculateContractServiceTotals() {
    let totalAmountOfService = this.selectedRentContractServices.map(x => x.amount).reduce((b, c) => {
      return Number(b) + Number(c);
    }, 0);

    let totalServiceTaxes = this.selectedRentContractServices.map(x => x.amountWithTax).reduce((b, c) => {
      return Number(b) + Number(c);
    }, 0);
    this.contractForm.controls["totalAmountOfService"].setValue(this.systemSettingsService.setDecimalNumberSetting(totalAmountOfService, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
    this.contractForm.controls["totalServiceTaxes"].setValue(this.systemSettingsService.setDecimalNumberSetting(totalServiceTaxes, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));

  }

  refreshUnitServiceAmount() {
    if (this.selectedRentContractServices.length) {
      this.selectedRentContractServices.forEach(s => {
        if (s.calcMethodType == CalculateMethodsInRentContractEnum.Ratio) {
          if (this.contractSetting?.id) {

            if (this.contractSetting.isCalcServiceDependOnMonthlyRent) {
              s.amount = this.systemSettingsService.setDecimalNumberSetting(Number(s.ratio) * Number(this.contractForm.controls["totalAmountOfRent"].value) / 1200, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
            } else {
              s.amount = this.systemSettingsService.setDecimalNumberSetting(Number(s.ratio) * Number(this.contractForm.controls["totalAmountOfRent"].value) / 100, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction)
            }
            s.amountWithTax = this.systemSettingsService.setDecimalNumberSetting(Number(s.amount) + (Number(s.amount) * Number(s.taxRatio) / 100), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
          }
        }
      });

      this.calculateContractServiceTotals();
    } else {
      this.contractForm.controls["totalAmountOfService"].setValue(0);
      this.contractForm.controls["totalServiceTaxes"].setValue(0);
    }



  }

  getAccounts() {
    this.tenantAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tenant);
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Owner);
    this.ownerDeferredRevenueAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Deferred Revenue']);
    this.ownerTaxAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tax);
    this.ownerInsurranceAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Insurance);
  }


  clearAccounts() {
    this.tenantAccounts = [];
    this.ownerAccounts = [];
    this.ownerDeferredRevenueAccounts = [];
    this.ownerTaxAccounts = [];
    this.ownerInsurranceAccounts = [];
  }


  getResortAccounts() {
    this.tenantAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.ownerDeferredRevenueAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.ownerTaxAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
    this.ownerInsurranceAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
  }


  getWebAccounts() {
    this.tenantAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.ownerDeferredRevenueAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.ownerTaxAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    this.ownerInsurranceAccounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
  }


  getResortAccountsByOwner(ownerId: any) {
    this.tenantAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && x.ownerId == ownerId);
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid);
    this.ownerDeferredRevenueAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid);
    this.ownerTaxAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid);
    this.ownerInsurranceAccounts = this.managerService.getAccounts().filter(x => x.resortAccGuid);
  }


  getWebAccountsByOwner(ownerId) {
    this.tenantAccounts = this.managerService.getAccounts().filter(x => x.extAccId && x.ownerId == ownerId);
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.extAccId && x.ownerId == ownerId);
    this.ownerDeferredRevenueAccounts = this.managerService.getAccounts().filter(x => x.extAccId && x.ownerId == ownerId);
    this.ownerTaxAccounts = this.managerService.getAccounts().filter(x => x.extAccId && x.ownerId == ownerId);
    this.ownerInsurranceAccounts = this.managerService.getAccounts().filter(x => x.extAccId && x.ownerId == ownerId);
  }


  duesCalculated = false;
  updateContractEndDate() {
    let period = Number(this.contractForm.value.period);
    let rentMethodType = Number(this.contractForm.value.rentMethodType);

    let calendarType = this.contractForm.controls['calendarType'].value;
    if (calendarType == CalendarTypesEnum.Gregorian) {
      //1 == عقد ميلادي
      this.endContractDate = this.dateService.calculateEndDateForGregrion(period, rentMethodType, this.startContractDate, 1)
    }
    else {
      //2 == عقد هجري
      this.endContractDate = this.dateService.calculateEndDateForHijri(period, rentMethodType, this.startContractDate, 1)
    }
  }
  calculateAnnualIncrease(amountBeforeIncrease: any, period: any) {
    let numberOfYears = 0;
    let amountAfterIncrease = amountBeforeIncrease;
    let annualIncrease = Number(this.contractForm.controls["annualIncreaseAmount"].value)
    //-------------------نسبة الزيادة السنوية
    if (this.contractForm.controls["annualIncreaseChecked"].value) {
      //------------------الحالة الثانية انه يكون عقد سنوى
      numberOfYears = period;
      //numberOfYears = this.contractPeriodPerYear;
      for (let y = 1; y <= numberOfYears; y++) {
        if (y != 1) {
          amountAfterIncrease = Number(amountAfterIncrease) + (annualIncrease * Number(amountBeforeIncrease)) / 100;
        }
      }
    } else {
      let amountPerYear = 0;
      let totalAmountOfYears = 0;
      let counterAmount = 0
      numberOfYears = period;
      for (let y = 1; y <= numberOfYears; y++) {
        if (y != 1) {
          counterAmount = (annualIncrease * Number(amountPerYear)) / 100;
          amountPerYear = amountPerYear + counterAmount;
        } else {
          amountPerYear = amountAfterIncrease;
        }
      }
      amountAfterIncrease = amountPerYear;
    }
    return amountAfterIncrease;
    //===============================================================
  }
  calculateContractDue() {
    this.calculateContractTotals();
    this.refreshUnitServiceAmount();
     
    let rentMethodType = this.contractForm.controls["rentMethodType"].value;
    let paymentMethodType = this.contractForm.controls["paymentMethodType"].value;
    if (!paymentMethodType) {
      return;
    }
    let period = Number(this.contractForm.controls["period"].value);
    let whenTenentShouldPay = Number(this.contractForm.controls['whenTenentShouldPay'].value);
    let paymentTimeType = this.contractForm.controls["paymentTimeType"].value;
    let periodBetweenInstallment = Number(this.contractForm.controls['periodBetweenInstallment'].value);
    let totalAnnualAmountOfRent = Number(this.contractForm.controls['totalAmountOfRent'].value);
    let totalTaxes = Number(this.contractForm.controls['totalTaxes'].value);
    let paidAmount = Number(this.contractForm.controls['paidAmount'].value);
    let calendarType = this.contractForm.controls['calendarType'].value;

    let contractPeriodPerYear = 0;
    if (rentMethodType == RentPeriodTypeEnum.Month) {
      //اذا كان نوع المدة بالشهور
      contractPeriodPerYear = period / 12;
    }
    else {
      //اذا كانت مدة العقد بالسنين
      contractPeriodPerYear = period;
    }

    let totalInsurance = Number(this.contractForm.controls['totalInsurance'].value);
    if (!rentMethodType) {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.rentMethodTypeRequired"))
      return;
    }
    this.duesCalculated = true;
    this.updateContractEndDate();
    this.rentContractDueList = []

    let contractPeriodByMonth: number = 0; //مدة العقد بالشهور
    let periodBetweenPayByMonth: number = 0; // الفترة بين الدفعات بالشهور
    let paymentCount: number = 0; // عدد الدفعات
    let paymentRentAmountPerTime: number = 0; // قيمة دفعة الايجار
    // let insurancePaymentAmountPerTime: number = 0; //قيمة دفعة التأمين
    let taxPaymentAmountPerTime: number = 0; //قيمة دفعة الضريبة
    let contractPeriodsList: number[] = [];
    let monthlyRentValue: number = 0;
    let monthlyTaxValue: number = 0;
    if (rentMethodType == RentPeriodTypeEnum.Month) {
      //مدة العقد بالشهور
      contractPeriodByMonth = period;
    }
    else {
      //مدة العقد بالسنة  contract.RentMethodType == 2
      contractPeriodByMonth = period * 12;
    }
    if (paymentMethodType == 1) {
      //نوع الدفعات شهري
      periodBetweenPayByMonth = whenTenentShouldPay;
    }
    else if (paymentMethodType == 2) {
      //نوع الدفعات سنوي
      periodBetweenPayByMonth = whenTenentShouldPay * 12;
    }
    else {
      //نوع الدفعات عدد دفعات

      if (paymentTimeType == 1) {
        //نوع الفترة بين الدفعات شهرية
        periodBetweenPayByMonth = periodBetweenInstallment;
      }
      else {
        //نوع الفترة بين الدفعات سنوية
        periodBetweenPayByMonth = periodBetweenInstallment * 12;
      }
    }
    let p = Math.floor(contractPeriodByMonth / periodBetweenPayByMonth);
    let remainPeriod = (contractPeriodByMonth % periodBetweenPayByMonth);
    if (remainPeriod > 0) {
      paymentCount = p + 1;
    }
    else {
      paymentCount = p;
    }
    //paymentCount = p + remainPeriod;
    for (let k = 0; k < p; k++) {
      contractPeriodsList.push(periodBetweenPayByMonth);
    }
    if (remainPeriod > 0) {
      contractPeriodsList.push(remainPeriod);
    }
    let accumulatedPeriod: number = 0;
    // قيمة الدفعة = مدة العقد بالسنة * قيمة الايجار السنوي مقسوم على عدد الدفعات
    //Totalamountofrent قيمة العقد الايجارية الكلية
    //يتم طرح قيمة المسدد سابقاً
    //--------------------------------------------تعديل الزيادة السنوية للايجار
    paymentRentAmountPerTime = (totalAnnualAmountOfRent - (paidAmount == null ? 0 : paidAmount)) / contractPeriodsList.length;
    //--------------------------------------------------------------------------------
    let startCalcDate: { year: number, month: number, day: number } = {
      year: 0,
      month: 0,
      day: 0
    }
    let endCalcDate: { year: number, month: number, day: number } =
      { year: 0, month: 0, day: 0 };
    //List<ContractDue> contractInsuranceDueList = new List<ContractDue>();
    //List<ContractDue> contractTaxDueList = new List<ContractDue>();
    if (!this.contractSetting?.isDivisionByUnit) {
      monthlyRentValue = totalAnnualAmountOfRent / 12;
      monthlyTaxValue = totalTaxes / 12;
      //توزيع دفعات الايجار على المدد
      // let DueDate: Date;
      // let EndDueDate: Date;
      // if (this.isInsurranceIncludedInDivision) {
      //   insurancePaymentAmountPerTime = this.inssurancerequiredamount / paymentCount;
      // }
      // else {
      //   insurancePaymentAmountPerTime = this.inssurancerequiredamount;
      // }
      if (this.contractSetting?.isTaxIncludedInDivision) {
        taxPaymentAmountPerTime = totalTaxes / contractPeriodsList.length;
      }
      else {
        taxPaymentAmountPerTime = totalTaxes;
      }
      for (let i = 0; i < contractPeriodsList.length; i++) {
        //-------------------------الزيادة السنوية
        if (calendarType == CalendarTypesEnum.Gregorian) {
          //عقد ميلادي
          startCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.startContractDate, 0);
          accumulatedPeriod += contractPeriodsList[i];
          endCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.startContractDate, 1);
        }
        else {
          //عقد هجري
          startCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.startContractDate, 0);
          accumulatedPeriod += contractPeriodsList[i];
          endCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.startContractDate, 1);
        }
        //----------------------------update anuual increse
        let dueAmountBeforeIncrease = this.contractSetting?.isCalacAmountOnDuePeriod ? (monthlyRentValue * contractPeriodsList[i]) : paymentRentAmountPerTime;
        let pp = i + 1;
        let yearOfRent = 0;
        let paymentAmountAfterIncrease = 0;
        //سنوى
        if (rentMethodType == RentPeriodTypeEnum.Year) {
          yearOfRent = pp;
          paymentAmountAfterIncrease = this.calculateAnnualIncrease(dueAmountBeforeIncrease, yearOfRent);
        } else {
          //شهرى
          yearOfRent = Math.ceil(pp / 12);
          let annualIncreaseOfRent = this.calculateAnnualIncrease(Number(dueAmountBeforeIncrease), yearOfRent);
          //annualIncreaseOfRent=paymentRentAmountPerTime+الزيادة السنوية
          let increaseValue = annualIncreaseOfRent - dueAmountBeforeIncrease;
          //increaseValue/12الزيادة حلال شهر واحد
          paymentAmountAfterIncrease = paymentRentAmountPerTime + increaseValue;
        }
        //----------------------------------------------
        this.rentContractDueList.push({
          id: 0,
          dueAmount: this.contractSetting?.isCalacAmountOnDuePeriod ? (monthlyRentValue * contractPeriodsList[i]) : paymentAmountAfterIncrease,
          dueName: "Rent",
          typeId: RentContractDuesEnum.Rent,
          dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
          dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
          notes: "",
          unitId: null,
          serviceId: null,
          isEntryGenerated: false,
          paid: 0,
          isInvoiced: false,
          rentContractId: 0
        });
        //إضافة التأمين
        if ((this.rentContractDueList.filter(x => x.typeId == 2).length == 0) && this.renewType != "renew") {
          //التأمين غير مسجل من قبل
          this.rentContractDueList.push(
            {
              id: 0,
              dueAmount: totalInsurance,
              dueName: "Inssurance",
              typeId: RentContractDuesEnum.Inssurance,
              dueStartDate: (this.startContractDate.month + 1) + "/" + this.startContractDate.day + "/" + this.startContractDate.year,
              dueEndDate: (this.endContractDate.month + 1) + "/" + this.endContractDate.day + "/" + this.endContractDate.year,
              notes: "",
              unitId: null,
              serviceId: null,
              isEntryGenerated: false,
              isInvoiced: false,
              paid: 0,
              rentContractId: 0
            });
        }
        //توزيع الضريبة
        if (this.contractSetting?.isTaxIncludedInDivision) {
          this.rentContractDueList.push(
            {
              id: 0,
              dueAmount: this.contractSetting.isCalacAmountOnDuePeriod ? (monthlyTaxValue * contractPeriodsList[i]) : taxPaymentAmountPerTime,
              dueName: "Tax",
              typeId: RentContractDuesEnum.Tax,
              dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
              dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
              notes: "",
              unitId: null,
              serviceId: null,
              isEntryGenerated: false,
              paid: 0,
              isInvoiced: false,
              rentContractId: 0

            });
        }
        else {
          if (this.rentContractDueList.filter(x => { return x.typeId == 3; }).length == 0) {
            //الضريبة غير مسجلة من قبل
            this.rentContractDueList.push(
              {
                id: 0,
                dueAmount: totalTaxes,
                dueName: "Tax",
                typeId: RentContractDuesEnum.Tax,

                dueStartDate: (this.startContractDate.month + 1) + "/" + this.startContractDate.day + "/" + this.startContractDate.year,
                dueEndDate: (this.endContractDate.month + 1) + "/" + this.endContractDate.day + "/" + this.endContractDate.year,

                notes: "",
                unitId: null,
                serviceId: null,
                isEntryGenerated: false,
                paid: 0,
                isInvoiced: false,
                rentContractId: 0
              });
          }
        }
      }
    }
    else {
      //تقسيم الاستحقاقات على الوحدات
      let rentPerUnitAmount: number = 0;
      let taxPerUnitAmount: number = 0;
      let inssurancePerunitAmount: number = 0;
      //let allUnits = this.selectedUnits.concat(this.contractunits);
      for (let i = 0; i < contractPeriodsList.length; i++) {
        if (calendarType == CalendarTypesEnum.Gregorian) {
          //عقد ميلادي
          startCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.startContractDate, 0);
          accumulatedPeriod += contractPeriodsList[i];
          endCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.endContractDate, 1);
        }
        else {
          //عقد هجري
          startCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.startContractDate, 0);
          accumulatedPeriod += contractPeriodsList[i];
          endCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.endContractDate, 1);
        }




        this.selectedRentContractUnits.forEach(u => {
          rentPerUnitAmount = Math.round(parseFloat(u.annualRent + "") * contractPeriodPerYear / contractPeriodsList.length);
          monthlyRentValue = Math.round(parseFloat(u.annualRent + "") / 12);

          monthlyTaxValue = parseFloat((parseFloat(u.annualRent + "") * parseFloat(u.taxRatio + "") / 100 / 12).toFixed(2));
          if (contractPeriodPerYear > 1) {
            inssurancePerunitAmount = u.inssuranceAmount;
          }
          else {
            inssurancePerunitAmount = (contractPeriodPerYear * parseFloat(u.annualRent + "") * parseFloat(u.insuranceRatio + "") / 100);
          }
          this.rentContractDueList.push({
            id: 0,
            dueAmount: this.contractSetting?.isCalacAmountOnDuePeriod ? monthlyRentValue * contractPeriodsList[i] : rentPerUnitAmount,
            dueName: 'Rent',
            typeId: RentContractDuesEnum.Rent,
            notes: '',
            unitId: u.unitId,

            dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
            dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
            serviceId: null,
            isEntryGenerated: false,
            paid: 0,
            isInvoiced: false,
            rentContractId: 0
          });
          if (this.contractSetting?.isTaxIncludedInDivision) {
            //تقسيم الضريبة على الاستحقات
            taxPerUnitAmount = Math.round((parseFloat(u.taxesAmount + "")) / contractPeriodsList.length);
            this.rentContractDueList.push({
              id: 0,
              dueAmount: this.contractSetting.isCalacAmountOnDuePeriod ? monthlyTaxValue * contractPeriodsList[i] : taxPerUnitAmount,
              dueName: 'Tax',
              typeId: RentContractDuesEnum.Tax,
              notes: '',
              unitId: u.unitId,

              dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
              dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
              serviceId: null,
              isEntryGenerated: false,
              paid: 0,
              isInvoiced: false,
              rentContractId: 0
            });
          }
          else {
            //الضريبة تنزل مرة واحدة على الاستحقاق الاول
            taxPerUnitAmount = (parseFloat(this.selectedRentContractUnits.map(x => x.taxesAmount).reduce((a, b) => a + b, 0) + ""));
            if (this.rentContractDueList.filter(f => {
              return f.unitId == u.unitId && f.typeId == RentContractDuesEnum.Tax;
            }).length == 0) {
              this.rentContractDueList.push({
                id: 0,
                dueAmount: taxPerUnitAmount,
                dueName: 'Tax',
                typeId: RentContractDuesEnum.Tax,
                notes: '',
                unitId: u.unitId,

                dueStartDate: (this.startContractDate.month + 1) + "/" + this.startContractDate.day + "/" + this.startContractDate.year,
                dueEndDate: (this.endContractDate.month + 1) + "/" + this.endContractDate.day + "/" + this.endContractDate.year,
                serviceId: null,
                isEntryGenerated: false,
                paid: 0,
                isInvoiced: false,
                rentContractId: 0
              });
            }
          }
          if (this.rentContractDueList.filter(f => {
            return f.unitId == u.unitId && f.typeId == RentContractDuesEnum.Inssurance;
          }).length == 0) {
            //التأمين غير مسجل يجب اضافته
            this.rentContractDueList.push({
              id: 0,
              dueAmount: inssurancePerunitAmount,
              dueName: 'Inssurance',
              typeId: RentContractDuesEnum.Inssurance,
              notes: '',
              unitId: u.unitId,

              dueStartDate: (this.startContractDate.month + 1) + "/" + this.startContractDate.day + "/" + this.startContractDate.year,
              dueEndDate: (this.endContractDate.month + 1) + "/" + this.endContractDate.day + "/" + this.endContractDate.year,
              serviceId: null,
              isEntryGenerated: false,
              paid: 0,
              isInvoiced: false,
              rentContractId: 0
            });
          }
        });
      }
    }
    //==================================بداية توزيع استحقاق الخدمات===============================
    // let allContactService: RentContractservice[] = [];
    // allContactService = this.selectedProducts.concat(this.contractservices);
    let serviceValue: number = 0;
    let serviceTaxValue: number = 0;
    let totalServicesTaxValue: number = 0;
    let iterationPeriod: number = 0;
    let iterationFactor: number[] = [];
    this.selectedRentContractServices.filter(f => {
      return parseFloat(f.ratio) > 0 || parseFloat(f.amount) > 0;
    }).forEach(s => {
      if (s.payOnTimeId == PaymentsMethodsInRentContractEnum['Amounts Pay In Month']) {
        iterationPeriod = contractPeriodByMonth;
        for (let n = 0; n < iterationPeriod; n++) {
          iterationFactor.push(1);
        }
        // تدفع شهرياً
        //costtype 1 Percent , 2 Amount , 3 Count
        if (s.calcMethodType == CalculateMethodsInRentContractEnum.Ratio || s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
          // if (this.contractSetting.isCalcServiceDependOnMonthlyRent) {
          //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent / 12) / 100;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }
          // else {
          //   serviceValue = parseFloat(s.ratio) * totalAnnualAmountOfRent / 100;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }

          serviceValue = parseFloat(s.amount);
          serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        }
        // else if (s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
        //   serviceValue = parseFloat(s.amount);
        //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        // }
      }
      else if (s.payOnTimeId == PaymentsMethodsInRentContractEnum['Amounts Pay In Year']) {
        //تدفع سنويا

        if (this.contractSetting?.isDivideAnnualSrvsDependOnContractTerms == true) //توزيع الخدمات السنوية وفقا لشروط العقد
        {
          p = Math.floor(contractPeriodByMonth / periodBetweenPayByMonth);
          remainPeriod = (contractPeriodByMonth % periodBetweenPayByMonth);
          if (remainPeriod > 0) {
            paymentCount = p + 1;
          }
          else {
            paymentCount = p;
          }
          iterationPeriod = paymentCount;
          //paymentCount = p + remainPeriod;
          for (let k = 0; k < p; k++) {
            iterationFactor.push(periodBetweenPayByMonth);
          }
          if (remainPeriod > 0) {
            iterationFactor.push(remainPeriod);
          }
          if (s.calcMethodType == CalculateMethodsInRentContractEnum.Ratio || s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
            //اذا كانت الخدمات نسبة

            // serviceValue = (parseFloat(s.amount)  / paymentCount / 100) * contractPeriodByMonth;
            // serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
            serviceValue = (parseFloat(s.amount) / paymentCount) * contractPeriodByMonth / 12;
            serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;



          }
          // else if (s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
          //   serviceValue = (parseFloat(s.amount) / paymentCount) * contractPeriodByMonth / 12;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }
        }
        else {
          iterationPeriod = contractPeriodPerYear;
          for (let a = 0; a < iterationPeriod; a++) {
            iterationFactor.push(12);
          }
          if (s.calcMethodType == CalculateMethodsInRentContractEnum.Ratio || s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
            //  
            // if (this.contractSetting.isCalcServiceDependOnMonthlyRent) {
            //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent / 100) / contractPeriodByMonth / 12;
            //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;

            // } else {
            //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent / 100) //*contractPeriodByMonth/12;
            //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;

            // }

            serviceValue = (parseFloat(s.amount)) //*contractPeriodByMonth/12;
            serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;

          }
          // else if (s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
          //   serviceValue = (parseFloat(s.amount)) //*contractPeriodByMonth/12;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }
        }

      }
      else if (s.payOnTimeId == PaymentsMethodsInRentContractEnum['Amounts Pay For Once Time']) {
        iterationPeriod = 1;
        iterationFactor.push(contractPeriodByMonth);
        //مبالغ تدفع مرة واحدة
        if (s.calcMethodType == CalculateMethodsInRentContractEnum.Ratio || s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
          // if (this.contractSetting.isCalcServiceDependOnMonthlyRent) {
          //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent / 12) / 100;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }
          // else {
          //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent) / 100;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }
          serviceValue = s.amount;
          serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        }
        // else if (s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
        //   serviceValue = s.amount;
        //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        // }
      }
      else if (s.payOnTimeId == PaymentsMethodsInRentContractEnum.Quarterly) {
        //ربع سنوي
        let m: number = Math.ceil(contractPeriodByMonth / 3);
        iterationPeriod = m + (contractPeriodByMonth % 3);
        for (let n = 0; n < m; n++) {
          iterationFactor.push(3);
        }
        if (contractPeriodByMonth % 3 > 0) {
          iterationFactor.push(contractPeriodByMonth % 3);
        }
        if (s.calcMethodType == CalculateMethodsInRentContractEnum.Ratio || s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
          // if (this.contractSetting.isCalcServiceDependOnMonthlyRent) {
          //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent / 12) / 100;
          //   serviceTaxValue = parseFloat(s.ratio) * serviceValue / 100;
          // }
          // else {
          //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent) / 400;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }

          serviceValue = s.amount;
          serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        }
        // else if (s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
        //   serviceValue = s.amount;
        //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        // }
      }
      else if (s.payOnTimeId == PaymentsMethodsInRentContractEnum['Mid Term']) {
        //نصف سنوي
        let m: number = Math.ceil(contractPeriodByMonth / 6);
        iterationPeriod = m + (contractPeriodByMonth % 6);
        for (let n = 0; n < m; n++) {
          iterationFactor.push(6);
        }
        //console.log("Iteration Factor For Half Year ", iterationFactor);
        if (contractPeriodByMonth % 6 > 0) {
          iterationFactor.push(contractPeriodByMonth % 6);
        }
        if (s.calcMethodType == CalculateMethodsInRentContractEnum.Ratio || s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
          // if (this.contractSetting.isCalcServiceDependOnMonthlyRent) {
          //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent / 12) / 100;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }
          // else {
          //   serviceValue = (parseFloat(s.ratio) * totalAnnualAmountOfRent) / 100;
          //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
          // }

          serviceValue = s.amount;
          serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        }
        // else if (s.calcMethodType == CalculateMethodsInRentContractEnum.Amount) {
        //   serviceValue = s.amount;
        //   serviceTaxValue = parseFloat(s.taxRatio) * serviceValue / 100;
        // }
      }
      else {
        iterationPeriod = 0;
      }
      for (let i = 0; i < iterationFactor.length; i++) {
        if (calendarType == CalendarTypesEnum.Gregorian) {
          //عقد ميلادي
          startCalcDate = this.dateService.calculateEndDateForGregrion(i * iterationFactor[i], 1, this.startContractDate, 0);
          endCalcDate = this.dateService.calculateEndDateForGregrion((i + 1) * iterationFactor[i], 1, this.startContractDate, 1);
        }
        else {
          //عقد هجري
          startCalcDate = this.dateService.calculateEndDateForHijri(i * iterationFactor[i], 1, this.startContractDate, 0);
          endCalcDate = this.dateService.calculateEndDateForHijri((i + 1) * iterationFactor[i], 1, this.startContractDate, 1);
        }

        let pp = i + 1;
        let yearOfRent = 0;
        let serviceAfterIncreaseValue = 0;
        if (rentMethodType == RentPeriodTypeEnum.Year) {
          yearOfRent = pp;
          serviceAfterIncreaseValue = this.calculateAnnualIncrease(serviceValue, yearOfRent);
        } else {
          yearOfRent = Math.ceil(pp / 12);
          let annualIncreaseOfserviceValue = this.calculateAnnualIncrease(Number(serviceValue), yearOfRent);
          //annualIncreaseOfRent=paymentRentAmountPerTime+الزيادة السنوية
          let increaseValue = annualIncreaseOfserviceValue - serviceValue;
          //increaseValueالزيادة حلال شهر واحد
          serviceAfterIncreaseValue = serviceValue + increaseValue;
        }
        //----------------------------------------------
        this.rentContractDueList.push({
          id: 0,
          dueAmount: serviceAfterIncreaseValue,

          dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
          dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
          dueName: 'Service',
          notes: '',
          typeId: RentContractDuesEnum.Service,
          unitId: s.unitId,
          serviceId: s.serviceId,
          isEntryGenerated: false,
          paid: 0,
          isInvoiced: true,
          rentContractId: 0
        });
        if (this.contractSetting?.isDivideServiceTax && serviceTaxValue > 0) {
          this.rentContractDueList.push({
            id: 0,
            dueAmount: serviceTaxValue,

            dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
            dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
            dueName: 'serviceTax',
            notes: '',
            typeId: RentContractDuesEnum.ServiceTax,
            unitId: s.unitId,
            serviceId: s.serviceId,
            isEntryGenerated: false,
            paid: 0,
            isInvoiced: false,
            rentContractId: 0

          });
        }
        else {
          totalServicesTaxValue += serviceTaxValue;
        }
      }
      iterationPeriod = 0;
      iterationFactor = [];
    });
    if (totalServicesTaxValue > 0) {
      this.rentContractDueList.push({
        id: 0,
        dueAmount: totalServicesTaxValue,

        dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
        dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
        dueName: 'serviceTax',
        notes: '',
        typeId: RentContractDuesEnum.ServiceTax,
        unitId: null,
        serviceId: null,
        isEntryGenerated: false,
        paid: 0,
        isInvoiced: false,
        rentContractId: false
      });
    }
    // if (this.rentContractDueList.length > 0) {
    //   this.showDueList = true;
    // }

    console.log("--------------------------", this.rentContractDueList);

  }



  calculateCountOfInstallments() {
    let countOfInstallments = 0;
    let paymentTimeType = this.contractForm.controls["paymentTimeType"].value;
    let periodBetweenInstallment = Number(this.contractForm.controls["periodBetweenInstallment"].value);
    let rentMethodType = this.contractForm.controls["rentMethodType"].value;
    let period = Number(this.contractForm.controls["period"].value)
    //month month
    if ((paymentTimeType == 1 && rentMethodType == 1) || (paymentTimeType == 2 && rentMethodType == 2)) {
      countOfInstallments = Math.ceil((period) / periodBetweenInstallment);
    }
    else if (paymentTimeType == 2 && rentMethodType == 1) {
      console.log("Payment yearly and contract permonth");
      countOfInstallments = Math.ceil((period) / 12 / periodBetweenInstallment);

    }
    else {
      countOfInstallments = Math.ceil((period * 12) / periodBetweenInstallment);
    }
    this.contractForm.controls['countOfInstallments'].setValue(countOfInstallments);

    this.calculateContractDue();
  }

  getDueName(item: RentContractDues) {
    return item.dueName;
  }

  getDueUnitName(item: RentContractDues) {
    if (item.unitId) {
      let u = this.units.find(x => x.id == item.unitId);
      if (u) {
        return this.lang == "ar" ? u.unitNameAr : u.unitNameEn;
      }
    }
    return "";
  }

  getServiceName(item: RentContractDues) {
    if (item.serviceId) {
      let s = this.unitServices.find(x => x.id == item.serviceId);
      if (s) {
        return this.lang == "ar" ? s.unitServiceArName : s.unitServiceEnName;
      }
    }
    return "";
  }

  getDueAmount(item: RentContractDues) {
    return this.systemSettingsService.setDecimalNumberSetting(item.dueAmount, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
  }

  getFromDate(item: RentContractDues) {
    if (this.contractForm.value.calendarType == CalendarTypesEnum.Gregorian) {
      return this.datePipe.transform(new Date(item.dueStartDate), "yyyy/MM/dd");
    }
    //console.log(this.dateService.getHiriDate(new Date(item.dueStartDate)));
    let hijriDate = this.dateService.getHiriDate(new Date(item.dueStartDate));
    return hijriDate.year + "/" + hijriDate.month + "/" + hijriDate.day;
  }

  getToDate(item: RentContractDues) {
    if (this.contractForm.value.calendarType == CalendarTypesEnum.Gregorian) {
      return this.datePipe.transform(new Date(item.dueEndDate), "yyyy/MM/dd");
    }
    console.log(this.dateService.getHiriDate(new Date(item.dueEndDate)));
    let hijriDate = this.dateService.getHiriDate(new Date(item.dueEndDate));
    return hijriDate.year + "/" + hijriDate.month + "/" + hijriDate.day;
  }

  getDueRemain(item: RentContractDues) {
    return this.systemSettingsService.setDecimalNumberSetting((item.dueAmount - item.paid), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction)
  }

  onIssueContract() {
    return new Promise<void>((resolve, reject) => {      
      let sub = this.rentContractsService.getWithResponse<RentContract>("Issue?id=" + this.id).subscribe({
        next: (result: ResponseResult<RentContract>) => {
          resolve();
          if (result.success) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.issue-success")
            );
            this.router.navigate(['/control-panel/definitions/rent-contracts-list'], { queryParams: { settingid: this.settingId } });
          }
          else {

            if (result.status == 2) {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.issue-before")
              );
            }
            else  {
              //issuedRenewedBefore
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages."+result.message)
              );
            }
            // else if (result.status == 4) {
            //   //ownerIntegrationNotFound
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.ownerIntegrationNotFound")
            //   );
            // }
            // else if (result.status == -50) {
            //   //tenantAccountRequired
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.tenantAccountRequired")
            //   );
            // }
            // else if (result.status == -100) {
            //   //ownerAccountRequired
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.ownerAccountRequired")
            //   );
            // }
            // else if (result.status == -200) {
            //   //serviceAccountRequired
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.serviceAccountRequired")
            //   );
            // }
            // else if (result.status == -300) {
            //   //insuranceAccountRequired
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.insuranceAccountRequired")
            //   );
            // }
            // else if (result.status == -400) {
            //   //taxAccountRequired
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.taxAccountRequired")
            //   );
            // }
            // else if (result.status == -500) {
            //   //defferAccountRequired
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.defferAccountRequired")
            //   );
            // }
            // //------------------------------------------------------------
            // else if (result.status == -1000) {
            //   //defferAccountRequired
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.defferAccountRequired")
            //   );
            // }
            // else {
            //   this.showResponseMessage(
            //     result.success,
            //     AlertTypes.error,
            //     this.translate.transform("messages.issue-failed")
            //   );
            // }
          }
        },
        error: (err) => {
          resolve();
        },
        complete: () => {

        }
      });

      this.subsList.push(sub);
    });

  }


  getNewCode() {
    return new Promise<string>((resolve, reject) => {
      let sub = this.rentContractsService.getWithResponse<NewCode[]>("GetNewCode?typeId=" + this.settingId).subscribe({
        next: (res) => {
          console.log("New Code", res);

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







}

