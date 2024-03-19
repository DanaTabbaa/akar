import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { accountType, AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
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
import { Suppliers } from 'src/app/core/models/suppliers';
import { SuppliersService } from 'src/app/core/services/backend-services/suppliers.service';
import { PurchaseOrdersService } from 'src/app/core/services/backend-services/purchase-orders.service';
import { PurchaseOrders } from 'src/app/core/models/purchase-orders';
import { PurchaseOrdersDetailsService } from 'src/app/core/services/backend-services/purchase-orders-details.service';
import { PurchaseOrdersDetailsVM } from 'src/app/core/models/ViewModel/purchase-orders-details-vm';
import { MaintenanceWarehousesService } from 'src/app/core/services/backend-services/maintenance-warehouses.service';
import { MaintenanceWarehouses } from 'src/app/core/models/maintenance-warehouses';
import { MaintenancePurchaseBills } from 'src/app/core/models/maintenance-purchase-bills';
import { MaintenancePurchaseBillsService } from 'src/app/core/services/backend-services/maintenance-purchase-bills.service';
import { MaintenanceOffersDetailsService } from 'src/app/core/services/backend-services/maintenance-offers-details.service';
import { MaintenanceOffersDetailsVM } from 'src/app/core/models/ViewModel/maintenance-offers-details-vm';
import { AccountsSelectors } from 'src/app/core/stores/selectors/accounts.selectors';
import { Store } from '@ngrx/store';
import { Accounts } from 'src/app/core/models/accounts';
import { AccountsModel } from 'src/app/core/stores/store.model.ts/accounts.store.model';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const PAGEID=31; // from pages table in database seeding table

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.scss']
})
export class PurchaseInvoicesComponent implements OnInit, OnDestroy {

  constructor(
    private dateService: DateCalculation,
    private maintenanceOffersService: MaintenanceOffersService,
    private maintenanceOffersDetailsService: MaintenanceOffersDetailsService,
    private rolesPerimssionsService:RolesPermissionsService,
    private purchaseOrdersService: PurchaseOrdersService,
    private purchaseOrdersDetailsService: PurchaseOrdersDetailsService,
    private suppliersService: SuppliersService,
    private warehouseService: MaintenanceWarehousesService,
    private maintenancePurchaseBillsService: MaintenancePurchaseBillsService,
    private router: Router,
    private alertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private fb: FormBuilder, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private store: Store<any>


  ) { }


