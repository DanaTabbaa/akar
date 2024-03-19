import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AdvertisementManagementComponent } from './advertisement-management/advertisement-management.component';
import { CitiesComponent } from './cities/cities.component';
import { ClausesContractsComponent } from './clauses-contracts/clauses-contracts.component';
import { CompanyActivitiesComponent } from './company-activities/company-activities.component';
import { ControlFieldsComponent } from './control-fields/control-fields.component';
import { CountriesComponent } from './countries/countries.component';
import { DistrictsComponent } from './districts/districts.component';
import { ListsManagementComponent } from './lists-management/lists-management.component';
import { MarketEquipmentComponent } from './market-equipment/market-equipment.component';
import { NationalitiesComponent } from './nationalities/nationalities.component';
import { RegionsComponent } from './regions/regions.component';
import { SearchParametersComponent } from './search-parameters/search-parameters.component';
import { TaxesComponent } from './taxes/taxes.component';
import { UnitServicesComponent } from './unit-services/unit-services.component';
import { UnitTypeComponent } from './unit-type/unit-type.component';
import { VariableSelectorsComponent } from './variable-selectors/variable-selectors.component';
import { MenuComponent } from './layout-setting/menu/menu.component';
import { ScreenComponent } from './layout-setting/screen/screen.component';
import { SiteInfoComponent } from './layout-setting/site-info/site-info.component';
import { CountriesListComponent } from './countries/countries-list/countries-list.component';
import { RegionsListComponent } from './regions/regions-list/regions-list.component';
import { CitiesListComponent } from './cities/cities-list/cities-list.component';
import { DistrictsListComponent } from './districts/districts-list/districts-list.component';
import { CompanyActivitiesListComponent } from './company-activities/company-activities-list/company-activities-list.component';
import { NationalitiesListComponent } from './nationalities/nationalities-list/nationalities-list.component';
import { CurrenciesListComponent } from './currencies/currencies-list/currencies-list.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { UnitServicesListComponent } from './unit-services/unit-services-list/unit-services-list.component';
import { ContractsSettingsListComponent } from './contracts-settings/contracts-settings-list/contracts-settings-list.component';
import { ContractsSettingsComponent } from './contracts-settings/contracts-settings.component';
import { ContractsTypesListComponent } from './contracts-types/contracts-types-list/contracts-types-list.component';
import { ContractsTypesComponent } from './contracts-types/contracts-types.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { NotificationsManagementSettingsComponent } from './notifications-manager/notifications-management-settings/notifications-management-settings.component';
import { NotificationsConfigurationsComponent } from './notifications-manager/notifications-configurations/notifications-configurations.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { DashboardSettingsComponent } from './dashboard-settings/dashboard-settings.component';
import { JobsTitelsComponent } from './jobs-titels/jobs-titels.component';


const routes: Routes = [{
  path:'',component:SettingsComponent,children:[
    {path:'advertisement-management',component:AdvertisementManagementComponent},
    {path:'cities-list',component:CitiesListComponent},
    {path:'add-city',component:CitiesComponent},
    {path:'update-city/:id',component:CitiesComponent},

    {path:'clauses-contracts',component:ClausesContractsComponent},
    {path:'company-activities',component:CompanyActivitiesComponent},
    {path:'control-fields',component:ControlFieldsComponent},
    {path:'countries-list',component:CountriesListComponent},
    {path:'add-country',component:CountriesComponent},
    {path:'update-country/:id',component:CountriesComponent},
    {path:'districts-list',component:DistrictsListComponent},
    {path:'add-district',component:DistrictsComponent},
    {path:'update-district/:id',component:DistrictsComponent},
    {path:'lists-management',component:ListsManagementComponent},
    {path:'market-equipment',component:MarketEquipmentComponent},
    {path:'nationalities',component:NationalitiesComponent},
    {path:'regions-list',component:RegionsListComponent},
    {path:'add-region',component:RegionsComponent},
    {path:'update-region/:id',component:RegionsComponent},
    {path:'company-activities-list',component:CompanyActivitiesListComponent},
    {path:'add-company-activity',component:CompanyActivitiesComponent},
    {path:'update-company-activity/:id',component:CompanyActivitiesComponent},
    {path:'nationalities-list',component:NationalitiesListComponent},
    {path:'add-nationality',component:NationalitiesComponent},
    {path:'update-nationality/:id',component:NationalitiesComponent},
    {path:'search-parameters',component:SearchParametersComponent},
    {path:'search-parameters',component:SearchParametersComponent},
    {path:'taxes',component:TaxesComponent},
    {path:'unit-services',component:UnitServicesComponent},
    {path:'unit-type',component:UnitTypeComponent},
    {path:'variable-selectors',component:VariableSelectorsComponent},
    {path:'menu-setting',component:MenuComponent},
    {path:'screen-setting',component:ScreenComponent},
    {path:'sit-info-setting',component:SiteInfoComponent},
    {path:'currencies-list',component:CurrenciesListComponent},
    {path:'add-currency',component:CurrenciesComponent},
    {path:'update-currency/:id',component:CurrenciesComponent},

    {path:'unit-services-list',component:UnitServicesListComponent},
    {path:'add-unit-service',component:UnitServicesComponent},
    {path:'update-unit-service/:id',component:UnitServicesComponent},


    {path:'contracts-settings-list',component:ContractsSettingsListComponent},
    {path:'add-contract-setting',component:ContractsSettingsComponent},
    {path:'update-contract-setting/:id',component:ContractsSettingsComponent},

    {path:'contracts-types-list',component:ContractsTypesListComponent},
    {path:'add-contract-type',component:ContractsTypesComponent},
    {path:'update-contract-type/:id',component:ContractsTypesComponent},

    {path:'system-settings',component:SystemSettingsComponent},
    {path:'control-fields',component:ControlFieldsComponent},
    {path:'notifications-management-settings',component:NotificationsManagementSettingsComponent},
    {path:'update-notification/:id',component:NotificationsManagementSettingsComponent},

    {path:'add-notifications-configurations',component:NotificationsConfigurationsComponent},
    {path:'notifications-configurations-list',component:NotificationsConfigurationsComponent},
    {path:'update-notifications-configurations/:id',component:NotificationsConfigurationsComponent},
    {path:'company-information',component:CompanyInformationComponent},
    {path:'dashboard-settings',component:DashboardSettingsComponent},
    {path:'jobs-titles',component:JobsTitelsComponent},



  ]


}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
