import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillExchangeComponent } from './bill-exchange/bill-exchange.component';
import { MaintenanceComponent } from './maintenance.component';
import { MaintenanceServiceComponent } from './maintenance-service/maintenance-service.component';
import { PricingRequestsComponent } from './pricing-requests/pricing-requests.component';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { ReceiptVouchersComponent } from './receipt-vouchers/receipt-vouchers.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { TechniciansComponent } from './technicians/technicians.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { MaintenanceServicesListComponent } from './maintenance-service/maintenance-services-list/maintenance-services-list.component';
import { ProductsCategoriesComponent } from './products-categories/products-categories.component';
import { WarehousesListComponent } from './warehouses/warehouses-list/warehouses-list.component';
import { ProductsCategoriesListComponent } from './products-categories/products-categories-list/products-categories-list.component';
import { TechniciansListComponent } from './technicians/technicians-list/technicians-list.component';
import { ProductsComponent } from './products/products.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { MaintenanceRequestsComponent } from './maintenance-requests/maintenance-requests.component';
import { MaintenanceRequestsListComponent } from './maintenance-requests/maintenance-requests-list/maintenance-requests-list.component';
import { SuppliersListComponent } from './suppliers/suppliers-list/suppliers-list.component';
import { ElectricityMetersComponent } from './electricity-meters/electricity-meters.component';
import { ElectricityMetersListComponent } from './electricity-meters/electricity-meters-list/electricity-meters-list.component';
import { WaterMetersListComponent } from './water-meters/water-meters-list/water-meters-list.component';
import { WaterMetersComponent } from './water-meters/water-meters.component';
import { EquipmentsListComponent } from './equipments/equipments-list/equipments-list.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { MaintenanceRequestDetailsComponent } from './maintenance-requests/maintenance-request-details/maintenance-request-details.component';
import { FormsModule } from '@angular/forms';
import { ProductsReceiptListComponent } from './products-receipt/products-receipt-list/products-receipt-list.component';
import { ProductsReceiptComponent } from './products-receipt/products-receipt.component';
import { PurchaseOrdersListComponent } from './purchase-orders/purchase-orders-list/purchase-orders-list.component';
import { MaintenanceBillsComponent } from './maintenance-bills/maintenance-bills.component';
import { MaintenanceBillsListComponent } from './maintenance-bills/maintenance-bills-list/maintenance-bills-list.component';
import { MaintenanceContractsListComponent } from './maintenance-contracts/maintenance-contracts-list/maintenance-contracts-list.component';
import { MaintenanceContractsComponent } from './maintenance-contracts/maintenance-contracts.component';
import { MaintenanceOffersListComponent } from './maintenance-offers/maintenance-offers-list/maintenance-offers-list.component';
import { MaintenanceOffersComponent } from './maintenance-offers/maintenance-offers.component';
import { PurchaseInvoicesListComponent } from './purchase-invoices/purchase-invoices-list/purchase-invoices-list.component';


const routes: Routes = [{
  path:'',component:MaintenanceComponent,
  children:[
   {path:'bill-exchange',component:BillExchangeComponent},
   {path:'maintenance-bills-list',component:MaintenanceBillsListComponent},
   {path:'add-maintenance-bill',component:MaintenanceBillsComponent},
   {path:'update-maintenance-bill/:id',component:MaintenanceBillsComponent},

   {path:'maintenance-offers-list',component:MaintenanceOffersListComponent},
   {path:'add-maintenance-offer',component:MaintenanceOffersComponent},
   {path:'update-maintenance-offer/:id',component:MaintenanceOffersComponent},

   {path:'maintenance-contracts-list',component:MaintenanceContractsListComponent},
   {path:'add-maintenance-contract',component:MaintenanceContractsComponent},
   {path:'update-maintenance-contract/:id',component:MaintenanceContractsComponent},


   {path:'add-maintenance-request',component:MaintenanceRequestsComponent},
   {path:'update-maintenance-request/:id',component:MaintenanceRequestsComponent},
   {path:'maintenance-requests-list',component:MaintenanceRequestsListComponent},
   {path:'maintenance-request-details/:id',component:MaintenanceRequestDetailsComponent},
   {path:'add-price-request',component:PricingRequestsComponent},
   {path:'update-price-request/:id',component:PricingRequestsComponent},
   {path:'add-products-receipt',component:ProductsReceiptComponent},
   {path:'update-products-receipt/:id',component:ProductsReceiptComponent},
   {path:'products-receipt-list',component:ProductsReceiptListComponent},
   {path:'maintenance-services-list',component:MaintenanceServicesListComponent},
   {path:'add-maintenance-service',component:MaintenanceServiceComponent},
   {path:'update-maintenance-service/:id',component:MaintenanceServiceComponent},
   {path:'maintenance-services-list',component:MaintenanceServicesListComponent},
   {path:'add-product',component:ProductsComponent},
   {path:'update-product/:id',component:ProductsComponent},
   {path:'products-list',component:ProductsListComponent},
   {path:'products-categories-list',component:ProductsCategoriesListComponent},
   {path:'add-product-category',component:ProductsCategoriesComponent},
   {path:'update-product-category/:id',component:ProductsCategoriesComponent},
   {path:'pricing-requests',component:PricingRequestsComponent},
   {path:'purchase-invoices-list',component:PurchaseInvoicesListComponent},
   {path:'add-purchase-invoice',component:PurchaseInvoicesComponent},
   {path:'update-purchase-invoice/:id',component:PurchaseInvoicesComponent},

   {path:'purchase-orders',component:PurchaseOrdersComponent},
   {path:'receipt-vouchers',component:ReceiptVouchersComponent},
   {path:'add-supplier',component:SuppliersComponent},
   {path:'update-supplier/:id',component:SuppliersComponent},
   {path:'suppliers-list',component:SuppliersListComponent},
   {path:'technicians-list',component:TechniciansListComponent},
   {path:'add-technician',component:TechniciansComponent},
   {path:'update-technician/:id',component:TechniciansComponent},
   {path:'maintenance-warehouses-list',component:WarehousesListComponent},
   {path:'add-maintenance-warehouse',component:WarehousesComponent},
   {path:'update-maintenance-warehouse/:id',component:WarehousesComponent},
   {path:'electricity-meters-list',component:ElectricityMetersListComponent},
   {path:'add-electricity-meter',component:ElectricityMetersComponent},
   {path:'update-electricity-meter/:id',component:ElectricityMetersComponent},
   {path:'water-meters-list',component:WaterMetersListComponent},
   {path:'add-water-meter',component:WaterMetersComponent},
   {path:'update-water-meter/:id',component:WaterMetersComponent},
   {path:'equipments-list',component:EquipmentsListComponent},
   {path:'add-equipment',component:EquipmentsComponent},
   {path:'update-equipment/:id',component:EquipmentsComponent},
   {path:'add-purchase-order',component:PurchaseOrdersComponent},
   {path:'update-purchase-order/:id',component:PurchaseOrdersComponent},
   {path:'purchase-orders-list',component:PurchaseOrdersListComponent},


  

  ]
  
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,FormsModule]
})
export class MaintenanceRoutingModule { }
