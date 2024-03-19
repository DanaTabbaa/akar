import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ProductsService } from 'src/app/core/services/backend-services/products.service';
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
import { MaintenanceOffersService } from 'src/app/core/services/backend-services/maintenance-offers.service';
import { MaintenanceOffersDetailsService } from 'src/app/core/services/backend-services/maintenance-offers-details.service';
import { MaintenanceOffersDetails } from 'src/app/core/models/maintenance-offers-details';
import { MaintenanceOffers } from 'src/app/core/models/maintenance-offers';
import { Suppliers } from 'src/app/core/models/suppliers';
import { SuppliersService } from 'src/app/core/services/backend-services/suppliers.service';
import { PurchaseOrdersService } from 'src/app/core/services/backend-services/purchase-orders.service';
import { PurchaseOrders } from 'src/app/core/models/purchase-orders';
import { PurchaseOrdersDetailsService } from 'src/app/core/services/backend-services/purchase-orders-details.service';
import { PurchaseOrdersDetailsVM } from 'src/app/core/models/ViewModel/purchase-orders-details-vm';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';

const PAGEID = 30; // from pages table in database seeding table
@Component({
  selector: 'app-maintenance-offers',
  templateUrl: './maintenance-offers.component.html',
  styleUrls: ['./maintenance-offers.component.scss'],
})
export class MaintenanceOffersComponent implements OnInit, OnDestroy {
  //region constructor
  constructor(
    private dateService: DateCalculation,
    private maintenanceOffersService: MaintenanceOffersService,
    private maintenanceOffersDetailsService: MaintenanceOffersDetailsService,
    private productsService: ProductsService,
    private purchaseOrdersDetailsService: PurchaseOrdersDetailsService,
    private suppliersService: SuppliersService,
    private rolesPerimssionsService: RolesPermissionsService,
    private purchaseOrdersService: PurchaseOrdersService,
    private router: Router,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private searchDialog: SearchDialogService,
    private SystemSettingsService: SystemSettingsService

  ) {
    this.selectMaintenanceOffersDetails = new MaintenanceOffersDetails();
  }

  //endregion

