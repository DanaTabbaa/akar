import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { accountType, AlertTypes, convertEnumToArray, MaintenanceCostOnArEnum, MaintenanceCostOnEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
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
import { PurchaseOrdersDetailsService } from 'src/app/core/services/backend-services/purchase-orders-details.service';
import { PurchaseOrdersDetailsVM } from 'src/app/core/models/ViewModel/purchase-orders-details-vm';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Store } from '@ngrx/store';
import { TenantsSelectors } from 'src/app/core/stores/selectors/tenant.selectors';
import { TenantsVM } from 'src/app/core/models/ViewModel/tenants-vm';
import { TenantModel } from 'src/app/core/stores/store.model.ts/tenants.store.model';
import { MaintenanceBills } from 'src/app/core/models/maintenance-bills';
import { MaintenanceRequests } from 'src/app/core/models/maintenance-requests';
import { UnitsVM } from 'src/app/core/models/ViewModel/units-vm';
import { UnitSelectors } from 'src/app/core/stores/selectors/unit.selectors';
import { UnitsModel } from 'src/app/core/stores/store.model.ts/units.store.model';
import { MaintenanceRequestsSelectors } from 'src/app/core/stores/selectors/maintenancerequests.selectors';
import { MaintenanceRequestsModel } from 'src/app/core/stores/store.model.ts/maintenancerequests.store.model';
import { ProductsReceiptDetails } from 'src/app/core/models/products-receipt-details';
import { AccountsSelectors } from 'src/app/core/stores/selectors/accounts.selectors';
import { MaintenanceBillsService } from 'src/app/core/services/backend-services/maintenance-bills.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { Accounts } from 'src/app/core/models/accounts';
import { AccountsModel } from 'src/app/core/stores/store.model.ts/accounts.store.model';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ProductsReceiptDetailsService } from 'src/app/core/services/backend-services/products-receipt-details.service';
const PAGEID = 32; // from pages table in database seeding table
@Component({
  selector: 'app-maintenance-bills',
  templateUrl: './maintenance-bills.component.html',
  styleUrls: ['./maintenance-bills.component.scss']
})
export class MaintenanceBillsComponent implements OnInit, OnDestroy {

  constructor(
    private dateService: DateCalculation,
    private dateService2: DateConverterService,
    private rolesPerimssionsService: RolesPermissionsService,
    private purchaseOrdersDetailsService: PurchaseOrdersDetailsService,
    private maintenanceBillsService: MaintenanceBillsService,
    private productsReceiptDetailsService: ProductsReceiptDetailsService,
    private router: Router,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private fb: FormBuilder, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private store: Store<any>
  ) { }


