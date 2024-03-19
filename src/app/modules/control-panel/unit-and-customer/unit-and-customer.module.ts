import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BuildingsComponent } from './buildings/buildings.component';
import { RealEstateOfficesComponent } from './real-estate-offices/real-estate-offices.component';
import { QuationsComponent } from './quations/quations.component';
import { SecuritiesAndGuardingCompaniesComponent } from './securities-and-guarding-companies/securities-and-guarding-companies.component';
import { ServantsComponent } from './servants/servants.component';
import { UnitAndCustomerRoutingModule } from './unit-and-customer-routing.module';
import { UnitAndCustomerComponent } from './unit-and-customer.component';
import { BuildingComponent } from './buildings/building/building.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { OwnersComponent } from './customers/owners/owners.component';
import { TenantsComponent } from './customers/tenants/tenants.component';
import { VendorsComponent } from './customers/vendors/vendors.component';
import { PurchasersComponent } from './customers/purchasers/purchasers.component';
import { PeopleOfBenefitsListComponent } from './customers/people-of-benefits-list/people-of-benefits-list.component';
import { OfficesListComponent } from './customers/offices-list/offices-list.component';
import { OwnersListComponent } from './customers/owners-list/owners-list.component';
import { PurchasersListComponent } from './customers/purchasers-list/purchasers-list.component';
import { VendorsListComponent } from './customers/vendors-list/vendors-list.component';
import { TenantsListComponent } from './customers/tenants-list/tenants-list.component';
import { OfficesComponent } from './customers/offices/offices.component';
import { PeopleOfBenefitsComponent } from './customers/people-of-benefits/people-of-benefits.component';
import { UnitsListComponent } from './units/units-list.component';
import { UnitsComponent } from './units/units/units.component';
import { RealEstateGroupsComponent } from './real-estate-groups/real-estate-groups/real-estate-groups.component';
import { RealEstateGroupsListComponent } from './real-estate-groups/real-estate-groups-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UnitsTypesComponent } from './units-types/units-types.component';
import { UnitsTypesListComponent } from './units-types/units - types-list/units-types-list.component';
import { GroundsComponent } from './grounds/grounds.component';
import { GroundsListComponent } from './grounds/grouds-list/grounds-list.component';
import { VERSION } from '@angular/platform-browser-dynamic';
import { VendorCommissionsComponent } from './vendor-commissions/vendor-commissions.component';
import { VendorCommissionsListComponent } from './vendor-commissions/vendor-commissions-list/vendor-commissions-list.component';
import { OffersComponent } from './offers/offers.component';
import { AddOfferComponent } from './offers/add-offer/add-offer.component';
import { RentContractsComponent } from './rent-contracts/rent-contracts.component';
import { RentContractsListComponent } from './rent-contracts/rent-contracts-list/rent-contracts-list.component';
import { RentContractsSettlementComponent } from './rent-contracts/rent-contracts-settlement/rent-contracts-settlement.component';
import {TabulatorModule} from '../../../shared/components/tabulator/tabulator.module';
import { FullDateComponent } from 'src/app/shared/components/date/full-date/full-date.component';
import { FullDateModule } from 'src/app/shared/components/date/full-date/full-date.module';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { GregorianDateModule } from 'src/app/shared/components/date/gregorian-date/gregorian-date.module';
import { HijriDateModule } from 'src/app/shared/components/date/hijri-date/hijri-date.module';
import { ContractComponent } from './contract/contract.component';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import {  NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Subscription} from 'rxjs'
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { ContractListComponent } from './contract/contract-list/contract-list.component';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { FloorsComponent } from './floors/floors.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FloorsListComponent } from './floors/floors-list/floors-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ResponsiblePersonsComponent } from './responsible-persons/responsible-persons.component';
import { OpportunityImagesComponent } from './opporunity-images/opporunity-images.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OpportunityListComponent } from './opportunity-list/opportunity-list.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { AttributesComponent } from './attributes/attributes.component';
import { AttributesListComponent } from './attributes-list/attributes-list.component';
import { AdminOffersOpportunitiesComponent } from './admin-offers-opportunities/admin-offers-opportunities.component';
import { AdminOffersOpportunitiesListComponent } from './admin-offers-opportunities-list/admin-offers-opportunities-list.component';
import { AdminSpecialsOpportunitiesComponent } from './admin-specials-opportunities/admin-specials-opportunities.component';
import { AdminSpecialsOpportunitiesListComponent } from './admin-specials-opportunities-list/admin-specials-opportunities-list.component';
import { OpportunitiesTypesListComponent } from './opportunities-types-list/opportunities-types-list.component';
import { OpportunitiesTypesComponent } from './opportunities-types/opportunities-types.component';
//import {NgxTagsInputBoxModule} from 'ngx-tags-input-box';
//import { OwnerIntegrationSettingComponent } from './owner-integration-setting/owner-integration-setting.component';


@NgModule({
  declarations: [
    UnitAndCustomerComponent,
    RealEstateGroupsComponent,
    BuildingsComponent,
    UnitsComponent,
    RealEstateOfficesComponent,
    QuationsComponent,
    RentContractsListComponent,
    SecuritiesAndGuardingCompaniesComponent,
    ServantsComponent,
    BuildingComponent,
    RentContractsComponent,
    RentContractsSettlementComponent,
    OwnersComponent,
    TenantsComponent,
    OfficesComponent,
    PeopleOfBenefitsComponent,
    VendorsComponent,
    PurchasersComponent,
    OwnersListComponent,
    TenantsListComponent,
    OfficesListComponent,
    VendorsListComponent,
    PurchasersListComponent,
    PeopleOfBenefitsListComponent,
    RealEstateGroupsListComponent,
    UnitsTypesComponent,
    UnitsTypesListComponent,
    UnitsListComponent,
    GroundsComponent,
    GroundsListComponent,
    VendorCommissionsComponent,
    VendorCommissionsListComponent,
    OffersComponent,
    AddOfferComponent,
    ContractComponent,
    ContractListComponent,    
    FloorsComponent,
    FloorsListComponent,
    ResponsiblePersonsComponent,
    OpportunityListComponent,
    OpportunityComponent,
    AttributesComponent,
    AttributesListComponent,
    OpportunityImagesComponent,
    AdminOffersOpportunitiesComponent,
    AdminOffersOpportunitiesListComponent,
    AdminSpecialsOpportunitiesComponent,
    AdminSpecialsOpportunitiesListComponent,
    OpportunitiesTypesListComponent,
    OpportunitiesTypesComponent,
    //OwnerIntegrationSettingComponent
  ],
  imports: [
    CommonModule,
    UnitAndCustomerRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    TabulatorModule,
    FullDateModule,
    GregorianDateModule,
    HijriDateModule,
    NgxSpinnerModule,
    MatDialogModule,
    MultiSelectModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSnackBarModule,
   // NgxTagsInputBoxModule
    
    

  ], providers: [DateCalculation,DatePipe, ManagerService,TranslatePipe,DateConverterService,SearchDialogService   ]
})
export class UnitAndCustomerModule {
  lang: string = '';
  constructor(
    private translateService: TranslateService,
    private sharedServices: SharedService,
    //private managerService:ManagerService
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
