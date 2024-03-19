import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ToolbarData } from "src/app/core/interfaces/toolbar-data";
import { ToolbarPath } from "src/app/core/interfaces/toolbar-path";
import { PriceRequestsDetails } from "src/app/core/models/price-requests-details";
import { ProductsReceiptDetails } from "src/app/core/models/products-receipt-details";
import { MaintenanceRequestsService } from "src/app/core/services/backend-services/maintenance-requests.service";
import { PriceRequestsService } from "src/app/core/services/backend-services/price-requests.service";
import { ProductsReceiptDetailsService } from "src/app/core/services/backend-services/products-receipt-details.service";
import { ProductsReceiptService } from "src/app/core/services/backend-services/products-receipt.service";
import { SharedService } from "src/app/shared/services/shared.service";


@Component({
  selector: 'app-maintenance-request-details',
  templateUrl: './maintenance-request-details.component.html',
  styleUrls: ['./maintenance-request-details.component.scss']
})
export class MaintenanceRequestDetailsComponent implements OnInit,OnDestroy{

 // maintenanceRequestDetailsForm!: FormGroup;
  subsList: Subscription[] = [];
  selectedProductsPriced: PriceRequestsDetails[] = [];
  selectedProductsPieces: ProductsReceiptDetails[] = [];
  sub: any;
  id:any;
  requestStatus:any;
  requestType:any;
  tenantName:any;
  unitName:any;
  maintenanceServiceName:any;
  technicianName:any;
  commentTxt:any;
  requirmentReport:any;
  accomplishmentReport:any;
  ratingValueByTenant:any;
  ratingTxtByTenant:any;
  ratingValueByTechnician:any;
  ratingTxtByTechnician:any;
  ratingValueByResponsibleForMaintenance:any;
  ratingTxtByResponsibleForMaintenance:any;
  totalWithInstallationPriceBeforeTaxPriced:any;
  totalTaxPriced:any;
  totalAfterTaxPriced:any;
  totalWithInstallationPriceBeforeTaxPieces:any;
  totalTaxPieces:any;
  totalAfterTaxPieces:any;
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: '',
    addPath: '',
    componentList: "maintenance-requests.maintenance-request-details",
    componentAdd: '',
  };
  constructor(
    private maintenanceRequestsService: MaintenanceRequestsService,
    private priceRequestsService: PriceRequestsService,
    private productsReceiptService: ProductsReceiptService,
    private productsReceiptDetailsService: ProductsReceiptDetailsService,
    private route: ActivatedRoute,
    private sharedServices: SharedService


     ) {
  }

  ngOnInit(): void {
    this.getLanguage();
    this.sharedServices.changeButton({ action: 'Index' } as ToolbarData);
    // this.listenToClickedButton();
     this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getMaintenanceRequestById(this.id);
          this.getPriceRequestByMaintenanceRequestId(this.id);
          this.getProductsReceiptDetailsByMaintenanceRequestId(this.id);
          this.getProductsReceiptByMaintenanceRequestId(this.id);
        }
      } else {

      }

    })
  }
  lang!:string;
 //#endregion
 getLanguage() {
  this.sharedServices.getLanguage().subscribe((res) => {
    this.lang = res;
  });
}
  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  //#endregion

  getMaintenanceRequestById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {

      this.maintenanceRequestsService.getById(id).subscribe({
        next: (res: any) => {

          //(("result data getbyid", res.data);

           this.id=res.data.id;
           this.requestStatus=this.lang=='ar'?res.data.requestStatusAr:res.data.requestStatusEn;
           this.requestType=this.lang=='ar'?res.data.requestTypeAr:res.data.requestTypeEn;
           this.tenantName=this.lang=='ar'?res.data.tenantNameAr:res.data.tenantNameEn;
           this.technicianName=this.lang=='ar'?res.data.technicianNameAr:res.data.technicianNameEn;
           this.unitName=this.lang=='ar'?res.data.unitNameAr:res.data.unitNameEn;
           this.commentTxt=res.data.commentTxt;
           this.requirmentReport=res.data.requirmentReport;
           this.accomplishmentReport=res.data.accomplishmentReport;
           this.maintenanceServiceName=this.lang=='ar'?res.data.serviceNameAr:res.data.serviceNameEn;
           this.ratingValueByTenant=res.data.ratingValueByTenant;
           this.ratingTxtByTenant=res.data.ratingTxtByTenant;
           this.ratingValueByTechnician=res.data.ratingValueByTechnician;
           this.ratingTxtByTechnician=res.data.ratingTxtByTechnician;
           this.ratingValueByResponsibleForMaintenance=res.data.ratingValueByResponsibleForMaintenance;
           this.ratingTxtByResponsibleForMaintenance=res.data.ratingTxtByResponsibleForMaintenance;



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
  getPriceRequestByMaintenanceRequestId(requestId: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.priceRequestsService.getById(requestId).subscribe({
        next: (res: any) => {


          if (res.data.length > 0) {


            this.totalWithInstallationPriceBeforeTaxPriced = res.data[0].totalWithInstallationPriceBeforeTax;
            this.totalTaxPriced = res.data[0].totalTax;
            this.totalAfterTaxPriced = res.data[0].totalAfterTax;

            res.data.forEach(element => {
              this.selectedProductsPriced.push(
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
  getProductsReceiptDetailsByMaintenanceRequestId(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsReceiptDetailsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          res.data=res.data.filter(x=>x.maintenanceRequestId==id)
          if (res.data != null && res.data.length > 0) {
            res.data.forEach(element => {
              this.selectedProductsPieces.push(
                {
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
                  maintenanceRequestId: element.maintenanceRequestId,
                  billed: false,
                  maintenanceBillId: undefined
                }
              )
            });
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
  getProductsReceiptByMaintenanceRequestId(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.productsReceiptService.getAll("GetAll").subscribe({
        next: (res: any) => {

          res.data=res.data.filter(x=>x.maintenanceRequestId==id)
          if (res.data !=null) {

            this.totalWithInstallationPriceBeforeTaxPieces = res.data[0].totalWithInstallationPriceBeforeTax;
            this.totalTaxPieces = res.data[0].totalTax;
            this.totalAfterTaxPieces = res.data[0].totalAfterTax;

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

}

