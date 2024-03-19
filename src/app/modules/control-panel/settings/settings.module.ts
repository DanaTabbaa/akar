import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UnitTypeComponent } from './unit-type/unit-type.component';
import { UnitServicesComponent } from './unit-services/unit-services.component';
import { DistrictsComponent } from './districts/districts.component';
import { RegionsComponent } from './regions/regions.component';
import { CitiesComponent } from './cities/cities.component';
import { CompanyActivitiesComponent } from './company-activities/company-activities.component';
import { NationalitiesComponent } from './nationalities/nationalities.component';
import { ClausesContractsComponent } from './clauses-contracts/clauses-contracts.component';
import { TaxesComponent } from './taxes/taxes.component';
import { VariableSelectorsComponent } from './variable-selectors/variable-selectors.component';
import { ContractsTermsComponent } from './contracts-terms/contracts-terms.component';
import { MarketEquipmentComponent } from './market-equipment/market-equipment.component';
import { ControlFieldsComponent } from './control-fields/control-fields.component';
import { AdvertisementManagementComponent } from './advertisement-management/advertisement-management.component';
import { ListsManagementComponent } from './lists-management/lists-management.component';
import { CountriesComponent } from './countries/countries.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { SearchParametersComponent } from './search-parameters/search-parameters.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { LayoutSettingComponent } from './layout-setting/layout-setting.component';
import { MenuComponent } from './layout-setting/menu/menu.component';
import { SiteInfoComponent } from './layout-setting/site-info/site-info.component';
import { ScreenComponent } from './layout-setting/screen/screen.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { RegionsListComponent } from './regions/regions-list/regions-list.component';
import { CitiesListComponent } from './cities/cities-list/cities-list.component';
import { DistrictsListComponent } from './districts/districts-list/districts-list.component';
import { CompanyActivitiesListComponent } from './company-activities/company-activities-list/company-activities-list.component';
import { NationalitiesListComponent } from './nationalities/nationalities-list/nationalities-list.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { CurrenciesListComponent } from './currencies/currencies-list/currencies-list.component';
import { UnitServicesListComponent } from './unit-services/unit-services-list/unit-services-list.component';
import { ContractsSettingsComponent } from './contracts-settings/contracts-settings.component';
import { ContractsSettingsListComponent } from './contracts-settings/contracts-settings-list/contracts-settings-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContractsTypesComponent } from './contracts-types/contracts-types.component';
import { ContractsTypesListComponent } from './contracts-types/contracts-types-list/contracts-types-list.component';
import { NotificationsManagementSettingsComponent } from './notifications-manager/notifications-management-settings/notifications-management-settings.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { MultiSelectModule } from 'primeng/multiselect';
import { NotificationsConfigurationsComponent } from './notifications-manager/notifications-configurations/notifications-configurations.component';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
//import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotificationsManagementSettingsLisComponent } from './notifications-manager/notifications-management-settings/notifications-management-settings-lis/notifications-management-settings-lis.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { FullDateModule } from 'src/app/shared/components/date/full-date/full-date.module';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { DashboardSettingsComponent } from './dashboard-settings/dashboard-settings.component';
import { JobsTitelsComponent } from './jobs-titels/jobs-titels.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    SettingsComponent,
    UnitTypeComponent,
    UnitServicesComponent,
    DistrictsComponent,
    DistrictsListComponent,
    RegionsComponent,
    RegionsListComponent,
    CitiesComponent,
    CitiesListComponent,
    CompanyActivitiesComponent,
    NationalitiesComponent,
    ClausesContractsComponent,
    TaxesComponent,
    VariableSelectorsComponent,
    ContractsTermsComponent,
    CurrenciesComponent,
    CurrenciesListComponent,
    MarketEquipmentComponent,
    ControlFieldsComponent,
    AdvertisementManagementComponent,
    ListsManagementComponent,
    ListsManagementComponent,
    CountriesComponent,
    CountriesListComponent,
    CompanyActivitiesComponent,
    CompanyActivitiesListComponent,
    NationalitiesComponent,
    NationalitiesListComponent,
    UnitServicesComponent,
    UnitServicesListComponent,
    SystemSettingsComponent,
    SearchParametersComponent,
    LayoutSettingComponent,
    MenuComponent,
    SiteInfoComponent,
    ScreenComponent,
    ContractsSettingsComponent,
    ContractsSettingsListComponent,
    ContractsTypesComponent,
    ContractsTypesListComponent,
    NotificationsManagementSettingsComponent,
    NotificationsConfigurationsComponent,
    NotificationsManagementSettingsLisComponent,
    CompanyInformationComponent,
    DashboardSettingsComponent,
    JobsTitelsComponent

  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NgxSpinnerModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    SharedModule,
    MatSlideToggleModule,
    MatCheckboxModule,

    FullDateModule,
    QuillModule.forRoot(),
    MultiSelectModule,
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
  ], providers: [DateCalculation,DatePipe,TranslatePipe,
    DateConverterService,  ]

})
export class SettingsModule {
  lang: string = '';
  constructor(
    private translateService: TranslateService,
    private sharedServices: SharedService
  ) {
    this.lang = localStorage.getItem('language')!;
    this.listenToLanguageChange();
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