  addUrl: string = '/control-panel/maintenance/add-maintenance-bill';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-bill/';
  listUrl: string = '/control-panel/maintenance/maintenance-bills-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.maintenance-bills",
    componentAdd: "maintenance-bills.add-maintenance-bill",
  };
  //region properties
  selectedProducts: ProductsReceiptDetails[] = [];
  maintenanceBillsForm!: FormGroup;
  subsList: Subscription[] = [];
  date!: DateModel;
  tenants: TenantsVM[] = [];
  maintenanceRequests: MaintenanceRequests[] = [];
  units: UnitsVM[] = [];
  products: PurchaseOrdersDetailsVM[] = [];
  ownerServiceAccounts: Accounts[] = [];
  taxAccounts: Accounts[] = [];
  tenantsAccounts: Accounts[] = [];
  maintenanceBills?: MaintenanceBills;
  maintenanceCostOns: ICustomEnum[] = [];
  url: any;
  lang: string = '';
  submited: boolean = false;
  productId: any;
  valueBeforeTax: number = 0;
  price: number = 0;
  taxRatio: number = 0;
  taxValue: number = 0;
  quantity: number = 0;
  valueAfterTax: number = 0;
  totalBeforeTax: number = 0;
  totalTax: number = 0;
  totalAfterTax: number = 0;
  totalBeforeTaxWithInstallationPrice:number=0;

  errorMessage = '';
  errorClass = '';
  currnetUrl;
  tenantId: any;
  unitId: any;
  maintenanceCostOn: any;
  specialDiscount: number = 0;
  id: any = 0;
  sub: any;
  ownerServicesAccountId: any;
  taxAccountId: any;
  tenantAccountId: any;
  Response!: ResponseResult<MaintenanceBills>;

  //endregion
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.sharedServices.changeButton({ action: 'Save' } as ToolbarData);
    this.getPagePermissions(PAGEID)
    this.currnetUrl = this.router.url;
    this.initalizeDates();
    this.cleanMaintenanceBills();
    this.selectedProducts = [];
    this.listenToClickedButton();
    this.changePath();
    this.getLanguage();
    this.getMaintenanceCostOn(),
      this.spinner.show();
    Promise.all([
      this.getTenants(),
      this.getUnits(),
      this.getMaintenanceRequests(),
      this.getAccounts()

    ]).then(a => {
      this.spinner.hide();
      let sub = this.route.params.subscribe((params) => {

        if (params["id"]) {
          this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
          this.getMaintenanceBillsById(params["id"]);
        }
        this.url = this.router.url.split('/')[2];
      });

      this.subsList.push(sub);
    }).catch((err) => {

      this.spinner.hide();
    })

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
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
          this.sharedServices.setUserPermissions(this.userPermissions);
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
  initalizeDates() {
    this.date = this.dateService.getCurrentDate();

  }
  cleanMaintenanceBills() {
    this.maintenanceBillsForm = this.fb.group({
      id: '',
      date: '',
      tenantId: REQUIRED_VALIDATORS,
      unitId: REQUIRED_VALIDATORS,
      maintenanceRequestId: REQUIRED_VALIDATORS,
      maintenanceCostOn: REQUIRED_VALIDATORS,
      notes: '',
      specialDiscount: '',
      ownerServicesAccountId: '',
      taxAccountId: '',
      tenantAccountId: '',



    })
    this.specialDiscount = 0;
    this.totalBeforeTax = 0,
    this.totalBeforeTaxWithInstallationPrice = 0,
    this.totalTax = 0;
    this.totalAfterTax = 0
  }

  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  getTenants() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(TenantsSelectors.selectors.getListSelector).subscribe({
        next: (res: TenantModel) => {

          this.tenants = JSON.parse(JSON.stringify(res.list));

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
  getAccounts() {


    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(AccountsSelectors.selectors.getListSelector).subscribe({
        next: (res: AccountsModel) => {
          ;
          this.ownerServiceAccounts = JSON.parse(JSON.stringify(res.list.filter(x => x.accountType == accountType.Service)))
          this.tenantsAccounts = JSON.parse(JSON.stringify(res.list.filter(x => x.accountType == accountType.Tenant)))
          this.taxAccounts = JSON.parse(JSON.stringify(res.list.filter(x => x.accountType == accountType.Tax)))
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
  getUnits() {


    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(UnitSelectors.selectors.getListSelector).subscribe({
        next: (res: UnitsModel) => {

          this.units = JSON.parse(JSON.stringify(res.list));

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
  getMaintenanceRequests() {


    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(MaintenanceRequestsSelectors.selectors.getListSelector).subscribe({
        next: (res: MaintenanceRequestsModel) => {

          this.maintenanceRequests = JSON.parse(JSON.stringify(res.list))
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

  getProducts(purchaseOrderId: any) {

    const promise = new Promise<void>((resolve, reject) => {
      this.purchaseOrdersDetailsService.getById(purchaseOrderId).subscribe({

        next: (res: any) => {

          this.products = res.data.map((res: PurchaseOrdersDetailsVM[]) => {
            return res
          });

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






  getInvoiceDate(selectedDate: DateModel) {
    this.date = selectedDate;
  }
  setInputData() {
    this.maintenanceBillsForm.value.id = this.id;
    this.maintenanceBillsForm.value.date = this.dateService2.getDateForInsertISO_Format(this.date ?? this.dateService.getCurrentDate());

    //  this.maintenanceBillsForm.value.date = this.dateService.getDateForInsert2(this.date);
    this.maintenanceBillsForm.value.totalBeforeTax = this.totalBeforeTax;
    this.maintenanceBillsForm.value.totalBeforeTaxWithInstallationPrice = this.totalBeforeTaxWithInstallationPrice;

    this.maintenanceBillsForm.value.totalTax = this.totalTax;
    this.maintenanceBillsForm.value.totalAfterTax = this.totalAfterTax;

    // this.maintenanceBillsForm.value.specialDiscount = this.specialDiscount;
    // this.maintenanceBillsForm.value.ownerServicesAccountId = this.ownerServicesAccountId;
    // this.maintenanceBillsForm.value.taxAccountId = this.taxAccountId;
    // this.maintenanceBillsForm.value.tenantAccountId = this.tenantAccountId;

  }
  updateproductsReceipt() {
    ;
    return new Promise<void>((resolve, reject) => {
      let sub = this.productsReceiptDetailsService.updateWithUrl("Update", this.selectedProducts).subscribe({
        next: (res) => {
          if (res != null) {


          }
          this.spinner.hide();

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
  saveData() {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {

      let sub = this.maintenanceBillsService.addWithResponse("Add?checkAll=false", this.maintenanceBillsForm.value).subscribe({
        next: (res) => {
          if (res != null) {

            //let maintenanceBillId = res.data.i
          }
          this.spinner.hide();
          if (res.success) {
            this.showResponseMessage(res.success, AlertTypes.success,
               this.translate.transform("messages.add-success")
               );
            this.navigateUrl(this.listUrl);
            this.updateproductsReceipt();
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

  onSave() {

    this.submited = true;
    if (this.maintenanceBillsForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.setInputData();
      return this.saveData()

    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.maintenanceBillsForm.markAllAsTouched();
    }
  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform('messages.done'));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform('messages.alert'));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform('messages.info'));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform('messages.error'));
    }
  }

  getMaintenanceCostOn() {
    if (this.lang == 'en') {
      this.maintenanceCostOns = convertEnumToArray(MaintenanceCostOnEnum);
    }
    else {
      this.maintenanceCostOns = convertEnumToArray(MaintenanceCostOnArEnum);

    }

  }


  onUpdate() {
    this.submited = true;
    if (this.maintenanceBillsForm.value != null) {

      this.setInputData()
      return this.updateData();
    }
    else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.maintenanceBillsForm.markAllAsTouched();
    }
  }
  updateData() {
    this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceBillsService.updateWithResponse('Update?idColName=Id&checkAll=false', this.maintenanceBillsForm.value).subscribe({
        next: (result: any) => {
          if (result.success) {
            this.updateproductsReceipt();

          }
          this.spinner.hide();
          this.showResponseMessage(result.success, AlertTypes.success, this.translate.transform("messages.update-success"));
          resolve();
          this.navigateUrl(this.listUrl);



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

  ////////////////////////


  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({ listPath: this.listUrl } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "maintenance-bills.add-maintenance-bill";
            this.router.navigate([this.addUrl]);
            this.cleanMaintenanceBills();
            this.selectedProducts = [];
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
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
  get pr(): { [key: string]: AbstractControl } {
    return this.maintenanceBillsForm.controls;
  }
  getMaintenanceRequestDetails(maintenanceRequestId: any) {
    this.tenantId = this.maintenanceRequests.find(x => x.id == maintenanceRequestId)?.tenantId
    this.unitId = this.maintenanceRequests.find(x => x.id == maintenanceRequestId)?.unitId
  }

  getProductsReceiptDetails(maintenanceRequestId: any) {
    if (maintenanceRequestId != null && maintenanceRequestId > 0) {
      // return new Promise<void>((resolve, reject) => {
      //   let sub = this.store.select(ProductsReceiptDetailsSelectors.selectors.getListSelector).subscribe({
      //     next: (res: ProductsReceiptDetailsModel) => {
      //
      //       if (res != null) {

      //         this.selectedProducts = JSON.parse(JSON.stringify(res.list.filter(x => x.maintenanceRequestId == maintenanceRequestId)))

      //       }
      //       else {
      //         this.selectedProducts = [];
      //       }
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

      return new Promise<void>((resolve, reject) => {
        this.productsReceiptDetailsService.getAll("GetAll").subscribe({
          next: (res: any) => {
            ;
            res.data.map((res: ProductsReceiptDetails[]) => {
              return res
            });


            this.selectedProducts= res.data.filter(x => x.maintenanceRequestId == maintenanceRequestId);
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
    }
    else {
      this.selectedProducts = [];
      return;
    }
  }
  onChange(item: ProductsReceiptDetails, event) {

    if (item != null && event.target.checked != null) {
      let checked = event.target.checked
      if (checked) {
        try {

          let selectedIndex = this.selectedProducts.findIndex(x => x.productId == item.productId);
          item.billed = event.target.checked
          this.selectedProducts[selectedIndex] = item

          //add values to total on checked
          this.totalBeforeTax = Number(item.valueBeforeTax);
          this.totalBeforeTaxWithInstallationPrice = Number(item.valueWithInstallationPriceBeforeTax);

          this.totalTax = Number(item.taxValue);
          this.totalAfterTax = Number(item.valueAfterTax);
        }
        catch (error) {
        }
      }
      else if (!checked) {
        let selectedIndex = this.selectedProducts.findIndex(x => x.productId == item.productId);
        item.billed = event.target.checked
        this.selectedProducts[selectedIndex] = item
        //subtruct values from totals on unchecked
        this.totalBeforeTax = this.totalBeforeTax - Number(item.valueBeforeTax);
        this.totalBeforeTaxWithInstallationPrice = this.totalBeforeTaxWithInstallationPrice - Number(item.valueWithInstallationPriceBeforeTax);

        this.totalTax = this.totalTax - Number(item.taxValue);
        this.totalAfterTax = this.totalAfterTax - Number(item.valueAfterTax);
      }



    }
  }
  getMaintenanceBillsById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.maintenanceBillsService.getWithResponse<MaintenanceBills>("GetByFieldName?fieldName=Id&fieldValue=" + id).subscribe({
        next: (res) => {
          if (res.success) {
            ;
            this.maintenanceBills = JSON.parse(JSON.stringify(res.data));
            if (this.maintenanceBills ?? null) {
              this.getProductsReceiptDetails(this.maintenanceBills?.maintenanceRequestId)
            }



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
    })

  }
  setFormValue() {
    this.cleanMaintenanceBills()
    this.maintenanceBillsForm.patchValue({
      id: this.maintenanceBills?.id,
      date: this.dateService.getDateForCalender(this.maintenanceBills?.date),
      tenantId: this.maintenanceBills?.tenantId,
      unitId: this.maintenanceBills?.unitId,
      maintenanceRequestId: this.maintenanceBills?.maintenanceRequestId,
      maintenanceCostOn: this.maintenanceBills?.maintenanceCostOn,
      notes: this.maintenanceBills?.notes,
      specialDiscount: this.maintenanceBills?.specialDiscount,
      ownerServicesAccountId: this.maintenanceBills?.ownerServicesAccountId,
      taxAccountId: this.maintenanceBills?.taxAccountId,
      tenantAccountId: this.maintenanceBills?.tenantAccountId,
      totalBeforeTax: this.maintenanceBills?.totalBeforeTax,
      totalBeforeTaxWithInstallationPrice: this.maintenanceBills?.totalBeforeTaxWithInstallationPrice,

      totalTax: this.maintenanceBills?.totalTax,
      totalAfterTax: this.maintenanceBills?.totalAfterTax,


    });
    this.specialDiscount =Number(this.maintenanceBills?.specialDiscount);
    this.totalBeforeTax = Number(this.maintenanceBills?.totalBeforeTax);
    this.totalBeforeTaxWithInstallationPrice = Number(this.maintenanceBills?.totalBeforeTaxWithInstallationPrice);
    this.totalTax = Number(this.maintenanceBills?.totalTax);
    this.totalAfterTax = Number(this.maintenanceBills?.totalAfterTax);


  }

}
