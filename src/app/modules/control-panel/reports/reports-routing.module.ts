import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ElectricityConsumptionComponent } from './electricity-consumption/electricity-consumption.component';
import { HistoricalUnitComponent } from './historical-unit/historical-unit.component';
import { LifeTimeDebtComponent } from './life-time-debt/life-time-debt.component';
import { OfficeSummaryComponent } from './office-summary/office-summary.component';

import { UnitLeaseAccountComponent } from './unit-lease-account/unit-lease-account.component';
import { UnitStatusComponent } from './unit-status/unit-status.component';
import { UnitsExpensesComponent } from './units-expenses/units-expenses.component';
import { TenantsDuesComponent } from './tenants-dues/tenants-dues.component';
import { UnitsDuesComponent } from './units-dues/units-dues.component';
import { UnitsDetectionComponent } from './units-detection/units-detection.component';
import { RentsDuesComponent } from './rents-dues/rents-dues.component';
import { ContractsDetectionComponent } from './contracts-detection/contracts-detection.component';
import { VendorsCommissionsComponent } from './vendors-commissions/vendors-commissions.component';
import { WaterConsumptionComponent } from './water-consumption/water-consumption.component';


const routes: Routes = [{
 path:'',component:ReportsComponent,children:[
   {path:'vendors-commissions',component:VendorsCommissionsComponent},
   {path:'contracts-detection',component:ContractsDetectionComponent},
   {path:'electricity-consumption',component:ElectricityConsumptionComponent},
   {path:'water-consumption',component:WaterConsumptionComponent},
   {path:'historical-unit',component:HistoricalUnitComponent},
   {path:'life-time-debt',component:LifeTimeDebtComponent},
   {path:'office-summary',component:OfficeSummaryComponent},
   {path:'rents-dues',component:RentsDuesComponent},
   {path:'tenants-dues',component:TenantsDuesComponent},
   {path:'units-dues',component:UnitsDuesComponent},
   {path:'unit-lease-account',component:UnitLeaseAccountComponent},
   {path:'unit-status',component:UnitStatusComponent},
   {path:'units-expenses',component:UnitsExpensesComponent},
   {path:'units-detection',component:UnitsDetectionComponent}

 ]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
