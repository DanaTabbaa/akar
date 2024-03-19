import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertTypes, convertEnumToArray, MaintenanceCostOnArEnum, MaintenanceCostOnEnum, pursposeTypeEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { Equipments } from 'src/app/core/models/equipments';
import { ProductCategory } from 'src/app/core/models/Product-category';
import { Products } from 'src/app/core/models/products';
import { Unit } from 'src/app/core/models/units';
import { EquipmentsVM } from 'src/app/core/models/ViewModel/equipments-vm';
import { EquipmentsService } from 'src/app/core/services/backend-services/equipments.service';
import { ProductsCategoriesService } from 'src/app/core/services/backend-services/products-categories.service';
import { ProductsService } from 'src/app/core/services/backend-services/products.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { UnitVM } from 'src/app/core/view-models/unit-vm';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { TranslatePipe } from '@ngx-translate/core';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProductsReceiptDetails } from 'src/app/core/models/products-receipt-details';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { TechniciansService } from 'src/app/core/services/backend-services/technicians.service';
import { ProductsReceiptService } from 'src/app/core/services/backend-services/products-receipt.service';
import { ProductsReceiptDetailsService } from 'src/app/core/services/backend-services/products-receipt-details.service';
import { TenantsVM } from 'src/app/core/models/ViewModel/tenants-vm';
import { TechniciansVM } from 'src/app/core/models/ViewModel/technicians-vm';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { PriceRequestsService } from 'src/app/core/services/backend-services/price-requests.service';
import { MaintenanceRequestsService } from 'src/app/core/services/backend-services/maintenance-requests.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ProductsReceipt } from 'src/app/core/models/products-receipt';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { Store } from '@ngrx/store';
const PAGEID = 25; // from pages table in database seeding table

@Component({
  selector: 'app-products-receipt',
  templateUrl: './products-receipt.component.html',
  styleUrls: ['./products-receipt.component.scss'],
})
export class ProductsReceiptComponent implements OnInit, OnDestroy {
  constructor(
    private dateService: DateCalculation,
    private productsReceiptService: ProductsReceiptService,
    private productsReceiptDetailsService: ProductsReceiptDetailsService,
    private productsCategoriesService: ProductsCategoriesService,
    private priceRequestsService: PriceRequestsService,
    private maintenanceRequestsService: MaintenanceRequestsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private tenantsService: TenantsService,
    private techniciansService: TechniciansService,
    private productsService: ProductsService,
    private unitsService: UnitsService,
    private equipmentsService: EquipmentsService,
    private router: Router,
    private AlertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,
    private searchDialog: SearchDialogService,
    private store: Store<any>,
    private SystemSettingsService: SystemSettingsService,

  ) { }