  addUrl: string = '/control-panel/maintenance/add-purchase-invoice';
  updateUrl: string = '/control-panel/maintenance/update-purchase-invoice/';
  listUrl: string = '/control-panel/maintenance/purchase-invoices-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.purchase-invoices",
    componentAdd: "purchase-invoices.add-purchase-invoice",
  };
  //region properties
  selectedProducts: MaintenanceOffersDetailsVM[] = [];
  purchaseInvoiceForm!: FormGroup;
  subsList: Subscription[] = [];
  date!: DateModel;
  products: PurchaseOrdersDetailsVM[] = [];
  suppliers: Suppliers[] = [];
  purchaseOrders: PurchaseOrders[] = [];
  warehouses: MaintenanceWarehouses[] = [];
  taxAccounts:Accounts[]=[];
  supplierAccounts:Accounts[]=[];
  purchaseAccounts:Accounts[]=[];


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
  maintenanceOfferId: any;
  id: any;
  sub: any;
  lang
  Response!: ResponseResult<MaintenancePurchaseBills>;

  //endregion
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID);
    this.sharedServices.changeButton({action:'Save'}as ToolbarData);
    this.sub = this.route.params.subscribe(params => {


      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId",params["id"]);
          this.sharedServices.changeButton({action:'Update'}as ToolbarData);
          this.getPurchaseInvoiceById(this.id)
        //  this.getMaintenanceOfferDetails(this.purchaseInvoiceForm.value.purchaseOrderId)

        }
      }

    })

    this.initalizeDates();
    this.getLanguage();
    this.cleanPurchaseInvoice();
    this.selectedProducts = [];
    this.listenToClickedButton();
    this.changePath();
    this.spinner.show();
    Promise.all([
      this.getPurchaseOrders(),
      this.getWarehouses(),
      this.getSuppliers(),
      this.getAccounts()

    ]).then(a => {
      this.spinner.hide();
    })

  }

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
  initalizeDates() {
    this.date = this.dateService.getCurrentDate();

  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  cleanPurchaseInvoice() {
    this.purchaseInvoiceForm = this.fb.group({
      id: '',
      date: '',
      purchaseOrderId: REQUIRED_VALIDATORS,
      maintenanceOfferId: '',
      warehouseId: '',
      supplierId: '',
      supplierBillNo: '',
      handling: '',
      notes: '',
      purchaseAccountId:'',
      valueAddedTaxAccountId:'',
      supplierAccountId:''


    })
    this.totalBeforeTax = 0,
    this.totalTax = 0;
    this.totalAfterTax = 0
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
  getSuppliers() {
    const promise = new Promise<void>((resolve, reject) => {
      this.suppliersService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.suppliers = res.data.map((res: Suppliers[]) => {
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
  getPurchaseOrders() {
    const promise = new Promise<void>((resolve, reject) => {
      this.purchaseOrdersService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.purchaseOrders = res.data.map((res: PurchaseOrders[]) => {
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
  getWarehouses() {
    const promise = new Promise<void>((resolve, reject) => {
      this.warehouseService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.warehouses = res.data.map((res: MaintenanceWarehouses[]) => {
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
  getAccounts() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(AccountsSelectors.selectors.getListSelector).subscribe({
        next: (res: AccountsModel) => {

          this.purchaseAccounts = JSON.parse(JSON.stringify(res.list.filter(x=>x.accountType==accountType.Purchases)))
          this.supplierAccounts = JSON.parse(JSON.stringify(res.list.filter(x=>x.accountType==accountType.Supplier)))
          this.taxAccounts = JSON.parse(JSON.stringify(res.list.filter(x=>x.accountType==accountType.Tax)))

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




  getInvoiceDate(selectedDate: DateModel) {
    this.date = selectedDate;
  }


  onSave() {

    this.submited = true;
    if (this.purchaseInvoiceForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      // if (this.selectedProducts.length == 0 || this.selectedProducts == null) {
      //   this.errorMessage = this.translate.transform('general.add-details');
      //   this.errorClass = this.translate.transform('general.error-message');
      //   this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      //   return
      // }
      this.purchaseInvoiceForm.value.id = 0;
      this.purchaseInvoiceForm.value.date = this.dateService.getDateForInsert2(this.date);
      this.purchaseInvoiceForm.value.totalBeforeTax = this.totalBeforeTax;
      this.purchaseInvoiceForm.value.totalTax = this.totalTax;
      this.purchaseInvoiceForm.value.totalAfterTax = this.totalAfterTax;
      this.purchaseInvoiceForm.value.maintenanceOfferId=this.maintenanceOfferId;

      this.maintenancePurchaseBillsService.insert(this.purchaseInvoiceForm.value).subscribe(
        result => {
          if (result != null) {

             let purchaseBillId=result.data.id;

            // this.selectedProducts.filter(x=>x.billed==true)
             this.selectedProducts.forEach(element =>
              {
                element.maintenancePurchaseBillId=element.billed==true? purchaseBillId:null
              }
             )

             this.maintenanceOffersDetailsService.updateAllWithUrl("updateForMaintenancePurchaseBill", this.selectedProducts).subscribe(
              _result => {

                this.cleanPurchaseInvoice;
                this.selectedProducts = [];
                this.showResponseMessage(true, AlertTypes.add,
                  this.translate.transform("messages.add-success")
                  )
                this.submited = false;
                setTimeout(() => {
                  this.navigateUrl(this.listUrl);
                }, 500);

              }

            )



          }
        })
    }
    else {
      // this.errorMessage = "Please enter valid data";
      // this.errorClass = 'errorMessage';
      //  this.alertsService.showError(this.errorMessage, "خطأ")
      return this.purchaseInvoiceForm.markAllAsTouched();
    }

  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  showResponseMessage(responseStatus, alertType, message) {

    if (responseStatus == true && AlertTypes.add == alertType) {

      this.alertsService.showSuccess(
        this.translate.transform('general.added-successfully'),
        this.translate.transform('messageTitle.done')
      );
    }
    else if (responseStatus == true && AlertTypes.update == alertType) {

      this.alertsService.showSuccess(
        this.translate.transform('general.updated-successfully'),
        this.translate.transform('messageTitle.done')
      );
    }

    else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, 'Alert');
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, 'info');
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, 'error');
    }
  }
  onUpdate() {

    this.submited = true;
    if (this.purchaseInvoiceForm.valid) {
      // if (this.selectedProducts.length == 0 || this.selectedProducts == null) {
      //   this.errorMessage = this.translate.transform('general.add-details');
      //   this.errorClass = this.translate.transform('general.error-message');
      //   this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      //   return
      // }
      this.purchaseInvoiceForm.value.maintenanceOfferId=this.maintenanceOfferId;
      this.purchaseInvoiceForm.value.date = this.dateService.getDateForInsert2(this.date);
      this.purchaseInvoiceForm.value.totalBeforeTax = this.totalBeforeTax;
      this.purchaseInvoiceForm.value.totalTax = this.totalTax;
      this.purchaseInvoiceForm.value.totalAfterTax = this.totalAfterTax;
      this.purchaseInvoiceForm.value.id = this.id;

      this.maintenancePurchaseBillsService.update(this.purchaseInvoiceForm.value).subscribe(
        result => {

          let purchaseBillId=result.data.id;

         // this.selectedProducts.filter(x=>x.billed==true)
          this.selectedProducts.forEach(element =>
           {
             element.maintenancePurchaseBillId=element.billed==true?purchaseBillId:null
           }
          )

          this.maintenanceOffersDetailsService.updateAllWithUrl("updateForMaintenancePurchaseBill", this.selectedProducts).subscribe(
            _result => {

              this.cleanPurchaseInvoice;
              this.selectedProducts = [];
              this.showResponseMessage(true, AlertTypes.success,
              this.translate.transform("messages.update-success")  )
              this.submited = false;
              setTimeout(() => {
                this.navigateUrl(this.listUrl);
              }, 500);

            }

          )

        })
    }
    else {
      // this.errorMessage = "Please enter valid data";
      // this.errorClass = 'errorMessage';
      //  this.alertsService.showError(this.errorMessage, "خطأ")
      return this.purchaseInvoiceForm.markAllAsTouched();
    }
  }

  ////////////////////////
  getPurchaseInvoiceById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenancePurchaseBillsService.getById(id).subscribe({
        next: (res: any) => {
          if (res.data != null) {
            this.toolbarPathData.componentAdd = "purchase-invoices.update-purchase-invoice";
            this.purchaseInvoiceForm.patchValue({
              id: res.data.id,
              date: this.dateService.getDateForCalender(res.data.date),
              purchaseOrderId: res.data.purchaseOrderId,
              maintenanceOfferId: res.data.maintenanceOfferId,
              warehouseId: res.data.warehouseId,
              supplierId: res.data.supplierId,
              supplierBillNo: res.data.supplierBillNo,
              handling: res.data.handling,
              notes: res.data.notes,
              purchaseAccountId:res.data.purchaseAccountId,
              valueAddedTaxAccountId:res.data.valueAddedTaxAccountId,
              supplierAccountId:res.data.supplierAccountId


            })
            this.maintenanceOfferId=res.data.maintenanceOfferId;
            this.totalBeforeTax = res.data.totalBeforeTax;
            this.totalTax = res.data.totalTax;
            this.totalAfterTax = res.data.totalAfterTax;

            this.getMaintenanceOfferDetails(res.data.maintenanceOfferId)



          }

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      })

    })
    return promise;

  }

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
            this.toolbarPathData.componentAdd = "purchase-invoices.add-purchase-invoice";
            this.router.navigate([this.addUrl]);
            this.cleanPurchaseInvoice();
            this.selectedProducts = [];
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.navigateUrl(this.addUrl);
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
    return this.purchaseInvoiceForm.controls;
  }
  getMaintenanceOffer(purchaseOrderId: any) {
    const promise = new Promise<void>((resolve, reject) => {
      if (purchaseOrderId != null && purchaseOrderId > 0) {
        this.maintenanceOffersService.getAll("GetAll").subscribe({
          next: (res: any) => {
            res.data=res.data.filter(x => x.purchaseOrderId == purchaseOrderId)
            if (res.data != null && res.data.length > 0) {
              this.maintenanceOfferId = res.data[0].id
              ;
              this.getMaintenanceOfferDetails(this.maintenanceOfferId);
            }

            resolve();

          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      }
      else {
        this.maintenanceOfferId = "";
      }

    });
    return promise;
  }
  getMaintenanceOfferDetails(maintenanceOfferId: any) {
    const promise = new Promise<void>((resolve, reject) => {
      if (maintenanceOfferId != null && maintenanceOfferId > 0) {

        this.maintenanceOffersDetailsService.getAll("GetAll").subscribe({
          next: (res: any) => {
            res.data=res.data.filter(x => x.maintenanceOfferId == maintenanceOfferId)
            if (res.data != null && res.data.length > 0) {

              if(this.id>0)
              {
                this.selectedProducts = res.data

              }
              else
              {
                this.selectedProducts = res.data.filter(x=>x.billed!=true)

              }
            }

            resolve();

          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      }
      else {
        this.selectedProducts = [];
        this.totalBeforeTax=0;
        this.totalTax=0;
        this.totalAfterTax=0;
      }

    });
    return promise;
  }
  onChange(item: MaintenanceOffersDetailsVM, event) {

    if (item != null && event.target.checked != null) {
      let checked=event.target.checked
      if(checked)
      {
        try{
          this.selectedProducts.forEach(element => {
            if(element.id==item.id)
            {

              element.billed=true;
              //this.selectedProducts.forEach(item => {

               // if (item.billed) {

                  this.totalBeforeTax+=Number(element.valueBeforeTax);
                  this.totalTax+=Number(element.taxValue);
                  this.totalAfterTax+=Number(element.valueAfterTax);
                //}

              //})
            }

          })
        }
        catch(error)
        {

        }
      }
      else if(!checked)
      {

       // this.selectedProducts=this.selectedProducts.filter(x=>x.billed=true)
        this.selectedProducts.forEach(element => {
          if(element.id==item.id)
          {

            element.billed=false;
            //this.selectedProducts.forEach(item => {

                this.totalBeforeTax=this.totalBeforeTax-Number(element.valueBeforeTax);
                this.totalTax=this.totalTax-Number(element.taxValue);
                this.totalAfterTax=this.totalAfterTax-Number(element.valueAfterTax);
           // })
          }
        })
      }
    }
  }

}
