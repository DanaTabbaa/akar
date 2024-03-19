import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlPanelComponent } from './control-panel.component';


const routes: Routes = [
  {path:'', component:ControlPanelComponent,children:[
  
 
  {path:'accounting',loadChildren:()=>import('src/app/modules/control-panel/accounting-and-finance/accounting-and-finance.module').then(m=>m.AccountingAndFinanceModule)},
  {path:'auctions',loadChildren:()=>import('src/app/modules/control-panel/auction/auction.module').then(m=>m.AuctionModule)},
  {path:'maintenance',loadChildren:()=>import('src/app/modules/control-panel/maintenance/maintenance.module').then(m=>m.MaintenanceModule)},
  {path:'reports',loadChildren:()=>import('src/app/modules/control-panel/reports/reports.module').then(m=>m.ReportsModule)},
  {path:'settings',loadChildren:()=>import('src/app/modules/control-panel/settings/settings.module').then(m=>m.SettingsModule)},
  {path:'definitions',loadChildren:()=>import('src/app/modules/control-panel/unit-and-customer/unit-and-customer.module').then(m=>m.UnitAndCustomerModule)},
  {path:'admin-panel',loadChildren:()=>import('src/app/modules/control-panel/admin-panel/admin-panel.module').then(m=>m.AdminPanelModule)},

  {path:'',component:DashboardComponent} ,

]
},


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }
