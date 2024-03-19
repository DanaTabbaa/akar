import { Component, OnDestroy, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { pursposeTypeEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { Equipments } from 'src/app/core/models/equipments';
import { ProductCategory } from 'src/app/core/models/Product-category';
import { Products } from 'src/app/core/models/products';
import { Unit } from 'src/app/core/models/units';
import { EquipmentsVM } from 'src/app/core/models/ViewModel/equipments-vm';
import { EquipmentsService } from 'src/app/core/services/backend-services/equipments.service';
import { PriceRequestsDetailsService } from 'src/app/core/services/backend-services/price-requests-details.service';
import { PriceRequestsService } from 'src/app/core/services/backend-services/price-requests.service';
import { ProductsCategoriesService } from 'src/app/core/services/backend-services/products-categories.service';
import { ProductsService } from 'src/app/core/services/backend-services/products.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { UnitVM } from 'src/app/core/view-models/unit-vm';
import { NgxSpinnerService } from 'ngx-spinner';
import { PriceRequestsDetails } from 'src/app/core/models/price-requests-details';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { TranslatePipe } from '@ngx-translate/core';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-pricing-requests',
  templateUrl: './pricing-requests.component.html',
  styleUrls: ['./pricing-requests.component.scss']
})
export class PricingRequestsComponent implements OnInit, OnDestroy {

  constructor(
    private dateService: DateCalculation,
    private priceRequestsService: PriceRequestsService,
    private priceRequestsDetailsService: PriceRequestsDetailsService,
    private productsCategoriesService: ProductsCategoriesService,
    private productsService: ProductsService,
    private unitsService: UnitsService,
    private equipmentsService: EquipmentsService,
    private router: Router,
    private AlertsService: NotificationsAlertsService,
    private SharedServices: SharedService,
    private fb: FormBuilder, private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe



  ) { }


  addUrl: string = '/control-panel/maintenance/add-price-request';
  updateUrl: string = '/control-panel/maintenance/update-price-request/';
  listUrl: string = '/control-panel/maintenance/price-requests-list';
  toolbarPathData: ToolbarPath = {

    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.price-requests",
    componentAdd:"component-names.add-price-request" ,
  };
  //region properties
  selectedProducts: PriceRequestsDetails[] = [];
  priceRequestForm!: FormGroup;
  //priceRequestsDetailsForm!: FormGroup;
  subsList: Subscription[] = [];
  date!: DateModel;
  productCategories: ProductCategory[] = [];
  products: Products[] = [];
  searhProducts: Products[] = [];
  selectProduct: Products[] = [];
  lang
  units: UnitVM[] = [];
  equipments: Equipments[] = [];
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
  sub: any;
  priceRequestId:any;
  id: any;
  //endregion
  ngOnInit(): void {

    this.getLanguage();
    // this.sub = this.route.params.subscribe(params => {

    //
    //   if (params['id'] != null) {
    //     this.id = +params['id'];
    //     if (this.id > 0) {
    //
    //       this.getPriceRequestByMaintenanceRequestId(this.id);

    //     }
    //   }

    // })
    this.queryParams = this.route.queryParams.subscribe(params => {

      if (params['maintenanceRequestId'] != null) {
        this.maintenanceRequestId = params['maintenanceRequestId'];
        this.getPriceRequestByMaintenanceRequestId(this.maintenanceRequestId);
        this.SharedServices.changeButton({action:'New'}as ToolbarData)


      }else{
        this.SharedServices.changeButton({action:'New'}as ToolbarData)
      }

    })


    this.initalizeDates();
    this.cleanPriceRequest();
    this.cleanPriceRequestsDetails();
    this.listenToClickedButton();
    this.changePath();
    this.spinner.show();
    Promise.all([
      this.getProductCategories(),
      this.getProducts(),
      this.getUnits(),
      this.getEquipments()
    ]).then(a => {
      this.spinner.hide();
    })

  }
  initalizeDates() {
    this.date = this.dateService.getCurrentDate();

  }
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  cleanPriceRequest() {
    this.priceRequestForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      date: '',
      notes: '',
      maintenanceRequestId: [{ value: this.maintenanceRequestId, disabled: true }],
      //  totalWithInstallationPriceBeforeTax:'',
      //  totalTax:'',
      //  totalAfterTax:''
    })
    this.totalWithInstallationPriceBeforeTax = 0,
    this.totalTax = 0;
    this.totalAfterTax = 0
  }
  cleanPriceRequestsDetails() {
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

          this.searhProducts = res.data.map((res: Products[]) => {
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
  onChangeProductCatgeory() {

    this.products = this.searhProducts.filter(x => x.productCategoryId == this.productCategoryId);


  }

  getUnits() {
    const promise = new Promise<void>((resolve, reject) => {
      this.unitsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.units = res.data.filter(x => x.purposeType == pursposeTypeEnum['For Rent'] || x.purposeType==pursposeTypeEnum['For Sell and Rent']).map((res: Unit[]) => {
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

  getEquipments() {
    const promise = new Promise<void>((resolve, reject) => {
      this.equipmentsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.equipments = res.data.map((res: EquipmentsVM[]) => {
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

  deleteProduct(item: PriceRequestsDetails) {

    if (item != null) {

      const index: number = this.selectedProducts.indexOf(item);
      if (index !== -1) {

        this.selectedProducts.splice(index, 1);
        this.totalWithInstallationPriceBeforeTax = this.totalWithInstallationPriceBeforeTax - item.valueWithInstallationPriceBeforeTax
        this.totalTax = this.totalTax - item.taxValue;
        this.totalAfterTax = this.totalAfterTax - item.valueAfterTax;
      }


    }
  }

  addProduct() {
    // if (this.ContractUnitsForm.valid) {



    var productCategory: any = ''
    this.productCategories.forEach(element => {
      if (element.id == this.productCategoryId) {
        productCategory = element;
      }

    })

    var product: any = ''
    this.searhProducts.forEach(element => {
      if (element.id == this.productId) {
        product = element;
      }

    })

    var unit: any = ''
    this.units.forEach(element => {
      if (element.id == this.unitId) {
        unit = element;
      }

    })

    var equipment: any = ''
    this.equipments.forEach(element => {
      if (element.id == this.equipmentId) {
        equipment = element;
      }

    })

    this.selectedProducts.push(
      {
        id: undefined,
        priceRequestId: undefined,
        productCategoryId: this.productCategoryId,
        productCategoryNameAr: productCategory.categoryNameAr,
        productCategoryNameEn: productCategory.categoryNameEn,
        productId: this.productId,
        productNameAr: product.productNameAr || '',
        productNameEn: product.productNameEn || '',
        quantity: Number(this.quantity),
        price: Number(this.price),
        valueBeforeTax: Number(this.valueBeforeTax),
        installationPrice: Number(this.installationPrice),
        valueWithInstallationPriceBeforeTax: Number(this.valueWithInstallationPriceBeforeTax),
        taxRatio: Number(this.taxRatio),
        taxValue: Number(this.taxValue),
        valueAfterTax: Number(this.valueAfterTax),
        unitId: this.unitId,
        unitNameAr: unit.unitNameAr || '',
        unitNameEn: unit.unitNameEn || '',
        equipmentId: this.equipmentId,
        equimentNameAr: equipment.equipmentNameAr || '',
        equipmentNameEn: equipment.equipmentNameEn || '',
      }
    )

    this.totalWithInstallationPriceBeforeTax += Number(this.valueWithInstallationPriceBeforeTax);
    this.totalTax += Number(this.taxValue);
    this.totalAfterTax += Number(this.valueAfterTax);

    this.cleanPriceRequestsDetails();





  }
  getRequestDate(selectedDate: DateModel) {
    this.date = selectedDate;
  }
  // get prd(): { [key: string]: AbstractControl } {
  //   return this.priceRequestsDetailsForm.controls;
  // }
  onChangeProduct() {

    this.price = this.searhProducts.find(x => x.id == this.productId)?.sellPrice;
    this.taxRatio = this.searhProducts.find(x => x.id == this.productId)?.taxRatio;

  }
  onChangeQuantityOrPrice() {
    this.valueBeforeTax = Number(this.quantity) * Number(this.price)
    this.valueAfterTax = Number(this.valueBeforeTax)

  }
  onChangeInstallationPrice() {

    if (this.installationPrice > 0) {
      this.valueWithInstallationPriceBeforeTax = Number(this.valueBeforeTax) + Number(this.installationPrice);

    }
    else {
      this.valueWithInstallationPriceBeforeTax = Number(this.valueBeforeTax);

    }
    if (this.taxRatio > 0) {
      this.taxValue = Number(this.valueWithInstallationPriceBeforeTax) * Number(this.taxRatio / 100)
      this.valueAfterTax = Number(this.valueWithInstallationPriceBeforeTax) + Number(this.taxValue)

    }
    else {
      this.valueAfterTax = this.valueWithInstallationPriceBeforeTax
    }
  }
  onChangeTaxRatio() {
    this.taxValue = Number(this.valueWithInstallationPriceBeforeTax) * Number(this.taxRatio / 100)
    if (this.taxValue > 0) {
      this.valueAfterTax = Number(this.valueWithInstallationPriceBeforeTax) + Number(this.taxValue)
    }
    else {
      this.valueAfterTax = Number(this.valueWithInstallationPriceBeforeTax)
    }
  }

  onSave() {

    if (this.selectedProducts.length == 0 || this.selectProduct == null) {
      this.SharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.errorMessage = this.translate.transform('general.add-details');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    //this.priceRequestForm.value.id=0;
    this.priceRequestForm.value.date = this.dateService.getDateForInsert2(this.date);
    this.priceRequestForm.value.maintenanceRequestId = this.maintenanceRequestId;
    this.priceRequestForm.value.totalWithInstallationPriceBeforeTax = this.totalWithInstallationPriceBeforeTax;
    this.priceRequestForm.value.totalTax = this.totalTax;
    this.priceRequestForm.value.totalAfterTax = this.totalAfterTax;

    this.priceRequestsService.insert(this.priceRequestForm.value).subscribe(
      result => {
        if (result != null) {

          let priceRequestId = result.data?.id
          if (this.selectedProducts.length > 0) {
             this.selectedProducts.forEach(element => {
               element.priceRequestId=priceRequestId;

             })

            this.priceRequestsDetailsService.addAllWithUrl("insert", this.selectedProducts).subscribe(
              _result => {
              }

            )

            // this.selectedProducts.forEach(element => {
            //
            //   element.priceRequestId = priceRequestId
            //   this.priceRequestsDetailsService.addData("insert", element).subscribe(
            //     _result => {
            //     }

            //   )

            // });
            this.cleanPriceRequest();
            this.selectedProducts = [];
            this.getPriceRequestByMaintenanceRequestId(this.maintenanceRequestId);

          }
        }
      })

  }

  onUpdate() {

    if (this.selectedProducts.length == 0 || this.selectProduct == null) {
      this.errorMessage = this.translate.transform('general.add-details');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    this.priceRequestForm.value.date = this.dateService.getDateForInsert2(this.date);
    this.priceRequestForm.value.maintenanceRequestId = this.maintenanceRequestId;
    this.priceRequestForm.value.totalWithInstallationPriceBeforeTax = this.totalWithInstallationPriceBeforeTax;
    this.priceRequestForm.value.totalTax = this.totalTax;
    this.priceRequestForm.value.totalAfterTax = this.totalAfterTax;
    this.priceRequestForm.value.id = this.id;


    this.priceRequestsService.update(this.priceRequestForm.value).subscribe(
      result => {
        if (result != null) {

          let priceRequestId = result.data.id
          if (this.selectedProducts.length > 0) {
            this.selectedProducts.forEach(element => {
              element.priceRequestId=priceRequestId;

            })

            this.priceRequestsDetailsService.updateAllWithUrl("update", this.selectedProducts).subscribe(
              _result => {
                this.cleanPriceRequest();
                this.selectedProducts = [];
              }

            )


            this.getPriceRequestByMaintenanceRequestId(this.maintenanceRequestId);
          }
        }
      })

  }

  ////////////////////////
  getPriceRequestByMaintenanceRequestId(requestId: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.priceRequestsService.getById(requestId).subscribe({
        next: (res: any) => {


          if (res.data.length > 0) {

           // this.priceRequestId=res.data[0].id;
           this.toolbarPathData.componentAdd = "price-requests.update-price-request";

            this.priceRequestForm.setValue(
              {
                id: res.data[0].id,
                date: this.dateService.getDateForCalender(res.data[0].Date),
                notes: res.data[0].notes,
                maintenanceRequestId: res.data[0].maintenanceRequestId

              }
            )
            this.totalWithInstallationPriceBeforeTax = res.data[0].totalWithInstallationPriceBeforeTax;
            this.totalTax = res.data[0].totalTax;
            this.totalAfterTax = res.data[0].totalAfterTax;

            res.data.forEach(element => {
              this.selectedProducts.push(
                {
                  id: element.id,
                  priceRequestId: element.priceRequestId,
                  productCategoryId: element.productCategoryId,
                  productCategoryNameAr: element.categoryNameAr,
                  productCategoryNameEn: element.categoryNameEn,
                  productId: element.productId,
                  productNameAr: element.productNameAr || '',
                  productNameEn: element.productNameEn || '',
                  quantity: Number(element.quantity),
                  price: Number(element.price),
                  valueBeforeTax: Number(element.valueBeforeTax),
                  installationPrice: Number(element.installationPrice),
                  valueWithInstallationPriceBeforeTax: Number(element.valueWithInstallationPriceBeforeTax),
                  taxRatio: Number(element.taxRatio),
                  taxValue: Number(element.taxValue),
                  valueAfterTax: Number(element.valueAfterTax),
                  unitId: element.unitId,
                  unitNameAr: element.unitNameAr || '',
                  unitNameEn: element.unitNameEn || '',
                  equipmentId: element.equipmentId,
                  equimentNameAr: element.equipmentNameAr || '',
                  equipmentNameEn: element.equipmentNameEn || '',
                }
              )
            });


          }
          else
          {
            this.toolbarPathData.componentAdd = "component-names.add-price-request";

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
    let sub = this.SharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.SharedServices.changeToolbarPath({ listPath: this.listUrl } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-price-request";
            this.router.navigate([this.addUrl]);
            this.cleanPriceRequest();
            this.cleanPriceRequestsDetails();
            this.SharedServices.changeToolbarPath(this.toolbarPathData);
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
}
