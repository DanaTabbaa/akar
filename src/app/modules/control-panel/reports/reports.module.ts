import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OfficeSummaryComponent } from './office-summary/office-summary.component';
import { LifeTimeDebtComponent } from './life-time-debt/life-time-debt.component';
import { UnitStatusComponent } from './unit-status/unit-status.component';
import { UnitsExpensesComponent } from './units-expenses/units-expenses.component';
import { UnitLeaseAccountComponent } from './unit-lease-account/unit-lease-account.component';
import { HistoricalUnitComponent } from './historical-unit/historical-unit.component';
import { ElectricityConsumptionComponent } from './electricity-consumption/electricity-consumption.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FiltersModule, HttpLoaderFactory } from 'src/app/shared/components/filters/filters.module';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TenantsDuesComponent } from './tenants-dues/tenants-dues.component';
import { UnitsDuesComponent } from './units-dues/units-dues.component';
import { UnitsDetectionComponent } from './units-detection/units-detection.component';
import { RentsDuesComponent } from './rents-dues/rents-dues.component';
import { ContractsDetectionComponent } from './contracts-detection/contracts-detection.component';
import { VendorsCommissionsComponent } from './vendors-commissions/vendors-commissions.component';
import { WaterConsumptionComponent } from './water-consumption/water-consumption.component';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';



@NgModule({
  declarations: [
    ReportsComponent,
    OfficeSummaryComponent,
    LifeTimeDebtComponent,
    UnitStatusComponent,
    UnitsExpensesComponent,
    UnitLeaseAccountComponent,
    TenantsDuesComponent,
    UnitsDuesComponent,
    HistoricalUnitComponent,
    UnitsDetectionComponent,
    RentsDuesComponent,
    ContractsDetectionComponent,
    ElectricityConsumptionComponent,
    WaterConsumptionComponent,
    VendorsCommissionsComponent
    ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FiltersModule,
    NgSelectModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient],
      },
    }),

  
  ]
  , providers: [DateCalculation,DatePipe,TranslatePipe ]
})
export class ReportsModule { }
