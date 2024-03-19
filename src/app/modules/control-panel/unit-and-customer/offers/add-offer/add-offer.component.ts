import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { RealestatesService } from '../../../../../core/services/backend-services/realestates.service';
import { Owner } from 'src/app/core/models/owners';
import { Tenants } from 'src/app/core/models/tenants';
import { Realestate } from 'src/app/core/models/realestates';
import { Building } from 'src/app/core/models/buildings';
import { Vendors } from 'src/app/core/models/vendors';
import { Offers } from '../../../../../core/models/offers';
import { OffersService } from '../../../../../core/services/backend-services/offers-service.service';
import { Unit } from '../../../../../core/models/units';
import {
  convertEnumToArray,
  pursposeTypeEnum,
  RentPeriodTypeEnum,
  RentPeriodTypeArEnum,
  PaymentTimeTypesEnum,
  PaymentsMethodsInRentContractEnum,
  CalculateMethodsInRentContractEnum,
  ToolbarActions,
  AlertTypes,
  pursposeTypeArEnum,
  PaymentTimeTypesArEnum,
  PaymentsMethodsInRentContractArEnum,
  CalculateMethodsInRentContractArEnum,
  ContractUnitsServicesAccountsArEnum,
} from '../../../../../core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { SelectedUnit } from 'src/app/core/models/offer-unit-details';
import { RentContractUnitsServices } from 'src/app/core/models/rent-contract-units-services';
import { UnitServices } from 'src/app/core/models/unit-services';
import { UnitServicesService } from 'src/app/core/services/backend-services/unit-services.service';
import { ContractUnitsServicesAccountsEnum } from 'src/app/core/constants/enumrators/enums';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { UnitReusableTotals } from '../../../../../core/view-models/unit-resuable-totals';
import { OfferUnitServiceDetails } from 'src/app/core/models/offers-units-details';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { RentContractServiceModel } from 'src/app/core/models/rent-contract-services';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { DateModel } from 'src/app/core/view-models/date-model';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { OwnerSelectors } from 'src/app/core/stores/selectors/owners.selectors';
import { OwnersModel } from 'src/app/core/stores/store.model.ts/owner.store.model';
import { TenantsSelectors } from 'src/app/core/stores/selectors/tenant.selectors';
import { TenantModel } from 'src/app/core/stores/store.model.ts/tenants.store.model';
import { RealestateSelectors } from 'src/app/core/stores/selectors/realestate.selectors';
import { RealestatesModel } from 'src/app/core/stores/store.model.ts/realestates.store.model';
import { BuildingSelectors } from 'src/app/core/stores/selectors/building.selectors';
import { BuildingsModel } from 'src/app/core/stores/store.model.ts/buildings.store.model';
import { VendorSelectors } from 'src/app/core/stores/selectors/vendor.selectors';
import { VendorsModel } from 'src/app/core/stores/store.model.ts/vendors.store.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const PAGEID = 12; // from pages table in database seeding table
@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  lang: string = '';
  currnetUrl: any;
  addUrl: string = '/control-panel/definitions/add-offer';
  updateUrl: string = '/control-panel/definitions/update-offer/';
  listUrl: string = '/control-panel/definitions/offers-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.list-offers",
    componentAdd: "component-names.add-offer",
  };
  errorMessage = '';
  errorClass = '';
  OfferForm!: FormGroup;
  ContractUnitsServiceForm!: FormGroup;
  ContractUnitsForm!: FormGroup;
  showOrganizationData: boolean = false;
  dateType: number = 1;
  owners: Owner[] = [];
  tenants: Tenants[] = [];
  vendors: Vendors[] = [];
  realestates: Realestate[] = [];
  buildings: Building[] = [];
  Response!: ResponseResult<Offers>;
  pursposeTypes: ICustomEnum[] = [];
  rentPeriodTypes: ICustomEnum[] = [];
  paymentTimeTypes: ICustomEnum[] = [];
  ownerId!: number;
  purposeType!: number;
  units: Unit[] = [];
  offerObject!: Offers;
  offer!: Offers;
  offerId!: any;
  rentPeriodType!: number;
  selectedUnits: SelectedUnit[] = [];
  selectedRentContractUnitsServices: RentContractUnitsServices[] = [];
  unitServices: UnitServices[] = [];
  paymentsMethodsInRentContract: ICustomEnum[] = [];
  calcMethodType: any = '';
  amount: number = 0;
  totalTaxes: number = 0;
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number;
  fromServiceAccount: ICustomEnum[] = [];
  toServiceAccount: ICustomEnum[] = [];
  selectedRentContractServices: RentContractServiceModel[] = [];
  calculateMethodsInRentContract: ICustomEnum[] = [];
  unitTotals!: UnitReusableTotals;
  serviceSelectedUnitId!: any;
  selectedUnitServiceDetails: OfferUnitServiceDetails[] = [];

  //@Input()saveBtn:EventEmitter<string>=new EventEmitter();
  //#endregion main variables declarationss
  //#region Constructor
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private offersService: OffersService,
    private activatedRoute: ActivatedRoute,
    private unitServicesService: UnitServicesService,
    private SystemSettingsService: SystemSettingsService,
    private SharedServices: SharedService,
    private dateService: DateConverterService,
    private rolesPerimssionsService: RolesPermissionsService,
    private translate: TranslatePipe,
    private store: Store<any>,
    private spinner: NgxSpinnerService
  ) {
    this.createOfferForm();
    this.createServiceForm();
  }

  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.currnetUrl = this.router.url;
    this.SharedServices.changeButton({ action: 'Save', submitMode: false } as ToolbarData);
    this.listenToClickedButton();
    this.changePath();
    this.getLanguage();
    this.getParmasFromActiveUrl();
    this.loadData();
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
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  //#region Toolbar Service

  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.SharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.SharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-offer";
            this.createOfferForm();
            this.SharedServices.changeToolbarPath(this.toolbarPathData);

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
    this.SharedServices.changeToolbarPath(this.toolbarPathData);
  }
  //#endregion
  //#region Authentications
  //
  //
  //#endregion
  //#region Manage State
  //#endregion
  //#region Permissions

  //#region Helper Functions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
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

  //#endregion
  //#region Basic Data
  ///Geting list of data
  createOfferForm() {
    this.OfferForm = this.fb.group({
      id: 0,
      ownerId: ['', Validators.compose([Validators.required])],
      tenantId: ['', Validators.compose([Validators.required])],
      vendorId: '',
      buildingId: ['', Validators.compose([Validators.required])],
      purposeType: ['', Validators.compose([Validators.required])],
      offerDuration: '',
      offerDate: '',
      rentalPeriod: '',
      rentPeriodType: '',
      realestateId: '',
      rentalPeriodType: '',
      averagePriceOfMeter: '',
      totalAreaSize: '',
      firtsDueDate: '',
      numberOfPayments: '',
      periodBetweenPayments: '',
      paymentTimeType: '',
      totalRentAmount: '',
      notes: '',
    });
    this.offerDate = this.dateService.getCurrentDate();
    this.firtsDueDate = this.dateService.getCurrentDate();
  }
  createServiceForm() {
    this.ContractUnitsServiceForm = this.fb.group({
      unitId: ['', Validators.compose([Validators.required])],
      serviceId: ['', Validators.compose([Validators.required])],
      payOnTimeId: '',
      calcMethodType: '',
      countofservice: { value: '', disabled: true },
      ratio: { value: 0, disabled: true },
      amount: 0,
      totalTaxes: 0,
      amountWithTax: { value: '', disabled: true },
      fromAccount: ['', Validators.compose([Validators.required])],
      toAccount: ['', Validators.compose([Validators.required])],
    });
  }
  loadData() {
    this.getOwners();
    this.getUnitPursposeTypes();
    this.getRentPeriodTypes();
    this.getpaymentTimeType();
    this.getPaymentsMethodsInRentContract();
    this.getUnitservices();
    this.getCalculateMethodsInRentContract();
    this.getContractUnitsServicesAccountsEnum();
  }
  loadDataByOwner(ownerId?: any) {
    this.getTenants();
    this.getRealestates();
    this.getBuildings();
    this.getVendors();
  }
  getUnitPursposeTypes() {
    if (this.lang == 'en') {
      this.pursposeTypes = convertEnumToArray(pursposeTypeEnum);
    }
    else {
      this.pursposeTypes = convertEnumToArray(pursposeTypeArEnum);

    }
  }
  getRentPeriodTypes() {
    if (this.lang == 'en') {
      this.rentPeriodTypes = convertEnumToArray(RentPeriodTypeEnum);
    }
    else {
      this.rentPeriodTypes = convertEnumToArray(RentPeriodTypeArEnum);

    }
  }
  getpaymentTimeType() {
    if (this.lang == 'en') {

      this.paymentTimeTypes = convertEnumToArray(PaymentTimeTypesEnum);
    }
    else {
      this.paymentTimeTypes = convertEnumToArray(PaymentTimeTypesArEnum);

    }
  }
  getOwners() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(OwnerSelectors.selectors.getListSelector).subscribe({
        next: (res: OwnersModel) => {
          this.owners = JSON.parse(JSON.stringify(res.list))
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
  getTenants() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(TenantsSelectors.selectors.getListSelector).subscribe({
        next: (res: TenantModel) => {
          this.tenants = JSON.parse(JSON.stringify(res.list))
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
  getBuildings() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(BuildingSelectors.selectors.getListSelector).subscribe({
        next: (res: BuildingsModel) => {
          this.buildings = JSON.parse(JSON.stringify(res.list))
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
  getRealestates() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(RealestateSelectors.selectors.getListSelector).subscribe({
        next: (res: RealestatesModel) => {
          this.realestates = JSON.parse(JSON.stringify(res.list))
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




  getVendors() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(VendorSelectors.selectors.getListSelector).subscribe({
        next: (res: VendorsModel) => {
          this.vendors = JSON.parse(JSON.stringify(res.list))
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
  getUnitservices() {
    const promise = new Promise<void>((resolve, reject) => {
      this.unitServicesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.unitServices = res.data.map((res: UnitServices[]) => {
            return res;
          });
          resolve();
          //(('res', res);
          //((' this.UnitsService', this.unitServices);
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
  //getPaymentsMethodsInRentContract
  getPaymentsMethodsInRentContract() {

    if (this.lang == 'en') {
      this.paymentsMethodsInRentContract = convertEnumToArray(
        PaymentsMethodsInRentContractEnum
      );
    }
    else {
      this.paymentsMethodsInRentContract = convertEnumToArray(
        PaymentsMethodsInRentContractArEnum
      );
    }
  }
  //getCalculateMethodsInRentContract
  getCalculateMethodsInRentContract() {
    if(this.lang=='en')
    {
    this.calculateMethodsInRentContract = convertEnumToArray(
      CalculateMethodsInRentContractEnum
    );
    }
    else
    {
      this.calculateMethodsInRentContract = convertEnumToArray(
        CalculateMethodsInRentContractArEnum
      );
    }
  }
  //changeCalcMethodsInRentContract
  changeCalcMethodsInRentContract(calcMethodId: any) {
    let unitId = this.ContractUnitsServiceForm.value.unitId;
    let rent = 0;
    if (calcMethodId == 1) {
      this.selectedUnits.forEach((element) => {
        if (element.unitId == unitId) {
          // if (this.isCalcServiceDependOnMonthlyRent == true) {
          //   rent = element.monthlyRent
          // }
          // else {
          rent =
            element.annualRent != null || undefined || ''
              ? Number(element.annualRent)
              : 0;
        }
      });
      this.ContractUnitsServiceForm.controls['ratio'].enable();
      var amount: any = 0;
      if (
        this.ContractUnitsServiceForm.value.payOnTimeId ==
        PaymentsMethodsInRentContractEnum['Amounts Pay In Month']
      ) {
        amount = (rent * this.ContractUnitsServiceForm.value.ratio) / 1200;
      }
      if (
        this.ContractUnitsServiceForm.value.payOnTimeId ==
        PaymentsMethodsInRentContractEnum.Quarterly
      ) {
        amount = (rent * this.ContractUnitsServiceForm.value.ratio) / 400;
      }
      if (
        this.ContractUnitsServiceForm.value.payOnTimeId ==
        PaymentsMethodsInRentContractEnum['Mid Term']
      ) {
        amount = (rent * this.ContractUnitsServiceForm.value.ratio) / 200;
      }
      if (
        this.ContractUnitsServiceForm.value.payOnTimeId ==
        PaymentsMethodsInRentContractEnum['Amounts Pay In Year']
      ) {
        amount = (rent * this.ContractUnitsServiceForm.value.ratio) / 100;
      }
      if (
        this.ContractUnitsServiceForm.value.payOnTimeId ==
        PaymentsMethodsInRentContractEnum['Amounts Pay For Once Time']
      ) {
        amount = (rent * this.ContractUnitsServiceForm.value.ratio) / 100;
      }
      this.ContractUnitsServiceForm = this.fb.group({
        unitId: this.ContractUnitsServiceForm.value.unitId,
        serviceId: this.ContractUnitsServiceForm.value.serviceId,
        payOnTimeId: this.ContractUnitsServiceForm.value.payOnTimeId,
        calcMethodType: this.ContractUnitsServiceForm.value.calcMethodType,
        countofservice: {
          value: this.ContractUnitsServiceForm.value.countofservice,
          disabled: true,
        },
        ratio: this.ContractUnitsServiceForm.value.ratio,
        amount: amount,
        totalTaxes: this.ContractUnitsServiceForm.value.totalTaxes,
        amountWithTax:
          amount +
          (amount * this.ContractUnitsServiceForm.value.totalTaxes) / 100,
        fromAccount: this.ContractUnitsServiceForm.value.fromAccount,
        toAccount: this.ContractUnitsServiceForm.value.toAccount,
      });
    }
    if (calcMethodId == 2) {
      this.ContractUnitsServiceForm.controls['amount'].enable();
      var amount = this.ContractUnitsServiceForm.value.amount;
      this.ContractUnitsServiceForm = this.fb.group({
        unitId: this.ContractUnitsServiceForm.value.unitId,
        serviceId: this.ContractUnitsServiceForm.value.serviceId,
        payOnTimeId: this.ContractUnitsServiceForm.value.payOnTimeId,
        calcMethodType: this.ContractUnitsServiceForm.value.calcMethodType,
        countofservice: {
          value: this.ContractUnitsServiceForm.value.countofservice,
          disabled: true,
        },
        ratio: { value: '', disabled: true },
        amount: amount,
        totalTaxes: this.ContractUnitsServiceForm.value.totalTaxes,
        amountWithTax:
          amount +
          (amount * this.ContractUnitsServiceForm.value.totalTaxes) / 100,
        fromAccount: this.ContractUnitsServiceForm.value.fromAccount,
        toAccount: this.ContractUnitsServiceForm.value.toAccount,
      });
    }
    if (calcMethodId == 3) {
      this.ContractUnitsServiceForm.controls['countofservice'].enable();
      this.ContractUnitsServiceForm.controls['amount'].enable();
      var amount = this.ContractUnitsServiceForm.value.amount;
      this.ContractUnitsServiceForm = this.fb.group({
        unitId: this.ContractUnitsServiceForm.value.unitId,
        serviceId: this.ContractUnitsServiceForm.value.serviceId,
        payOnTimeId: this.ContractUnitsServiceForm.value.payOnTimeId,
        calcMethodType: this.ContractUnitsServiceForm.value.calcMethodType,
        countofservice: this.ContractUnitsServiceForm.value.countofservice,
        ratio: { value: '', disabled: true },
        amount: amount,
        totalTaxes: this.ContractUnitsServiceForm.value.totalTaxes,
        amountWithTax:
          amount +
          (amount * this.ContractUnitsServiceForm.value.totalTaxes) / 100,
        fromAccount: this.ContractUnitsServiceForm.value.fromAccount,
        toAccount: this.ContractUnitsServiceForm.value.toAccount,
      });
    }
    this.ContractUnitsServiceForm.value.calcMethodType = '';
    this.calcMethodType = '';
  }
  addContractUnitsServices() {
    if (this.ContractUnitsServiceForm.valid) {
      var unit: any = '';
      var calcMethodTypeName: any = '';
      var unitService: any = '';
      var payOnTimeName: any = '';
      var fromAccount: any = '';
      var toAccount: any = '';
      if (this.ContractUnitsServiceForm.value.unitId != '') {
        unit = this.selectedUnits.filter(
          (x) => (x.id = this.ContractUnitsServiceForm.value.unitId)
        );
      }
      if (this.ContractUnitsServiceForm.value.serviceId != '') {
        unitService = this.unitServices.filter(
          (x) => (x.id = this.ContractUnitsServiceForm.value.serviceId)
        );
      }
      if (this.ContractUnitsServiceForm.value.payOnTimeId != '') {
        payOnTimeName = this.paymentsMethodsInRentContract.filter(
          (x) => (x.id = this.ContractUnitsServiceForm.value.payOnTimeId)
        );
      }
      if (this.ContractUnitsServiceForm.value.calcMethodType != '') {
        calcMethodTypeName = this.calculateMethodsInRentContract.filter(
          (x) => (x.id = this.ContractUnitsServiceForm.value.calcMethodType)
        );
      }
      if (this.ContractUnitsServiceForm.value.fromAccount != '') {
        fromAccount = this.fromServiceAccount.filter(
          (x) => (x.id = this.ContractUnitsServiceForm.value.fromAccount)
        );
      }
      if (this.ContractUnitsServiceForm.value.toAccount != '') {
        toAccount = this.toServiceAccount.filter(
          (x) => (x.id = this.ContractUnitsServiceForm.value.toAccount)
        );
      }
      this.selectedUnitServiceDetails.push({
        id: 0,
        masterOfferId: 0,
        serviceId:
          this.ContractUnitsServiceForm.value.serviceId != ''
            ? this.ContractUnitsServiceForm.value.serviceId
            : '',
        calculationMethod:
          this.ContractUnitsServiceForm.value.calcMethodType != ''
            ? this.ContractUnitsServiceForm.value.calcMethodType
            : '',
        calcMethodTypeName:
          this.ContractUnitsServiceForm.value.calcMethodType != ''
            ? calcMethodTypeName[
              this.ContractUnitsServiceForm.value.calcMethodType - 1
            ].name!
            : '',
        serviceRatio: this.ContractUnitsServiceForm.value.ratio,
        paymentMethod:
          this.ContractUnitsServiceForm.value.payOnTimeId != ''
            ? this.ContractUnitsServiceForm.value.payOnTimeId
            : '',
        payOnTimeName:
          this.ContractUnitsServiceForm.value.payOnTimeId != ''
            ? payOnTimeName[this.ContractUnitsServiceForm.value.payOnTimeId - 1]
              .name!
            : '',
        serviceAmount:
          this.showDecimalPoint == true && this.numberOfFraction > 0
            ?   (
              this.ContractUnitsServiceForm.value.amount != ''
                ? this.ContractUnitsServiceForm.value.amount
                : 0
            ).toFixed(this.numberOfFraction)
            : this.ContractUnitsServiceForm.value.amount,
        fromAccount:
          this.ContractUnitsServiceForm.value.fromAccount != ''
            ? this.ContractUnitsServiceForm.value.fromAccount
            : '',
        fromAccountName:
          this.ContractUnitsServiceForm.value.fromAccount != ''
            ? this.fromServiceAccount[
              this.ContractUnitsServiceForm.value.fromAccount - 1
            ]?.name
            : '',
        toAccount:
          this.ContractUnitsServiceForm.value.toAccount != ''
            ? this.ContractUnitsServiceForm.value.toAccount
            : '',
        toAccountName:
          this.ContractUnitsServiceForm.value.toAccount != ''
            ? this.toServiceAccount[
              this.ContractUnitsServiceForm.value.toAccount - 1
            ]?.name
            : '',
        serviceTax:
          this.showDecimalPoint == true && this.numberOfFraction > 0
            ?   (
              (this.ContractUnitsServiceForm.value.amount *
                this.ContractUnitsServiceForm.value.totalTaxes) /
              100
            ).toFixed(this.numberOfFraction)
            : (this.ContractUnitsServiceForm.value.amount *
              this.ContractUnitsServiceForm.value.totalTaxes) /
            100,
        amountAfterTax:
          this.showDecimalPoint == true && this.numberOfFraction > 0
            ?   (
              this.ContractUnitsServiceForm.value.amountWithTax
            ).toFixed(this.numberOfFraction)
            : this.ContractUnitsServiceForm.value.amountWithTax,
        unitId:
          this.ContractUnitsServiceForm.value.unitId != ''
            ? this.ContractUnitsServiceForm.value.unitId
            : '',
        unitNameAr:
          this.ContractUnitsServiceForm.value.unitId != ''
            ? unit.find(
              (x) => x.id == this.ContractUnitsServiceForm.value.unitId
            ).unitNameAr
            : '',
        unitNameEn:
          this.ContractUnitsServiceForm.value.unitId != ''
            ? unit.find(
              (x) => x.id == this.ContractUnitsServiceForm.value.unitId
            ).unitNameEn
            : '',
        numberOfServices: this.ContractUnitsServiceForm.value.countOfService,
        unitServiceNameAr:
          this.ContractUnitsServiceForm.value.serviceId != ''
            ? unitService.find(
              (x) => x.id == this.ContractUnitsServiceForm.value.serviceId
            ).unitServiceArName
            : '',
        unitServiceNameEn:
          this.ContractUnitsServiceForm.value.serviceId != ''
            ? unitService.find(
              (x) => x.id == this.ContractUnitsServiceForm.value.serviceId
            ).unitServiceEnName
            : '',
      });
      this.ContractUnitsServiceForm = this.fb.group({
        unitId: '',
        serviceId: '',
        payOnTimeId: '',
        calcMethodType: '',
        countofservice: '',
        ratio: '',
        amount: 0,
        totalTaxes: 0,
        amountWithTax: '',
        fromAccount: '',
        toAccount: '',
      });
    } else {
      return this.ContractUnitsServiceForm.markAllAsTouched();
    }
  }
  //getContractUnitsServicesAccountsEnum
  getContractUnitsServicesAccountsEnum() {
    if(this.lang=='en')
    {
    this.fromServiceAccount = convertEnumToArray(
      ContractUnitsServicesAccountsEnum
    );
    this.toServiceAccount = convertEnumToArray(
      ContractUnitsServicesAccountsEnum
    );
    }
    else
    {
      this.fromServiceAccount = convertEnumToArray(
        ContractUnitsServicesAccountsArEnum
      );
      this.toServiceAccount = convertEnumToArray(
        ContractUnitsServicesAccountsArEnum
      );
    }
  }
  deleteUnitServices(item: OfferUnitServiceDetails) {
    if (item != null) {
      const index: number = this.selectedUnitServiceDetails.indexOf(item);
      if (index !== -1) {
        this.selectedUnitServiceDetails.splice(index, 1);
      }
    }
  }
  // Reusable unit component Output function
  onLoadUnits(e: Unit[]) {
    this.units = e;
  }
  onSelectChangeUnits(event: SelectedUnit[]) {

    this.selectedUnits = [];
    this.selectedUnits = event;
    //(('this.selectedUnits ----------------', this.selectedUnits);
  }
  onSelectChangeUnitsCalculateTotals(event: UnitReusableTotals) {
    this.unitTotals = event;
    //(('this.unitTotals', this.unitTotals);
    this.OfferForm.patchValue({
      averagePriceOfMeter: this.unitTotals.averagePriceOfMeter,
      totalAreaSize: this.unitTotals.totalAreaSize,
      totalRentAmount: this.unitTotals.totalRentAmount,
    });
  }
  //#endregion
  //#region Crud Operation
  submited: boolean = false;
  onSave() {
    this.submited = true;
    if (this.OfferForm.valid) {
      this.SharedServices.changeButtonStatus({button:'Save',disabled:true})

      this.spinner.show();
      this.offerObject = { ...this.OfferForm.value };
      if (this.selectedUnits.length > 0) {
        this.selectedUnits.forEach((element) => {
          element.id = 0;
        });
        //(('this.selectedUnits', this.selectedUnits);
        this.offerObject.offerUnitDetails = [...this.selectedUnits];
      }
      if (this.selectedUnitServiceDetails.length > 0) {
        this.offerObject.offerUnitServiceDetails = [
          ...this.selectedUnitServiceDetails,
        ];
      }

      this.offerObject.offerDate = this.dateService.getDateForInsertISO_Format(this.offerDate);
      this.offerObject.firtsDueDate = this.dateService.getDateForInsertISO_Format(this.firtsDueDate);
      this.offersService.addData('Insert', this.offerObject).subscribe((result) => {
        this.Response = { ...result };
        this.showResponseMessage(this.Response.success, AlertTypes.success, this.translate.transform("messages.add-success"));
        this.OfferForm.reset();
        this.submited = false;
        setTimeout(() => {
          this.navigateUrl(this.listUrl);
          this.spinner.hide();
        },500);
      });
    } else {
      this.SharedServices.changeButtonStatus({button:'Save',disabled:false})

      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.OfferForm.markAllAsTouched();
    }
  }
  setUnitsAndUnitServicesData() {

    // if (this.selectedUnits.length > 0) {
    //   this.selectedUnits.forEach((element) => {element.id = 0;});
    //   this.offerObject.offerUnitDetails = [...this.selectedUnits]}
    // if (this.selectedUnitServiceDetails.length > 0) {
    //   this.offerObject.offerUnitServiceDetails = [ ...this.selectedUnitServiceDetails];
    // }
    if (this.isOfferDateChange) {
      this.offerObject.offerDate = this.dateService.getDateForInsertISO_Format(this.offerDate);
    }
    if (this.firtsDueDate) {
      this.offerObject.firtsDueDate = this.dateService.getDateForInsertISO_Format(this.firtsDueDate);
    }
  }

  setData() {
    this.OfferForm.patchValue({
      id: this.offerObject.id,
      ownerId: this.offerObject.ownerId,
      tenantId: this.offerObject.tenantId,
      vendorId: this.offerObject.vendorId,
      buildingId: this.offerObject.buildingId,
      purposeType: this.offerObject.purposeType,
      offerDuration: this.offerObject.offerDuration,
      rentalPeriod: this.offerObject.rentalPeriod,
      rentPeriodType: this.offerObject.rentPeriodType,
      realestateId: this.offerObject.realestateId,
      rentalPeriodType: this.offerObject.rentalPeriodType,
      averagePriceOfMeter: this.offerObject.averagePriceOfMeter,
      totalAreaSize: this.offerObject.totalAreaSize,
      firtsDueDate: this.offerObject.firtsDueDate,
      offerDate: this.offerObject.offerDate,
      numberOfPayments: this.offerObject.numberOfPayments,
      periodBetweenPayments: this.offerObject.periodBetweenPayments,
      paymentTimeType: this.offerObject.paymentTimeType,
      totalRentAmount: this.offerObject.totalRentAmount,
      notes: this.offerObject.notes,
      offerUnitDetails: this.offerObject.offerUnitDetails,
      offerUnitServiceDetails: this.offerObject.offerUnitServiceDetails,
    })

  }

  onUpdate() {
    this.submited = true;
    if (this.OfferForm.value != null) {
      this.spinner.show();
      this.offerObject = { ...this.OfferForm.value };
      // this.offerObject.id = this.offerId;
      this.setUnitsAndUnitServicesData();
      this.offersService.updateWithUrl("Update", this.offerObject).subscribe((result) => {
        this.Response = { ...result };
        this.showResponseMessage(this.Response.success, AlertTypes.success, this.translate.transform("messages.update-success"));
        this.OfferForm.reset();
        this.submited = false;

        setTimeout(() => {
          this.navigateUrl(this.listUrl);
          this.spinner.hide();
        }, 500);
      });
    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.OfferForm.markAllAsTouched();
    }
  }

  setUnitServicesAccount() {
    this.selectedUnitServiceDetails.forEach((element) => {
      element.fromAccountName = element.fromAccount != null
        ? this.fromServiceAccount[element.fromAccount - 1]?.name
        : '';
      element.toAccountName =
        element.fromAccount != null
          ? this.toServiceAccount[element.toAccount - 1]?.name
          : '';
      element.payOnTimeName =
        element.paymentMethod != null
          ? this.paymentsMethodsInRentContract.find(
            (x) => (x.id = element.paymentMethod)
          )?.name
          : '';
      element.calcMethodTypeName =
        element.calculationMethod != null
          ? this.calculateMethodsInRentContract.find(
            (x) => (x.id = element.calculationMethod)
          )?.name
          : '';
    });
  }
  getOfferById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.offersService.getByIdWithUrl("getbyId?Id=" + id).subscribe({
        next: (res: any) => {
          if (res.data != null) {
            this.spinner.show();
            //(('res.data get by id', res.data);
            this.loadDataByOwner(res.data.offer.ownerId);
            this.offerObject = { ...res.data.offer }

            this.offerDate = this.dateService.getDateForCalender(
              res.data.offer.offerDate
            );
            this.firtsDueDate = this.dateService.getDateForCalender(
              res.data.offer.firtsDueDate
            );
            //load all form data
            this.selectedUnits = [...res.data.vmOfferUnitDetails];
            this.onSelectChangeUnits(this.selectedUnits);
            this.selectedUnitServiceDetails = [...res.data.vmOfferUnitServiceDetails];
            this.setUnitServicesAccount();
            this.setData()
            setTimeout(() => {
              this.spinner.hide();
            },500);

          }
        },
        error: (err: any) => {
          reject(err);
          this.spinner.hide();
        },
        complete: () => {

        },
      });
    });
    return promise;
  }
  //#endregion
  //#region Helper Functions
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.OfferForm.controls;
  }
  get csf(): { [key: string]: AbstractControl } {
    return this.ContractUnitsServiceForm.controls;
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

  getParmasFromActiveUrl() {
    this.offerId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.offerId > 0) {
      localStorage.setItem("RecordId",this.offerId);
      this.getOfferById(this.offerId);
      this.SharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
    }
  }
  getSystemSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.SystemSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          //(('result data', res.data);
          this.showDecimalPoint = res.data[0].showDecimalPoint;
          this.showThousandsComma = res.data[0].showThousandsComma;
          this.showRoundingFractions = res.data[0].showRoundingFractions;
          this.numberOfFraction = res.data[0].numberOfFraction;
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

  //#region Date Picker

  offerDate!: DateModel;
  firtsDueDate!: DateModel;
  isOfferDateChange: boolean = false;
  isFirstDueDateChange: boolean = false;
  getOfferDate(selectedDate: DateModel) {
    this.isOfferDateChange = true;
    this.offerDate = selectedDate;
  }
  getFirtsDueDate(selectedDate: DateModel) {
    this.isFirstDueDateChange = true;
    this.firtsDueDate = selectedDate;
  }
  //#endregion

  onRentContractUnitChange(selectedUnit: SelectedUnit[]) {
    this.offer!.offerUnitDetails = selectedUnit;



  }
}
