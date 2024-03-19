import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { PricingRequestsComponent } from './pricing-requests/pricing-requests.component';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { TechniciansComponent } from './technicians/technicians.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { BillExchangeComponent } from './bill-exchange/bill-exchange.component';
import { ReceiptVouchersComponent } from './receipt-vouchers/receipt-vouchers.component';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { MaintenanceServiceComponent } from './maintenance-service/maintenance-service.component';
import { MaintenanceServicesListComponent } from './maintenance-service/maintenance-services-list/maintenance-services-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductsCategoriesComponent } from './products-categories/products-categories.component';
import { TabulatorModule } from 'src/app/shared/components/tabulator/tabulator.module';
import { FullDateModule } from 'src/app/shared/components/date/full-date/full-date.module';
import { GregorianDateModule } from 'src/app/shared/components/date/gregorian-date/gregorian-date.module';
import { HijriDateModule } from 'src/app/shared/components/date/hijri-date/hijri-date.module';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { WarehousesListComponent } from './warehouses/warehouses-list/warehouses-list.component';
import { SharedModule } from 'primeng/api';
import { ProductsCategoriesListComponent } from './products-categories/products-categories-list/products-categories-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { TechniciansListComponent } from './technicians/technicians-list/technicians-list.component';
import { ProductsComponent } from './products/products.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { MaintenanceRequestsComponent } from './maintenance-requests/maintenance-requests.component';
import { MaintenanceRequestsListComponent } from './maintenance-requests/maintenance-requests-list/maintenance-requests-list.component';
import { SuppliersListComponent } from './suppliers/suppliers-list/suppliers-list.component';
import { ElectricityMetersComponent } from './electricity-meters/electricity-meters.component';
import { ElectricityMetersListComponent } from './electricity-meters/electricity-meters-list/electricity-meters-list.component';
import { WaterMetersComponent } from './water-meters/water-meters.component';
import { WaterMetersListComponent } from './water-meters/water-meters-list/water-meters-list.component';
import { EquipmentsListComponent } from './equipments/equipments-list/equipments-list.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { MaintenanceRequestDetailsComponent } from './maintenance-requests/maintenance-request-details/maintenance-request-details.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { ProductsReceiptComponent } from './products-receipt/products-receipt.component';
import { ProductsReceiptListComponent } from './products-receipt/products-receipt-list/products-receipt-list.component';
import { PurchaseOrdersListComponent } from './purchase-orders/purchase-orders-list/purchase-orders-list.component';
import { MaintenanceBillsComponent } from './maintenance-bills/maintenance-bills.component';
import { MaintenanceBillsListComponent } from './maintenance-bills/maintenance-bills-list/maintenance-bills-list.component';
import { MaintenanceContractsComponent } from './maintenance-contracts/maintenance-contracts.component';
import { MaintenanceContractsListComponent } from './maintenance-contracts/maintenance-contracts-list/maintenance-contracts-list.component';
import { MaintenanceOffersComponent } from './maintenance-offers/maintenance-offers.component';
import { MaintenanceOffersListComponent } from './maintenance-offers/maintenance-offers-list/maintenance-offers-list.component';
import { PurchaseInvoicesListComponent } from './purchase-invoices/purchase-invoices-list/purchase-invoices-list.component';
import { SearchFormModule } from 'src/app/shared/components/search-form/search-form.module';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';



@NgModule({
  declarations: [
    MaintenanceComponent,
    MaintenanceRequestsComponent,
    MaintenanceRequestsListComponent,
    MaintenanceRequestDetailsComponent,
    ProductsReceiptComponent,
    ProductsReceiptListComponent,
    MaintenanceServiceComponent,
    WarehousesComponent,
    WarehousesListComponent,
    ProductsCategoriesComponent,
    PurchaseOrdersComponent,
    PricingRequestsComponent,
    PurchaseInvoicesComponent,
    PurchaseInvoicesListComponent,
    TechniciansComponent,
    TechniciansListComponent,
    SuppliersComponent,
    SuppliersListComponent,
    BillExchangeComponent,
    ReceiptVouchersComponent,
    MaintenanceBillsComponent,
    MaintenanceBillsListComponent,
    MaintenanceContractsListComponent,

    MaintenanceContractsComponent,
    MaintenanceServicesListComponent,
    ProductsCategoriesListComponent,
    ProductsComponent,
    ProductsListComponent,
    ElectricityMetersComponent,
    ElectricityMetersListComponent,
    WaterMetersComponent,
    WaterMetersListComponent,
    EquipmentsListComponent,
    EquipmentsComponent,
    PurchaseOrdersComponent,
    PurchaseOrdersListComponent,
    MaintenanceOffersComponent,
    MaintenanceOffersListComponent

  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TabulatorModule,
    FullDateModule,
    GregorianDateModule,
    HijriDateModule,
    SharedModule,
    NgxSpinnerModule,
    NgbModule,
    SearchFormModule,
    TranslateModule
  ], providers: [DateCalculation,DatePipe, /*ManagerService,*/TranslatePipe,DateConverterService,SearchDialogService ]

})
export class MaintenanceModule {


  lang: string = '';
  constructor(
    private translateService: TranslateService,
    private sharedServices: SharedService,
   // private managerService:ManagerService
  ) {
    this.lang = localStorage.getItem('language')!;
    this.listenToLanguageChange();
    // managerService.load();
  }
  currentBtn!: string;
  subsList: Subscription[] = [];
  listenToLanguageChange() {
    let sub = this.sharedServices.getLanguage().subscribe({
      next: (currentLanguage: string) => {
        currentLanguage;
        if (!stringIsNullOrEmpty(currentLanguage)) {
          this.translateService.use(currentLanguage).subscribe({
            next: (result: any) => {
              //(('translateService', result);
            },
          });
        } else {
          this.translateService.use(this.lang).subscribe({
            next: (result: any) => {
              //(('translateService', result);
            },
          });
        }
      },
    });
    this.subsList.push(sub);
  }
 }