  addUrl: string = '/control-panel/maintenance/add-products-receipt';
  updateUrl: string = '/control-panel/maintenance/update-products-receipt/';
  listUrl: string = '/control-panel/maintenance/products-receipt-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.products-receipts',
    componentAdd: 'products-receipt.add-products-receipt',
  };
  //region properties
  lang: string = '';
  productsReceiptDetails: ProductsReceiptDetails[] = [];
  productsReceiptForm!: FormGroup;
  subsList: Subscription[] = [];
  date!: DateModel;
  productCategories: ProductCategory[] = [];
  products: Products[] = [];
  searhProducts: Products[] = [];
  selectProduct: Products[] = [];
  tenants: TenantsVM[] = [];
  technicians: TechniciansVM[] = [];
  units: UnitVM[] = [];
  equipments: Equipments[] = [];
  maintenanceCostOn: ICustomEnum[] = [];
  submited: boolean = false;
  productCategoryId: any;
  productId: any;
  valueBeforeTax: number = 0;
  price: number = 0;
  taxRatio: number = 0;
  taxValue: number = 0;
  quantity: number = 0;
  installationPrice: number = 0;
  valueWithInstallationPriceBeforeTax: number = 0;
  valueAfterTax: number = 0;
  unitId: any;
  equipmentId: any;
  totalWithInstallationPriceBeforeTax: number = 0;
  totalTax: number = 0;
  totalAfterTax: number = 0;
  errorMessage = '';
  errorClass = '';
  queryParams: any;
  maintenanceRequestId: any;
  id: any;
  sub: any;
  productReceiptId: any;
  Response!: ResponseResult<ProductsReceipt>;
  showProductReceiptId:boolean=false;
  showMaintenanceRequestId:boolean=false;

  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number;


  //endregion
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.sharedServices.changeButton({action:'New'}as ToolbarData);
    this.getPagePermissions(PAGEID);
    this.getLanguage();
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId",params["id"]);
          this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
          this.showProductReceiptId=true;
          this.getMaintenanceRequestById(this.id);
          this.getProductsReceiptByReceiptId(this.id);
          this.getProductsReceiptDetailsByReceiptId(this.id);
        }
      }
    });

    this.queryParams = this.route.queryParams.subscribe((params) => {
      if (params['maintenanceRequestId'] != null) {
        this.showMaintenanceRequestId=true;
        this.maintenanceRequestId = params['maintenanceRequestId'];
        if (this.maintenanceRequestId > 0) {
          this.getPriceRequestByMaintenanceRequestId(this.maintenanceRequestId);
        }
      }
    });
    // this.sharedServices.changeButton({action:"Save"}as ToolbarData)
    this.initalizeDates();
    this.cleanProductsReceipt();
    this.cleanProductsReceiptDetails();
    this.listenToClickedButton();
    this.changePath();
    this.getMaintenanceCostOn();
    // this.spinner.show();
    // Promise.all([
      this.getSystemSettings()
      this.getTenants()
      this.getTechnicians()
      this.getProductCategories()
      this.getProducts()
      this.getUnits()
      this.getEquipments()
    // ]).then((a) => {
    //    ;
    //   this.spinner.hide();
    // });
  }
  initalizeDates() {
    this.date = this.dateService.getCurrentDate();
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
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
  cleanProductsReceipt() {
    this.productsReceiptForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      maintenanceRequestId: [
        { value: this.maintenanceRequestId, disabled: true },
      ],
      date: REQUIRED_VALIDATORS,
      tenantId: REQUIRED_VALIDATORS,
      technicianId: REQUIRED_VALIDATORS,
      maintenanceCostOn: REQUIRED_VALIDATORS,
      notes: '',
    });
    (this.totalWithInstallationPriceBeforeTax = 0), (this.totalTax = 0);
    this.totalAfterTax = 0;
  }
  cleanProductsReceiptDetails() {
    this.productCategoryId = '';
    this.productId = '';
    this.valueBeforeTax = 0;
    this.price = 0;
    this.taxRatio = 0;
    this.taxValue = 0;
    this.quantity = 0;
    this.installationPrice = 0;
    this.valueWithInstallationPriceBeforeTax = 0;
    this.valueAfterTax = 0;
    this.unitId = '';
    this.equipmentId = '';
  }
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
  }
  getProductCategories() {

    const promise = new Promise<void>((resolve, reject) => {
      this.productsCategoriesService.getAll('GetAll').subscribe({
        next: (res: any) => {

          this.productCategories = res.data.map((res: ProductCategory[]) => {
            return res;
          });
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

  getProducts() {

    const promise = new Promise<void>((resolve, reject) => {
      this.productsService.getAll('GetAll').subscribe({
        next: (res: any) => {

          this.searhProducts = JSON.parse(JSON.stringify(res.data));
          console.log("res", res)
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
  getSystemSettings() {

    const promise = new Promise<void>((resolve, reject) => {
      this.SystemSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          this.showDecimalPoint = res.data[0].showDecimalPoint
          this.showThousandsComma = res.data[0].showThousandsComma
          this.showRoundingFractions = res.data[0].showRoundingFractions
          this.numberOfFraction = res.data[0].numberOfFraction

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
  getTenants() {
    const promise = new Promise<void>((resolve, reject) => {
      this.tenantsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.tenants = res.data.map((res: TenantsVM[]) => {
            return res;
          });
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
  getTechnicians() {

    const promise = new Promise<void>((resolve, reject) => {
      this.techniciansService.getAll('GetAll').subscribe({
        next: (res: any) => {

          this.technicians = res.data.map((res: TechniciansVM[]) => {
            return res;
          });
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
  onChangeProductCatgeory() {
    this.products = this.searhProducts.filter((x) => x.productCategoryId == this.selectProductsReceiptDetails.productCategoryId
    );
  }

  getUnits() {

    const promise = new Promise<void>((resolve, reject) => {
      this.unitsService.getAll('GetAll').subscribe({
        next: (res: any) => {

          this.units = res.data
            .filter((x) => x.purposeType == pursposeTypeEnum['For Rent']
            || x.purposeType==pursposeTypeEnum['For Sell and Rent'])
            .map((res: Unit[]) => {
              return res;
            });
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

  getEquipments() {

    const promise = new Promise<void>((resolve, reject) => {
      this.equipmentsService.getAll('GetAll').subscribe({
        next: (res: any) => {

          this.equipments = res.data.map((res: EquipmentsVM[]) => {
            return res;
          });
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
  getMaintenanceCostOn() {
    if (this.lang == 'en') {
      this.maintenanceCostOn = convertEnumToArray(MaintenanceCostOnEnum);
    }
    else {
      this.maintenanceCostOn = convertEnumToArray(MaintenanceCostOnArEnum);

    }
  }

  deleteProduct(item: ProductsReceiptDetails) {
    if (item != null) {
      const index: number = this.productsReceiptDetails.indexOf(item);
      if (index !== -1) {
        this.productsReceiptDetails.splice(index, 1);
        this.totalWithInstallationPriceBeforeTax =
          this.totalWithInstallationPriceBeforeTax -
          item.valueWithInstallationPriceBeforeTax;
        this.totalTax = this.totalTax - item.taxValue;
        this.totalAfterTax = this.totalAfterTax - item.valueAfterTax;
        // this.defineGridColumn();
      }
    }
  }

  addProduct() {
    if (this.selectProductsReceiptDetails.productCategoryId == undefined || this.selectProductsReceiptDetails.productCategoryId == null || this.selectProductsReceiptDetails.productCategoryId == 0) {
      this.errorMessage = this.translate.transform('general.product-category-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectProductsReceiptDetails.productId == undefined || this.selectProductsReceiptDetails.productId == null || this.selectProductsReceiptDetails.productId == 0) {
      this.errorMessage = this.translate.transform('general.product-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectProductsReceiptDetails.quantity == undefined || this.selectProductsReceiptDetails.quantity == null || this.selectProductsReceiptDetails.quantity == 0) {
      this.errorMessage = this.translate.transform('general.quantity-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectProductsReceiptDetails.price == undefined || this.selectProductsReceiptDetails.price == null || this.selectProductsReceiptDetails.price == 0) {
      this.errorMessage = this.translate.transform('general.price-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    var productCategory: any = '';
    this.productCategories.forEach((element) => {
      if (element.id == this.selectProductsReceiptDetails.productCategoryId) {
        productCategory = element;
      }
    });

    var product: any = '';
    this.searhProducts.forEach((element) => {
      if (element.id == this.selectProductsReceiptDetails.productId) {
        product = element;
      }
    });

    var unit: any = '';
    this.units.forEach((element) => {
      if (element.id == this.selectProductsReceiptDetails.unitId) {
        unit = element;
      }
    });

    var equipment: any = '';
    this.equipments.forEach((element) => {
      if (element.id == this.selectProductsReceiptDetails.equipmentId) {
        equipment = element;
      }
    });

    this.productsReceiptDetails.push({
      id: undefined,
      productReceiptId: undefined,
      productCategoryId: this.selectProductsReceiptDetails.productCategoryId,
      categoryNameAr: this.selectProductsReceiptDetails.categoryNameAr,
      categoryNameEn: this.selectProductsReceiptDetails.categoryNameEn,
      productId: this.selectProductsReceiptDetails.productId,
      productNameAr: this.selectProductsReceiptDetails.productNameAr || '',
      productNameEn: this.selectProductsReceiptDetails.productNameEn || '',
      quantity: Number(this.selectProductsReceiptDetails.quantity),
      price: Number(this.selectProductsReceiptDetails.price),
      valueBeforeTax: Number(this.selectProductsReceiptDetails.valueBeforeTax),
      installationPrice: Number(this.selectProductsReceiptDetails.installationPrice),
      valueWithInstallationPriceBeforeTax: Number(
        this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax
      ),
      taxRatio: Number(this.selectProductsReceiptDetails.taxRatio),
      taxValue: Number(this.selectProductsReceiptDetails.taxValue),
      valueAfterTax: Number(this.selectProductsReceiptDetails.valueAfterTax),
      unitId: this.selectProductsReceiptDetails.unitId,
      unitNameAr: this.selectProductsReceiptDetails.unitNameAr || '',
      unitNameEn: this.selectProductsReceiptDetails.unitNameEn || '',
      equipmentId: this.selectProductsReceiptDetails.equipmentId,
      equimentNameAr: this.selectProductsReceiptDetails.equimentNameAr || '',
      equipmentNameEn: this.selectProductsReceiptDetails.equipmentNameEn || '',
      maintenanceRequestId: undefined,
      billed: false,
      maintenanceBillId: undefined,
    });
    if (this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax != undefined || this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax != null || this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax > 0) {
      this.totalWithInstallationPriceBeforeTax +=
      // Number(
      //   this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax
      // );

      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? Math.round(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax).toFixed(this.numberOfFraction)
      : this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax)
    }
    if (this.selectProductsReceiptDetails.taxValue != undefined || this.selectProductsReceiptDetails.taxValue != null || this.selectProductsReceiptDetails.taxValue > 0) {
      this.totalTax +=
     // Number(this.selectProductsReceiptDetails.taxValue);
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? Math.round(this.selectProductsReceiptDetails.taxValue).toFixed(this.numberOfFraction)
      : this.selectProductsReceiptDetails.taxValue)
    }
    if (this.selectProductsReceiptDetails.valueAfterTax != undefined || this.selectProductsReceiptDetails.valueAfterTax != null || this.selectProductsReceiptDetails.valueAfterTax > 0) {
      this.totalAfterTax +=
    //  Number(this.selectProductsReceiptDetails.valueAfterTax);
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? Math.round(this.selectProductsReceiptDetails.valueAfterTax).toFixed(this.numberOfFraction)
      : this.selectProductsReceiptDetails.valueAfterTax)
    }
    this.cleanProductsReceiptDetails();
    this.clearSelectedItemData();

    // this.defineGridColumn();
  }
  getRequestDate(selectedDate: DateModel) {
    this.date = selectedDate;
  }

  onChangeProduct() {
    this.price = this.searhProducts.find(
      (x) => x.id == this.productId
    )?.sellPrice;
    this.taxRatio = this.searhProducts.find(
      (x) => x.id == this.productId
    )?.taxRatio;
  }
  onChangeQuantityOrPrice() {
    if (this.selectProductsReceiptDetails.quantity != undefined && this.selectProductsReceiptDetails.price != undefined) {
      this.selectProductsReceiptDetails.valueBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ( Number(this.selectProductsReceiptDetails.quantity) * Number(this.selectProductsReceiptDetails.price)).toFixed(this.numberOfFraction)
            :  Number(this.selectProductsReceiptDetails.quantity) * Number(this.selectProductsReceiptDetails.price))
      if (this.selectProductsReceiptDetails.installationPrice != undefined) {
        this.valueWithInstallationPriceBeforeTax =

        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectProductsReceiptDetails.valueBeforeTax) + Number(this.selectProductsReceiptDetails.installationPrice)).toFixed(this.numberOfFraction)
            : Number(this.selectProductsReceiptDetails.valueBeforeTax) + Number(this.selectProductsReceiptDetails.installationPrice))

      }
      else {
        this.valueWithInstallationPriceBeforeTax =

        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectProductsReceiptDetails.valueBeforeTax)).toFixed(this.numberOfFraction)
            :  Number(this.selectProductsReceiptDetails.valueBeforeTax))
      }
      this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax = this.valueWithInstallationPriceBeforeTax
      this.valueAfterTax = Number(this.valueWithInstallationPriceBeforeTax);
      this.selectProductsReceiptDetails.valueAfterTax = this.valueAfterTax;

    }

  }
  onChangeInstallationPrice() {
    if (this.selectProductsReceiptDetails.installationPrice > 0) {
      this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax =

      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ( Number(this.selectProductsReceiptDetails.valueBeforeTax) + Number(this.selectProductsReceiptDetails.installationPrice)).toFixed(this.numberOfFraction)
            :  Number(this.selectProductsReceiptDetails.valueBeforeTax) + Number(this.selectProductsReceiptDetails.installationPrice));
    } else {
      this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectProductsReceiptDetails.valueBeforeTax)).toFixed(this.numberOfFraction)
            : Number(this.selectProductsReceiptDetails.valueBeforeTax))

    }
    if (this.selectProductsReceiptDetails.taxRatio > 0) {
      this.selectProductsReceiptDetails.taxValue =

      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) *
      Number(this.selectProductsReceiptDetails.taxRatio / 100)).toFixed(this.numberOfFraction)
            : Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) *
            Number(this.selectProductsReceiptDetails.taxRatio / 100));

      this.selectProductsReceiptDetails.valueAfterTax =

      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) +
      Number(this.selectProductsReceiptDetails.taxValue)).toFixed(this.numberOfFraction)
            : Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) +
            Number(this.selectProductsReceiptDetails.taxValue));


    } else {
      this.selectProductsReceiptDetails.valueAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax).toFixed(this.numberOfFraction)
            : this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax)

    }
  }
  onChangeTaxRatio() {
    this.selectProductsReceiptDetails.taxValue =
    Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) *
    Number(this.selectProductsReceiptDetails.taxRatio / 100)).toFixed(this.numberOfFraction)
            : Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) *
            Number(this.selectProductsReceiptDetails.taxRatio / 100))

    if (this.selectProductsReceiptDetails.taxValue > 0) {
      this.selectProductsReceiptDetails.valueAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ( Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) +
      Number(this.selectProductsReceiptDetails.taxValue)).toFixed(this.numberOfFraction)
      :  Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax) +
      Number(this.selectProductsReceiptDetails.taxValue))


    } else {
      this.selectProductsReceiptDetails.valueAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax)).toFixed(this.numberOfFraction)
            : Number(this.selectProductsReceiptDetails.valueWithInstallationPriceBeforeTax))

    }
  }

  onSave() {
    this.submited = true;
    if (this.productsReceiptForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      if (this.productsReceiptDetails.length == 0 || this.selectProduct == null) {
        this.errorMessage = this.translate.transform('general.add-details');
        this.errorClass = this.translate.transform('general.error-message');
        this.AlertsService.showError(
          this.errorMessage,
          this.translate.transform('general.error')
        );
        return;
      }
      this.productsReceiptForm.value.date = this.dateService.getDateForInsert2(
        this.date
      );
      this.productsReceiptForm.value.maintenanceRequestId =
        this.maintenanceRequestId;
      this.productsReceiptForm.value.totalWithInstallationPriceBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalWithInstallationPriceBeforeTax).toFixed(this.numberOfFraction)
            : this.totalWithInstallationPriceBeforeTax)
      this.productsReceiptForm.value.totalTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalTax).toFixed(this.numberOfFraction)
      : this.totalTax)

      this.productsReceiptForm.value.totalAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalAfterTax).toFixed(this.numberOfFraction)
      : this.totalAfterTax)
      this.productsReceiptService
        .addWithUrl('insert', this.productsReceiptForm.value)
        .subscribe((result) => {
          if (result != null) {

            let productReceiptId = result.data?.id;
            if (this.productsReceiptDetails != null) {
              this.productsReceiptDetails.forEach((element) => {
                element.productReceiptId = productReceiptId;
              });

              this.productsReceiptDetailsService
                .addData('insert', this.productsReceiptDetails)
                .subscribe((result) => { });
              // this.Response = { ...result };

              // this.store.dispatch(ProductsReceiptDetailsActions.actions.insert({
              //   data: JSON.parse(JSON.stringify({ ...result.data }))
              // }));

              this.showResponseMessage(true, AlertTypes.add);
              this.cleanProductsReceipt();
              this.productsReceiptDetails = [];
              this.submited = false;
              setTimeout(() => {
                this.navigateUrl(this.listUrl);
              }, 500);
            }
          }
        });
    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.productsReceiptForm.markAllAsTouched();
    }
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
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        this.translate.transform('messages.error-occurred-fail'),
        this.translate.transform('messageTitle.error')
      );
    }
  }
  onUpdate() {
    this.submited = true;
    if (this.productsReceiptForm.valid) {
      if (this.productsReceiptDetails.length == 0 || this.selectProduct == null) {
        this.errorMessage = this.translate.transform('general.add-details');
        this.errorClass = this.translate.transform('general.error-message');
        this.AlertsService.showError(
          this.errorMessage,
          this.translate.transform('general.error')
        );
        return;
      }
      this.productsReceiptForm.value.date = this.dateService.getDateForInsert2(
        this.date
      );
      this.productsReceiptForm.value.maintenanceRequestId =
        this.maintenanceRequestId;
      this.productsReceiptForm.value.totalWithInstallationPriceBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalWithInstallationPriceBeforeTax).toFixed(this.numberOfFraction)
            : this.totalWithInstallationPriceBeforeTax)
      this.productsReceiptForm.value.totalTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalTax).toFixed(this.numberOfFraction)
      : this.totalTax)

      this.productsReceiptForm.value.totalAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalAfterTax).toFixed(this.numberOfFraction)
      : this.totalAfterTax)
      this.productsReceiptForm.value.id = this.id;

      this.productsReceiptService
        .updateWithUrl('Update', this.productsReceiptForm.value)
        .subscribe((result) => {
          if (result != null) {
            let productReceiptId = result.data.id;
            if (this.productsReceiptDetails != null) {
              this.productsReceiptDetails.forEach((element) => {
                element.productReceiptId = productReceiptId;
              });
              this.productsReceiptDetailsService
                .updateAllWithUrl('update', this.productsReceiptDetails)
                .subscribe((result) => {
                  // this.store.dispatch(ProductsReceiptDetailsActions.actions.update({
                  //   data: JSON.parse(JSON.stringify({ ...result.data }))
                  // }));
                  this.cleanProductsReceipt();
                  this.productsReceiptDetails = [];
                });



              this.showResponseMessage(true, AlertTypes.update);
              this.submited = false;

              setTimeout(() => {
                this.navigateUrl(this.listUrl);
              }, 500);
            }
          }
        });
    } else {
      // this.errorMessage = "Please enter valid data";
      // this.errorClass = 'errorMessage';
      //  this.alertsService.showError(this.errorMessage, "خطأ")
      return this.productsReceiptForm.markAllAsTouched();
    }
  }

  ////////////////////////
  getProductsReceiptByReceiptId(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsReceiptService.getByIdWithUrl('GetById?id=' + id).subscribe({
        next: (res: any) => {
          if (res.data != null) {
            this.toolbarPathData.componentAdd =
              'products-receipt.update-products-receipt';
            this.productsReceiptForm.setValue({
              id: res.data.id,
              date: this.dateService.getDateForCalender(res.data.date),
              tenantId: res.data.tenantId,
              technicianId: res.data.technicianId,
              maintenanceCostOn: res.data.maintenanceCostOn,
              notes: res.data.notes,
              maintenanceRequestId: res.data.maintenanceRequestId,
            });
            if(res.data.maintenanceRequestId!=null || res.data.maintenanceRequestId!=undefined || res.data.maintenanceRequestId>0)
            {
              this.showMaintenanceRequestId=true;
            }
            this.totalWithInstallationPriceBeforeTax =
              res.data.totalWithInstallationPriceBeforeTax;
            this.totalTax = res.data.totalTax;
            this.totalAfterTax = res.data.totalAfterTax;
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
  getProductsReceiptDetailsByReceiptId(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsReceiptDetailsService.getById(id).subscribe({
        next: (res: any) => {
          if (res.data != null && res.data.length > 0) {
            res.data.forEach((element) => {
              this.productsReceiptDetails.push({
                id: element.id,
                productReceiptId: element.productReceiptId,
                productCategoryId: element.productCategoryId,
                categoryNameAr: element.categoryNameAr,
                categoryNameEn: element.categoryNameEn,
                productId: element.productId,
                productNameAr: element.productNameAr || '',
                productNameEn: element.productNameEn || '',
                quantity: Number(element.quantity),
                price: Number(element.price),
                valueBeforeTax: Number(element.valueBeforeTax),
                installationPrice: Number(element.installationPrice),
                valueWithInstallationPriceBeforeTax: Number(
                  element.valueWithInstallationPriceBeforeTax
                ),
                taxRatio: Number(element.taxRatio),
                taxValue: Number(element.taxValue),
                valueAfterTax: Number(element.valueAfterTax),
                unitId: element.unitId,
                unitNameAr: element.unitNameAr || '',
                unitNameEn: element.unitNameEn || '',
                equipmentId: element.equipmentId,
                equimentNameAr: element.equipmentNameAr || '',
                equipmentNameEn: element.equipmentNameEn || '',
                maintenanceRequestId: undefined,
                billed: false,
                maintenanceBillId: undefined,
              });
            });
          }
          //  this.defineGridColumn();
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
    return promise;
  }
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
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd =
              'products-receipt.add-products-receipt';
            this.router.navigate([this.addUrl]);
            this.cleanProductsReceipt();
            this.cleanProductsReceiptDetails();
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
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
  get pr(): { [key: string]: AbstractControl } {
    return this.productsReceiptForm.controls;
  }
  getPriceRequestByMaintenanceRequestId(requestId: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.priceRequestsService.getById(requestId).subscribe({
        next: (res: any) => {
          if (res.data.length > 0) {
            this.totalWithInstallationPriceBeforeTax =
              res.data[0].totalWithInstallationPriceBeforeTax;
            this.totalTax = res.data[0].totalTax;
            this.totalAfterTax = res.data[0].totalAfterTax;

            res.data.forEach((element) => {
              this.productsReceiptDetails.push({
                id: element.id,
                productCategoryId: element.productCategoryId,
                categoryNameAr: element.categoryNameAr,
                categoryNameEn: element.categoryNameEn,
                productId: element.productId,
                productNameAr: element.productNameAr || '',
                productNameEn: element.productNameEn || '',
                quantity: Number(element.quantity),
                price: Number(element.price),
                valueBeforeTax: Number(element.valueBeforeTax),
                installationPrice: Number(element.installationPrice),
                valueWithInstallationPriceBeforeTax: Number(
                  element.valueWithInstallationPriceBeforeTax
                ),
                taxRatio: Number(element.taxRatio),
                taxValue: Number(element.taxValue),
                valueAfterTax: Number(element.valueAfterTax),
                unitId: element.unitId,
                unitNameAr: element.unitNameAr || '',
                unitNameEn: element.unitNameEn || '',
                equipmentId: element.equipmentId,
                equimentNameAr: element.equipmentNameAr || '',
                equipmentNameEn: element.equipmentNameEn || '',
                maintenanceRequestId: undefined,
                productReceiptId: element.id,
                billed: false,
                maintenanceBillId: undefined,
              });
            });
          } else {
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
  getMaintenanceRequestById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceRequestsService.getById(id).subscribe({
        next: (res: any) => {
          this.productsReceiptForm.setValue({
            id: [{ value: '', disabled: true }],
            maintenanceRequestId: [
              { value: this.maintenanceRequestId, disabled: true },
            ],
            date: '',
            tenantId: res.data.tenantId,
            technicianId: res.data.technicianId,
            maintenanceCostOn: '',
            notes: '',
          });
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
    return promise;
  }
  //// Start editable grid details
  deleteItem(index) {
    if (this.productsReceiptDetails.length) {
      if (this.productsReceiptDetails.length == 1) {
        this.productsReceiptDetails = [];
      } else {
        this.productsReceiptDetails.splice(index, 1);
      }
    }
    this.clearSelectedItemData();
  }

  selectProductsReceiptDetails: ProductsReceiptDetails =
    new ProductsReceiptDetails();

  openProductCategorySearchDialog(i = -1) {

    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectProductsReceiptDetails?.categoryNameAr ?? '';
    } else {
      searchTxt = this.productCategories[i].categoryNameAr;
    }

    let data = this.productCategories.filter((x) => {
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
        this.selectProductsReceiptDetails!.categoryNameAr =
          data[0].categoryNameAr;
        this.selectProductsReceiptDetails!.productCategoryId = data[0].id;
      } else {
        this.productsReceiptDetails[i].categoryNameAr = data[0].categoryNameAr;
        this.productsReceiptDetails[i].productCategoryId = data[0].id;
      }
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم الانجليزى'];
      let names = ['id', 'categoryNameAr', 'categoryNameEn'];
      let title = 'بحث عن الصنف';

      let sub = this.searchDialog
        .showDialog(lables, names, this.productCategories, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {
              this.selectProductsReceiptDetails!.categoryNameAr =
                d.categoryNameAr;
              this.selectProductsReceiptDetails!.productCategoryId = d.id;
            } else {
              this.productsReceiptDetails[i].categoryNameAr = d.categoryNameAr;
              this.productsReceiptDetails[i].productCategoryId = d.id;
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
      searchTxt = this.selectProductsReceiptDetails?.productNameAr ?? '';
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
        this.selectProductsReceiptDetails!.productNameAr =
          data[0].productNameAr;
        this.selectProductsReceiptDetails!.productId = data[0].id;
      } else {
        this.productsReceiptDetails[i].productNameAr = data[0].productNameAr;
        this.productsReceiptDetails[i].productId = data[0].id;
      }
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم الانجليزى'];
      let names = ['id', 'productNameAr', 'productNameEn'];
      let title = 'بحث عن الصنف';

      let sub = this.searchDialog
        .showDialog(lables, names, this.products, title, searchTxt)
        .subscribe((d) => {

          console.log('d====================>', d);
          if (d) {
            if (i == -1) {
              this.selectProductsReceiptDetails!.productNameAr =
                d.productNameAr;
              this.selectProductsReceiptDetails!.productId = d.id;
            } else {
              this.productsReceiptDetails[i].productNameAr = d.productNameAr;
              this.productsReceiptDetails[i].productId = d.id;
            }
          }
        });
      this.subsList.push(sub);
    }
  }
  openUnitSearchDialog(i = -1) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectProductsReceiptDetails?.unitNameAr ?? '';
    } else {
      searchTxt = this.productsReceiptDetails[i].unitNameAr;
    }

    let data = this.units.filter((x) => {
      return (
        (x.unitNameAr + ' ' + x.unitNameEn).toLowerCase().includes(searchTxt) ||
        (x.unitNameAr + ' ' + x.unitNameEn).toUpperCase().includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectProductsReceiptDetails!.unitNameAr = data[0].unitNameAr;
        this.selectProductsReceiptDetails!.unitId = data[0].id;
      } else {
        this.productsReceiptDetails[i].unitNameAr = data[0].unitNameAr;
        this.productsReceiptDetails[i].unitId = data[0].id;
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
              this.selectProductsReceiptDetails!.unitNameAr = d.unitNameAr;
              this.selectProductsReceiptDetails!.unitId = d.id;
            } else {
              this.productsReceiptDetails[i].unitNameAr = d.unitNameAr;
              this.productsReceiptDetails[i].unitId = d.id;
            }
          }
        });
      this.subsList.push(sub);
    }

  }
  openEquipmentSearchDialog(i = -1) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectProductsReceiptDetails?.equimentNameAr ?? '';
    } else {
      searchTxt = this.productsReceiptDetails[i].equimentNameAr;
    }

    let data = this.equipments.filter((x) => {
      return (
        (x.equipmentNameAr + ' ' + x.equipmentNameEn).toLowerCase().includes(searchTxt) ||
        (x.equipmentNameAr + ' ' + x.equipmentNameEn).toUpperCase().includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectProductsReceiptDetails!.equimentNameAr = data[0].equipmentNameAr;
        this.selectProductsReceiptDetails!.equipmentId = data[0].id;
      } else {
        this.productsReceiptDetails[i].equimentNameAr = data[0].equipmentNameAr;
        this.productsReceiptDetails[i].equipmentId = data[0].id;
      }
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم الانجليزى'];
      let names = ['id', 'equipmentNameAr', 'equipmentNameEn'];
      let title = 'بحث عن المعدة';

      let sub = this.searchDialog
        .showDialog(lables, names, this.equipments, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            console.log("d======-=>", d)

            if (i == -1) {
              this.selectProductsReceiptDetails!.equimentNameAr = d.equipmentNameAr;
              this.selectProductsReceiptDetails!.equipmentId = d.id;
            } else {
              this.productsReceiptDetails[i].equimentNameAr = d.equipmentNameAr;
              this.productsReceiptDetails[i].equipmentId = d.id;
            }
          }
        });
      this.subsList.push(sub);
    }

  }



  clearSelectedItemData() {
    this.selectProductsReceiptDetails = {
      id: 0,
      maintenanceRequestId: 0,
      productReceiptId: 0,
      productCategoryId: 0,
      categoryNameEn: '',
      categoryNameAr: '',
      productId: 0,
      productNameAr: '',
      productNameEn: '',
      quantity: 0,
      price: 0,
      valueBeforeTax: 0,
      valueWithInstallationPriceBeforeTax: 0,
      installationPrice: 0,
      taxRatio: 0,
      taxValue: 0,
      valueAfterTax: 0,
      unitId: 0,
      unitNameAr: '',
      unitNameEn: '',
      equipmentId: 0,
      equimentNameAr: '',
      equipmentNameEn: '',
      billed: false,
      maintenanceBillId: 0,
    };
  }

  //// end editable grid details
}
