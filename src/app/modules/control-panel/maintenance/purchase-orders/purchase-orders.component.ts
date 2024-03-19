import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ProductCategory } from 'src/app/core/models/Product-category';
import { Products } from 'src/app/core/models/products';
import { ProductsCategoriesService } from 'src/app/core/services/backend-services/products-categories.service';
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
import { PurchaseOrdersService } from 'src/app/core/services/backend-services/purchase-orders.service';
import { PurchaseOrdersDetailsService } from 'src/app/core/services/backend-services/purchase-orders-details.service';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { PurchaseOrdersDetails } from 'src/app/core/models/purchase-orders-details';
import { OwnersVM } from 'src/app/core/models/ViewModel/owners-vm';
import { PurchaseOrders } from 'src/app/core/models/purchase-orders';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ITabulatorActionsSelected } from 'src/app/core/interfaces/ITabulator-action-selected';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
const PAGEID=29; // from pages table in database seeding table

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss']
})
export class PurchaseOrdersComponent implements OnInit,OnDestroy {

  constructor(
    private dateService: DateCalculation,
    private purchaseOrdersService: PurchaseOrdersService,
    private purchaseOrdersDetailsService: PurchaseOrdersDetailsService,
    private productsCategoriesService: ProductsCategoriesService,
    private ownersService: OwnersService,
    private alertsService: NotificationsAlertsService,
    private productsService: ProductsService,
    private rolesPerimssionsService:RolesPermissionsService,
    private router: Router,
    private AlertsService: NotificationsAlertsService,
    private sharedServices: SharedService,
    private fb: FormBuilder, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private searchDialog: SearchDialogService
  ) {
    this.selectedPurchaseOrdersDetails= new PurchaseOrdersDetails();
  }