  addUrl: string = '/control-panel/maintenance/add-maintenance-offer';
  updateUrl: string = '/control-panel/maintenance/update-maintenance-offer/';
  listUrl: string = '/control-panel/maintenance/maintenance-offers-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'menu.maintenance-offers',
    componentAdd: 'maintenance-offers.add-maintenance-offer',
  };
  //region properties
  selectMaintenanceOffersDetails: MaintenanceOffersDetails = new MaintenanceOffersDetails();
  maintenanceOffersDetails: MaintenanceOffersDetails[] = [];
  maintenanceOfferForm!: FormGroup;
  subsList: Subscription[] = [];
  date!: DateModel;
  products: PurchaseOrdersDetailsVM[] = [];
  suppliers: Suppliers[] = [];
  purchaseOrders: PurchaseOrders[] = [];
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
  errorMessage = '';
  errorClass = '';
  queryParams: any;
  id: any;
  sub: any;
  productReceiptId: any;
  Response!: ResponseResult<MaintenanceOffers>;
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number;
  //endregion
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getLanguage()
    this.sharedServices.changeButton({ action: 'Save' } as ToolbarData);
    this.getPagePermissions(PAGEID);
    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId",params["id"]);
          this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
          this.getMaintenanceOfferById(this.id);
          this.getMaintenanceOffersDetailsByOfferId(this.id);
        }
      }
    });

    this.initalizeDates();
    this.cleanMaintenanceOffer();
    this.cleanMaintenanceOfferDetails();
    this.listenToClickedButton();
    this.changePath();
    this.spinner.show();
    Promise.all([this.getSystemSettings(), this.getSuppliers(), this.getPurchaseOrders()]).then((a) => {
      this.spinner.hide();
    });
  }
  lang
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
  initalizeDates() {
    this.date = this.dateService.getCurrentDate();
  }
  cleanMaintenanceOffer() {
    this.maintenanceOfferForm = this.fb.group({
      id: '',
      date: '',
      supplierId: REQUIRED_VALIDATORS,
      purchaseOrderId: REQUIRED_VALIDATORS,
      offerDuration: REQUIRED_VALIDATORS,
      notes: '',
    });
    (this.totalBeforeTax = 0), (this.totalTax = 0);
    this.totalAfterTax = 0;
  }
  cleanMaintenanceOfferDetails() {
    this.selectMaintenanceOffersDetails = {
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
      maintenanceOfferId: 0,
      billed: false,
      maintenancePurchaseBillId: 0,
    };


  }
  ngOnDestroy() {
    //this.cleanMaintenanceOfferDetails();
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
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
          resolve();        },
        complete: () => {
          resolve();
        },
      });
    });
    return promise;
  }
  getProducts(purchaseOrderId: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.purchaseOrdersDetailsService.getById(purchaseOrderId).subscribe({
        next: (res: any) => {
          this.products = JSON.parse(JSON.stringify(res.data));
          console.log('this.products', this.products);

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

  getSuppliers() {
    const promise = new Promise<void>((resolve, reject) => {
      this.suppliersService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.suppliers = res.data.map((res: Suppliers[]) => {
            return res;
          });
          resolve();
        },
        error: (err: any) => {
          resolve();        },
        complete: () => {
          resolve();
        },
      });
    });
    return promise;
  }
  getPurchaseOrders() {
    const promise = new Promise<void>((resolve, reject) => {
      this.purchaseOrdersService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.purchaseOrders = res.data.map((res: PurchaseOrders[]) => {
            return res;
          });
          resolve();
        },
        error: (err: any) => {
          resolve();
        },
        complete: () => {
          resolve();


        },
      });
    });
    return promise;
  }

  deleteProduct(item: MaintenanceOffersDetails) {

    if (item != null) {
      let removedItem = this.products.find(
        (x) => x.productId == item.productId
      );
      const index: number = this.products.indexOf(removedItem!);
      //const index: number = this.maintenanceOffersDetails.indexOf(item);
      if (index !== -1) {
        this.maintenanceOffersDetails.splice(index, 1);
        this.totalBeforeTax = this.totalBeforeTax - item?.valueBeforeTax ?? 0;
        this.totalTax = this.totalTax - item?.taxValue ?? 0;
        this.totalAfterTax = this.totalAfterTax - item?.valueAfterTax ?? 0;
        this.cleanMaintenanceOfferDetails();
      }
    }
  }

  addProduct() {

   if(this.selectMaintenanceOffersDetails.productNameAr!=''){
    this.maintenanceOffersDetails.push({
      id: 0,
      maintenanceOfferId: 0,
      productId: this.selectMaintenanceOffersDetails.productId,
      productNameAr: this.selectMaintenanceOffersDetails.productNameAr || '',
      productNameEn: this.selectMaintenanceOffersDetails.productNameEn || '',
      quantity: Number(this.selectMaintenanceOffersDetails.quantity),
      price: Number(this.selectMaintenanceOffersDetails.price),
      valueBeforeTax: Number(
        this.selectMaintenanceOffersDetails.valueBeforeTax
      ),
      taxRatio: Number(this.selectMaintenanceOffersDetails.taxRatio),
      taxValue: Number(this.selectMaintenanceOffersDetails.taxValue),
      valueAfterTax: Number(this.selectMaintenanceOffersDetails.valueAfterTax),
      maintenancePurchaseBillId: 0,
      billed: false,
    });

    this.totalBeforeTax +=
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(
        this.selectMaintenanceOffersDetails.valueBeforeTax
      )).toFixed(this.numberOfFraction)
        : Number(
          this.selectMaintenanceOffersDetails.valueBeforeTax
        ));


    this.totalTax +=
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenanceOffersDetails.taxValue)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenanceOffersDetails.taxValue))

    this.totalAfterTax +=
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(
        this.selectMaintenanceOffersDetails.valueAfterTax
      )).toFixed(this.numberOfFraction)
        : Number(
          this.selectMaintenanceOffersDetails.valueAfterTax
        ));
    }else{

      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    }

    this.cleanMaintenanceOfferDetails();
  }
  getOfferDate(selectedDate: DateModel) {
    this.date = selectedDate;
  }

  onChangeProduct() {

    this.selectMaintenanceOffersDetails.quantity = this.products.find(
      (x) => x.productId == this.selectMaintenanceOffersDetails.productId
    )?.quantity;
    this.selectMaintenanceOffersDetails.price = this.products.find(
      (x) => x.productId == this.selectMaintenanceOffersDetails.productId
    )?.sellPrice;
    if (
      this.selectMaintenanceOffersDetails.quantity > 0 &&
      this.selectMaintenanceOffersDetails.price > 0
    ) {
      this.onChangeQuantityOrPrice();
    }
  }
  onChangeQuantityOrPrice() {

    this.selectMaintenanceOffersDetails.valueBeforeTax =

      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenanceOffersDetails.quantity) *
        Number(this.selectMaintenanceOffersDetails.price)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenanceOffersDetails.quantity) *
        Number(this.selectMaintenanceOffersDetails.price));

    this.selectMaintenanceOffersDetails.valueAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(
        this.selectMaintenanceOffersDetails.valueBeforeTax
      )).toFixed(this.numberOfFraction)
        : Number(
          this.selectMaintenanceOffersDetails.valueBeforeTax
        ))


  }

  onChangeTaxRatio() {
    this.selectMaintenanceOffersDetails.taxValue =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenanceOffersDetails.valueBeforeTax) *
        Number(this.selectMaintenanceOffersDetails.taxRatio / 100)).toFixed(this.numberOfFraction)
        : Number(this.selectMaintenanceOffersDetails.valueBeforeTax) *
        Number(this.selectMaintenanceOffersDetails.taxRatio / 100));

     ;
    if (this.selectMaintenanceOffersDetails.taxValue > 0) {
      this.selectMaintenanceOffersDetails.valueAfterTax =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(this.selectMaintenanceOffersDetails.valueBeforeTax) +
          Number(this.selectMaintenanceOffersDetails.taxValue)).toFixed(this.numberOfFraction)
          : Number(this.selectMaintenanceOffersDetails.valueBeforeTax) +
          Number(this.selectMaintenanceOffersDetails.taxValue));

    } else {
      this.selectMaintenanceOffersDetails.valueAfterTax =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number(
          this.selectMaintenanceOffersDetails.valueBeforeTax
        )).toFixed(this.numberOfFraction)
          : Number(
            this.selectMaintenanceOffersDetails.valueBeforeTax
          ));

    }
  }

  onSave() {
    this.submited = true;
    if (this.maintenanceOfferForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      if (
        this.maintenanceOffersDetails.length == 0 ||
        this.maintenanceOffersDetails == null
      ) {
        this.errorMessage = this.translate.transform('general.add-details');
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(
          this.errorMessage,
          this.translate.transform('general.error')
        );
        return;
      }
      this.maintenanceOfferForm.value.id = 0;
      this.maintenanceOfferForm.value.date = this.dateService.getDateForInsert2(
        this.date
      );
      this.maintenanceOfferForm.value.totalBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalBeforeTax).toFixed(this.numberOfFraction)
            : this.totalBeforeTax)
      this.maintenanceOfferForm.value.totalTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalTax).toFixed(this.numberOfFraction)
      : this.totalTax)
      this.maintenanceOfferForm.value.totalAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalAfterTax).toFixed(this.numberOfFraction)
      : this.totalAfterTax)


      this.maintenanceOffersService
        .insert(this.maintenanceOfferForm.value)
        .subscribe((result) => {
          if (result != null) {
            let maintenanceOfferId = result.data?.id;
            if (this.maintenanceOffersDetails != null) {
              this.maintenanceOffersDetails.forEach((element) => {
                element.maintenanceOfferId = maintenanceOfferId;
              });

              this.maintenanceOffersDetailsService
                .addAllWithUrl('insert', this.maintenanceOffersDetails)
                .subscribe((_result) => {
                  if (result != null) {
                    this.cleanMaintenanceOffer();
                    this.maintenanceOffersDetails = [];

                    setTimeout(() => {
                      this.navigateUrl(this.listUrl);
                    }, 500);

                    this.showResponseMessage(true, AlertTypes.success, this.translate.transform("messages.add-success"));
                  }
                });
            }
          }
        });
    } else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.maintenanceOfferForm.markAllAsTouched();
    }
  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

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
  onUpdate() {
    this.submited = true;
    if (this.maintenanceOfferForm.valid) {
      if (
        this.maintenanceOffersDetails.length == 0 ||
        this.maintenanceOffersDetails == null
      ) {
        this.errorMessage = this.translate.transform('general.add-details');
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(
          this.errorMessage,
          this.translate.transform('general.error')
        );
        return;
      }
      this.maintenanceOfferForm.value.date = this.dateService.getDateForInsert2(
        this.date
      );



      this.maintenanceOfferForm.value.totalBeforeTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalBeforeTax).toFixed(this.numberOfFraction)
            : this.totalBeforeTax)
      this.maintenanceOfferForm.value.totalTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalTax).toFixed(this.numberOfFraction)
      : this.totalTax)
      this.maintenanceOfferForm.value.totalAfterTax =
      Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalAfterTax).toFixed(this.numberOfFraction)
      : this.totalAfterTax)
      this.maintenanceOfferForm.value.id = this.id;

      this.maintenanceOffersService
        .update(this.maintenanceOfferForm.value)
        .subscribe((result) => {
          if (result != null) {
            let maintenanceOfferId = result.data.id;
            if (this.maintenanceOffersDetails != null) {
              this.maintenanceOffersDetails.forEach((element) => {
                element.maintenanceOfferId = maintenanceOfferId;
              });

              this.maintenanceOffersDetailsService
                .updateAllWithUrl('update', this.maintenanceOffersDetails)
                .subscribe((_result) => {
                  this.cleanMaintenanceOffer();
                  this.maintenanceOffersDetails = [];
                  this.showResponseMessage(
                    true,
                    AlertTypes.update,
                    this.translate.transform("messages.update-success")
                  );
                  this.submited = false;
                  setTimeout(() => {
                    this.navigateUrl(this.listUrl);
                  }, 500);
                });
            }
          }
        });
    } else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.maintenanceOfferForm.markAllAsTouched();
    }
  }

  ////////////////////////
  getMaintenanceOfferById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceOffersService.getById(id).subscribe({
        next: (res: any) => {
          if (res.data != null) {
            // this.priceRequestId=res.data[0].id;
            this.toolbarPathData.componentAdd =
              'maintenance-offers.update-maintenance-offer';

            this.maintenanceOfferForm = this.fb.group({
              id: res.data.id,
              date: this.dateService.getDateForCalender(res.data.date),
              supplierId: res.data.supplierId,
              purchaseOrderId: res.data.purchaseOrderId,
              offerDuration: res.data.offerDuration,
              notes: res.data.notes,
            });
            this.getProducts(res.data.purchaseOrderId);
            this.totalBeforeTax = res.data.totalBeforeTax;
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
  getMaintenanceOffersDetailsByOfferId(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceOffersDetailsService.getById(id).subscribe({
        next: (res: any) => {
          if (res.data != null && res.data.length > 0) {
            res.data.forEach((element) => {
              this.maintenanceOffersDetails.push({
                id: element.id,
                maintenanceOfferId: element.maintenanceOfferId,
                productId: element.productId,
                productNameAr: element.productNameAr || '',
                productNameEn: element.productNameEn || '',
                quantity: Number(element.quantity),
                price: Number(element.price),
                valueBeforeTax: Number(element.valueBeforeTax),
                taxRatio: Number(element.taxRatio),
                taxValue: Number(element.taxValue),
                valueAfterTax: Number(element.valueAfterTax),
                maintenancePurchaseBillId: element.maintenancePurchaseBillId,
                billed: element.billed == 1 ? true : false,
              });
            });
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
              'maintenance-offers.add-maintenance-offer';
            this.router.navigate([this.addUrl]);
            this.cleanMaintenanceOffer();
            this.cleanMaintenanceOfferDetails();
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
  get pr(): { [key: string]: AbstractControl } {
    return this.maintenanceOfferForm.controls;
  }

  ////start editable grid


  openProductSearchDialog(i = -1) {

    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectMaintenanceOffersDetails?.productNameAr ?? '';
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
        this.selectMaintenanceOffersDetails!.productNameAr =
          data[0].productNameAr;
        this.selectMaintenanceOffersDetails!.productId = data[0].productId;
      } else {
        this.maintenanceOffersDetails[i].productNameAr = data[0].productNameAr;
        this.maintenanceOffersDetails[i].productId = data[0].productId;
      }
      this.onChangeProduct();
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم اللاتيني'];
      let names = ['productId', 'productNameAr', 'productNameEn'];
      let title = 'بحث عن الصنف';

      let sub = this.searchDialog
        .showDialog(lables, names, this.products, title, searchTxt)
        .subscribe((d) => {


          if (d) {
            if (i == -1) {
              console.log('d=====>', d);
              this.selectMaintenanceOffersDetails!.productNameAr =
                d.productNameAr;
              this.selectMaintenanceOffersDetails!.productId = d.productId;
            } else {
              this.maintenanceOffersDetails[i].productNameAr = d.productNameAr;
              this.maintenanceOffersDetails[i].productId = d.productId;
            }
            this.onChangeProduct();
          }
        });
      this.subsList.push(sub);
    }
  }

  deleteItem(index) {

    if (this.maintenanceOffersDetails.length) {
      let maintenanceOffersObj = this.maintenanceOffersDetails[index];
      if (this.maintenanceOffersDetails.length == 1) {
        this.maintenanceOffersDetails = [];
      } else {
        this.maintenanceOffersDetails.splice(index, 1);
      }
      if (index !== -1) {

        this.totalBeforeTax = this.totalBeforeTax - maintenanceOffersObj?.valueBeforeTax ?? 0;
        this.totalTax = this.totalTax - maintenanceOffersObj?.taxValue ?? 0;
        this.totalAfterTax = this.totalAfterTax - maintenanceOffersObj?.valueAfterTax ?? 0;
        this.cleanMaintenanceOfferDetails();
      }
    }
    this.cleanMaintenanceOfferDetails();
  }

  ////end editable grid
}