  addUrl: string = '/control-panel/maintenance/add-purchase-order';
  updateUrl: string = '/control-panel/maintenance/update-purchase-order/';
  listUrl: string = '/control-panel/maintenance/purchase-orders-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.purchase-orders",
    componentAdd: "purchase-orders.add-purchase-order",
  };
  //region properties
  purchaseOrdersDetails: PurchaseOrdersDetails[] = [];
  purchaseOrderForm!: FormGroup;
  subsList: Subscription[] = [];
  date!: DateModel;
  productCategories: ProductCategory[] = [];
  products: Products[] = [];
  searhProducts: Products[] = [];
  selectProduct: Products[] = [];
  owners: OwnersVM[] = [];

  submited: boolean = false;
  showPurchaseOrder:boolean=false;
  productCategoryId: any;
  productId: any;
  quantity: number=0;
  quantityEditable: number=0;
  errorMessage = '';
  errorClass = '';
  queryParams: any;
  id: any;
  sub: any;
  lang
  Response!: ResponseResult<PurchaseOrders>;

  //endregion
    ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
   this.sharedServices.changeButton({action:'Save'}as ToolbarData)
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId",params["id"]);
          this.getProducts();
          this.sharedServices.changeButton({action:'Update'}as ToolbarData)
          this.getPurchaseOrderById(this.id);
          this.getPurchaseOrderDetailsByPurchaseOrderId(this.id)

        }
      }

    })

    this.getLanguage()
    this.initalizeDates();
    this.cleanPurchaseOrder();
    this.cleanPurchaseOrdersDetails();
    this.listenToClickedButton();
    this.changePath();
    this.spinner.show();
    Promise.all([
      this.getOwners(),
      this.getProductCategories(),
      this.getProducts()

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
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
//#endregion

  initalizeDates() {
    this.date = this.dateService.getCurrentDate();

  }
  cleanPurchaseOrder() {
    this.purchaseOrderForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      date: '',
      ownerId: REQUIRED_VALIDATORS,



    })

  }
  cleanPurchaseOrdersDetails() {

    this.selectedPurchaseOrdersDetails
    this.selectedPurchaseOrdersDetails.id= undefined,
    this.selectedPurchaseOrdersDetails.productCategoryId=0,
    this.selectedPurchaseOrdersDetails.productCategoryNameAr= '',
    this.selectedPurchaseOrdersDetails.productCategoryNameEn= '',
    this.selectedPurchaseOrdersDetails.productId=0,
    this.selectedPurchaseOrdersDetails.productNameAr='',
    this.selectedPurchaseOrdersDetails.productNameEn= '',
    this.selectedPurchaseOrdersDetails.quantity=0,
    this.selectedPurchaseOrdersDetails.purchaseOrderId=0
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
      this.productsCategoriesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.productCategories = res.data.map((res: ProductCategory[]) => {
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

  getProducts() {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsService.getAll("GetAll").subscribe({

        next: (res: any) => {

          this.searhProducts = JSON.parse(JSON.stringify(res.data));
          console.log("this.searhProducts ",this.searhProducts )

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
  getOwners() {
    const promise = new Promise<void>((resolve, reject) => {
      this.ownersService.getAll("GetAllVM").subscribe({
        next: (res: any) => {
          this.owners = res.data.map((res: OwnersVM[]) => {
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

  onChangeProductCatgeory(productCategoryId?) {

    this.products = this.searhProducts.filter(x => x.productCategoryId == this.selectedPurchaseOrdersDetails?.productCategoryId??productCategoryId);

  }

  deleteProduct(item: PurchaseOrdersDetails) {
    if (item != null) {
      let removedItem = this.products.find(x => x.id == item.productId);
      const index: number = this.products.indexOf(removedItem!);
     // const index: number = this.purchaseOrdersDetails.indexOf(item);
      if (index !== -1) {
        this.purchaseOrdersDetails.splice(index, 1);
      //  this.defineGridColumn();

      }


    }
  }


  addProduct() {
    if (this.selectedPurchaseOrdersDetails.productCategoryId == undefined || this.selectedPurchaseOrdersDetails.productCategoryId == null || this.selectedPurchaseOrdersDetails.productCategoryId == 0) {
      this.errorMessage = this.translate.transform('general.product-category-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectedPurchaseOrdersDetails.productId == undefined || this.selectedPurchaseOrdersDetails.productId == null || this.selectedPurchaseOrdersDetails.productId == 0) {
      this.errorMessage = this.translate.transform('general.product-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.selectedPurchaseOrdersDetails.quantity == undefined || this.selectedPurchaseOrdersDetails.quantity == null || this.selectedPurchaseOrdersDetails.quantity == 0) {
      this.errorMessage = this.translate.transform('general.quantity-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    this.purchaseOrdersDetails.push(
      {
        id: undefined,
        productCategoryId:this.selectedPurchaseOrdersDetails?.productCategoryId??0,
        productCategoryNameAr: this.selectedPurchaseOrdersDetails?.productCategoryNameAr??'',
        productCategoryNameEn: this.selectedPurchaseOrdersDetails?.productCategoryNameEn??'',
        productId: this.selectedPurchaseOrdersDetails?.productId??0,
        productNameAr: this.selectedPurchaseOrdersDetails?.productNameAr??'',
        productNameEn: this.selectedPurchaseOrdersDetails?.productNameEn??'',
        quantity: Number(this.selectedPurchaseOrdersDetails?.quantity??0,),
        purchaseOrderId: undefined
      }
    )

    this.cleanPurchaseOrdersDetails();




  }
  getOrderDate(selectedDate: DateModel) {
    this.date = selectedDate;
  }

  onSave() {

    this.submited = true;
    if (this.purchaseOrderForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      if (this.purchaseOrdersDetails.length == 0 || this.purchaseOrdersDetails == null) {
        this.errorMessage = this.translate.transform('general.add-details');
        this.errorClass = this.translate.transform('general.error-message');
        this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
        return
      }
      this.purchaseOrderForm.value.id=0;
      this.purchaseOrderForm.value.date = this.dateService.getDateForInsert2(this.date);

      this.purchaseOrdersService.insert(this.purchaseOrderForm.value).subscribe(
        result => {
          if (result != null) {

            let purchaseOrderId = result.data?.id
            if (this.purchaseOrdersDetails != null) {
              this.purchaseOrdersDetails.forEach(element => {
                element.purchaseOrderId = purchaseOrderId;

              })

              this.purchaseOrdersDetailsService.addAllWithUrl("insert", this.purchaseOrdersDetails).subscribe(
                _result => {
                  this.cleanPurchaseOrder();
                  this.purchaseOrdersDetails = [];

                  this.submited = false;

                  setTimeout(() => {
                    this.navigateUrl(this.listUrl);
                  }, 500);
                  this.showResponseMessage(
                    true,
                    AlertTypes.add,
                    "Add"
                  );
                }

              )
            }
          }
        })
    }
    else {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
      // this.errorMessage = "Please enter valid data";
      // this.errorClass = 'errorMessage';
      //  this.alertsService.showError(this.errorMessage, "خطأ")
      return this.purchaseOrderForm.markAllAsTouched();
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
    if (this.purchaseOrderForm.valid) {
      if (this.purchaseOrdersDetails.length == 0 || this.purchaseOrdersDetails == null) {
        this.errorMessage = this.translate.transform('general.add-details');
        this.errorClass = this.translate.transform('general.error-message');
        this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
        return
      }
      this.purchaseOrderForm.value.id=this.id;
      this.purchaseOrderForm.value.date = this.dateService.getDateForInsert2(this.date);

      this.purchaseOrdersService.update(this.purchaseOrderForm.value).subscribe(
        result => {
          if (result != null) {

            let purchaseOrderId = result.data.id
            if (this.purchaseOrdersDetails != null) {
              this.purchaseOrdersDetails.forEach(element => {
                element.purchaseOrderId = purchaseOrderId;

              })

              this.purchaseOrdersDetailsService.updateAllWithUrl("update", this.purchaseOrdersDetails).subscribe(
                _result => {
                  this.cleanPurchaseOrder();
                  this.purchaseOrdersDetails = [];
                  this.showResponseMessage(true, AlertTypes.update, result.message)
                  this.submited = false;
                  setTimeout(() => {
                    this.navigateUrl(this.listUrl);
                  }, 500);
                }

              )

            }
          }
        })
    }
    else {
      // this.errorMessage = "Please enter valid data";
      // this.errorClass = 'errorMessage';
      //  this.alertsService.showError(this.errorMessage, "خطأ")
      return this.purchaseOrderForm.markAllAsTouched();
    }
  }

  ////////////////////////
  getPurchaseOrderById(id: any) {
    this.showPurchaseOrder=true;
    const promise = new Promise<void>((resolve, reject) => {
      this.purchaseOrdersService.getById(id).subscribe({
        next: (res: any) => {

          if (res.data != null) {

            this.toolbarPathData.componentAdd = "purchase-orders.update-purchase-order";
            this.purchaseOrderForm.setValue(
              {
                id: res.data.id,
                date: this.dateService.getDateForCalender(res.data.date),
                ownerId: res.data.ownerId


              }
            )




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
  getPurchaseOrderDetailsByPurchaseOrderId(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.purchaseOrdersDetailsService.getById(id).subscribe({
        next: (res: any) => {

          if (res.data != null && res.data.length > 0) {
            res.data.forEach(element => {
              this.purchaseOrdersDetails.push(
                {
                  id: element.id,
                  purchaseOrderId: element.purchaseOrderId,
                  productCategoryId: element.productCategoryId,
                  productCategoryNameAr: element.categoryNameAr,
                  productCategoryNameEn: element.categoryNameEn,
                  productId: element.productId,
                  productNameAr: element.productNameAr || '',
                  productNameEn: element.productNameEn || '',
                  quantity: Number(element.quantity)

                }
              )
            });
          }

          this.clearSelectedItemData();
          console.log("this.purchaseOrdersDetails",this.purchaseOrdersDetails)
          console.log("this.selectedPurchaseOrdersDetails",this.selectedPurchaseOrdersDetails)
          //this.defineGridColumn();


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
            this.toolbarPathData.componentAdd = "purchase-orders.add-purchase-order";
            this.router.navigate([this.addUrl]);
            this.cleanPurchaseOrder();
            this.cleanPurchaseOrdersDetails();
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
    return this.purchaseOrderForm.controls;
  }


    editProduct(item)
    {


      // this.purchaseOrdersDetails.find(item)
      // if (this.purchaseOrdersDetails.length > 0) {
      //   if (item ?? null) {
      //     let index = this.purchaseOrdersDetails.indexOf(item);
      //     this.purchaseOrdersDetails[index] = item;

          this.quantityEditable=item.quantity;
        //  this.defineGridColumn();
      //   }
      // }

    }




  menuOptions: SettingMenuShowOptions = {
   showDelete: true
 };




 openAddSelectedProducts() {}
 onMenuActionSelected(event: ITabulatorActionsSelected) {
   if (event != null) {
     if (event.actionName == 'Delete') {
       this.deleteProduct(event.item);
     }
   }
 }
  //#endregion
  deleteItem(index) {
    if (this.purchaseOrdersDetails.length) {
      if (this.purchaseOrdersDetails.length == 1) {
        this.purchaseOrdersDetails = [];
      } else {
        this.purchaseOrdersDetails.splice(index, 1);
      }
    }
    this.cleanPurchaseOrdersDetails();
  }
editItem(item:PurchaseOrdersDetails)
{

  if(item??null)
  {
     let currentItemIndex = this.purchaseOrdersDetails.findIndex(x=>x.productCategoryId==item.productCategoryId);
     if(currentItemIndex!=null)
     {
      this.purchaseOrdersDetails.splice(currentItemIndex,1);
      this.purchaseOrdersDetails.push(item)
     }

  }
}

  selectedPurchaseOrdersDetails: PurchaseOrdersDetails = new PurchaseOrdersDetails();
  openProductCategorySearchDialog(i = -1) {

    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedPurchaseOrdersDetails?.productCategoryNameAr ?? '';
    } else {
      searchTxt = '';
    }

    let data = this.productCategories.filter((x) => {
      return ((x.categoryNameAr + ' ' + x.categoryNameAr).toLowerCase().includes(searchTxt)
       ||(x.categoryNameEn + ' ' + x.categoryNameEn)
          .toUpperCase()
          .includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectedPurchaseOrdersDetails!.productCategoryNameAr =
          data[0].categoryNameAr;
        this.selectedPurchaseOrdersDetails!.productCategoryId = data[0].id;
      } else {
        this.purchaseOrdersDetails[i].productCategoryNameAr = data[0].categoryNameAr;
        this.purchaseOrdersDetails[i].productCategoryId = data[0].id;
      }
      this.onChangeProductCatgeory();
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم اللاتيني'];
      let names = ['id', 'categoryNameAr', 'categoryNameEn'];
      let title = 'بحث عن نوع الصنف';

      let sub =  this.searchDialog
        .showDialog(lables, names, this.productCategories, title, searchTxt)
        .subscribe((d) => {
          if (d) {

            if (i == -1) {

              this.selectedPurchaseOrdersDetails!.productCategoryNameAr = d.categoryNameAr;
              this.selectedPurchaseOrdersDetails!.productCategoryId = d.id;
            } else {
              this.purchaseOrdersDetails[i].productCategoryNameAr = d.categoryNameAr;
              this.purchaseOrdersDetails[i].productCategoryId = d.id;
            }
            this.onChangeProductCatgeory();
          }
        });
      this.subsList.push(sub);
    }
    // this.onVoucherDetailsChange.emit(this.voucherDetails);
  }
  openProductSearchDialog(i = -1) {

    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedPurchaseOrdersDetails?.productNameAr ?? '';
    } else {
      searchTxt = '';
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
        this.selectedPurchaseOrdersDetails!.productNameAr =
          data[0].productNameAr;
        this.selectedPurchaseOrdersDetails!.productId = data[0].id;
      } else {
        this.purchaseOrdersDetails[i].productNameAr = data[0].productNameAr;
        this.purchaseOrdersDetails[i].productId = data[0].id;
        this.onChangeProductCatgeory();
      }
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم اللاتيني'];
      let names = ['id', 'productNameAr', 'productNameEn'];
      let title = 'بحث عن الصنف';

      let sub = this.searchDialog
        .showDialog(lables, names, this.products, title, searchTxt)
        .subscribe((d) => {


          if (d) {
            if (i == -1) {
              this.selectedPurchaseOrdersDetails!.productNameAr = d.productNameAr;
              this.selectedPurchaseOrdersDetails!.productId = d.id;
            } else {
              this.purchaseOrdersDetails[i].productNameAr = d.productNameAr;
              this.purchaseOrdersDetails[i].productId = d.id;
            }


          }
        });
      this.subsList.push(sub);
    }
    // this.onVoucherDetailsChange.emit(this.voucherDetails);
  }

  clearSelectedItemData() {
    this.selectedPurchaseOrdersDetails = {
      id:0,
      purchaseOrderId:0,
      productCategoryId:0,
      productCategoryNameAr:'',
      productCategoryNameEn:'',
      productId:0,
      productNameAr:'',
      productNameEn:'',
      quantity:0,
    };
  }

}

