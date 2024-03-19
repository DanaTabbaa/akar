import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrativeAlertsSettingsComponent } from './administrative-alerts-settings/administrative-alerts-settings.component';
import { BuildingsComponent } from './buildings/buildings.component';
import { UnitAndCustomerComponent } from './unit-and-customer.component';
import { CommissionsAndCommisionersComponent } from './commissions-and-commisioners/commissions-and-commisioners.component';
import { DistressedTenantsComponent } from './distressed-tenants/distressed-tenants.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PrivateMessagesComponent } from './private-messages/private-messages.component';
import { QuationsComponent } from './quations/quations.component';
import { RealEstateGroupsListComponent } from './real-estate-groups/real-estate-groups-list.component';
import { RealEstateOfficesComponent } from './real-estate-offices/real-estate-offices.component';
import { RecordsOfDeliveryandReceiptComponent } from './records-of-delivery-and-receipt/records-of-delivery-and-receipt.component';
import { SecuritiesAndGuardingCompaniesComponent } from './securities-and-guarding-companies/securities-and-guarding-companies.component';
import { SecurityFactsUnitsComponent } from './security-facts-units/security-facts-units.component';
import { ServantsComponent } from './servants/servants.component';
import { TenantsClaimsComponent } from './tenants-claims/tenants-claims.component';
import { BuildingComponent } from './buildings/building/building.component';
import { OwnersComponent } from './customers/owners/owners.component';
import { TenantsComponent } from './customers/tenants/tenants.component';
import { VendorsComponent } from './customers/vendors/vendors.component';
import { PurchasersComponent } from './customers/purchasers/purchasers.component';
import { OfficesListComponent } from './customers/offices-list/offices-list.component';
import { OwnersListComponent } from './customers/owners-list/owners-list.component';
import { TenantsListComponent } from './customers/tenants-list/tenants-list.component';
import { PeopleOfBenefitsListComponent } from './customers/people-of-benefits-list/people-of-benefits-list.component';
import { OfficesComponent } from './customers/offices/offices.component';
import { PeopleOfBenefitsComponent } from './customers/people-of-benefits/people-of-benefits.component';
import { PurchasersListComponent } from './customers/purchasers-list/purchasers-list.component';
import { UnitsListComponent } from './units/units-list.component';
import { UnitsComponent } from './units/units/units.component';
import { RealEstateGroupsComponent } from './real-estate-groups/real-estate-groups/real-estate-groups.component';
import { UnitsTypesListComponent } from './units-types/units - types-list/units-types-list.component';
import { UnitsTypesComponent } from './units-types/units-types.component';
import { GroundsListComponent } from './grounds/grouds-list/grounds-list.component';
import { GroundsComponent } from './grounds/grounds.component';
import { VendorCommissionsListComponent } from './vendor-commissions/vendor-commissions-list/vendor-commissions-list.component';
import { VendorCommissionsComponent } from './vendor-commissions/vendor-commissions.component';
import { VendorsListComponent } from './customers/vendors-list/vendors-list.component';
import { OffersComponent } from './offers/offers.component';
import { AddOfferComponent } from './offers/add-offer/add-offer.component';
import { RentContractsComponent } from './rent-contracts/rent-contracts.component';
import { RentContractsListComponent } from './rent-contracts/rent-contracts-list/rent-contracts-list.component';
import { RentContractsSettlementComponent } from './rent-contracts/rent-contracts-settlement/rent-contracts-settlement.component';
import { FormsModule } from '@angular/forms';
import { ContractComponent } from './contract/contract.component';
import { ContractListComponent } from './contract/contract-list/contract-list.component';
import { FloorsComponent } from './floors/floors.component';
import { LeafletMapComponent } from 'src/app/shared/components/maps/leaflet-map/leaflet-map.component';
import { FloorsListComponent } from './floors/floors-list/floors-list.component';
import { ResponsiblePersonsComponent } from './responsible-persons/responsible-persons.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { OpportunityListComponent } from './opportunity-list/opportunity-list.component';
import { AttributesComponent } from './attributes/attributes.component';
import { AttributesListComponent } from './attributes-list/attributes-list.component';
import { AdminOffersOpportunitiesComponent } from './admin-offers-opportunities/admin-offers-opportunities.component';
import { AdminSpecialsOpportunitiesComponent } from './admin-specials-opportunities/admin-specials-opportunities.component';
import { AdminOffersOpportunitiesListComponent } from './admin-offers-opportunities-list/admin-offers-opportunities-list.component';
import { AdminSpecialsOpportunitiesListComponent } from './admin-specials-opportunities-list/admin-specials-opportunities-list.component';
import { OpportunitiesTypesComponent } from './opportunities-types/opportunities-types.component';
import { OpportunitiesTypesListComponent } from './opportunities-types-list/opportunities-types-list.component';


const routes: Routes = [
  {path:'',component:UnitAndCustomerComponent,children:[
  {path:'alerts-settings',component:AdministrativeAlertsSettingsComponent},
  {path:'buildings',component:BuildingsComponent},
  {path:'map',component:LeafletMapComponent},
  {path:'commissions',component:CommissionsAndCommisionersComponent},
  {path:'rent-contracts-list',component:RentContractsListComponent},
  {path:'rent-contracts-list/:id',component:RentContractsListComponent},
  {path:'add-rent-contract',component:RentContractsComponent},
  {path:'add-rent-contract/:id',component:RentContractsComponent},
  {path:'update-rent-contract',component:RentContractsComponent},
  {path:'update-rent-contract/:id',component:RentContractsComponent},
  {path:'renew-rent-contract/:id',component:RentContractsComponent},
  {path:'rent-contracts-settlement/:id',component:RentContractsSettlementComponent},
  {path:'distressed-tenants',component:DistressedTenantsComponent},
  {path:'notifications',component:NotificationsComponent},
  {path:'private-message',component:PrivateMessagesComponent},
  {path:'quations',component:QuationsComponent},
  {path:'real-estate-groups-list',component:RealEstateGroupsListComponent},
  {path:'add-real-estate-group',component:RealEstateGroupsComponent},
  {path:'update-real-estate-group/:id',component:RealEstateGroupsComponent},
  {path:'real-estate-offices',component:RealEstateOfficesComponent},
  {path:'delivery-and-receipt',component:RecordsOfDeliveryandReceiptComponent},
  {path:'securities-and-guarding',component:SecuritiesAndGuardingCompaniesComponent},
  {path:'security-facts-units',component:SecurityFactsUnitsComponent},
  {path:'servants',component:ServantsComponent},
  {path:'tenants-claims',component:TenantsClaimsComponent},
  {path:'units-list',component:UnitsListComponent},
  {path:'quations',component:QuationsComponent},
  {path:'add-building',component:BuildingComponent},
  {path:'update-building/:id',component:BuildingComponent},
  {path:'offices-list',component:OfficesListComponent},
  {path:'owners-list',component:OwnersListComponent},
  {path:'tenants-list',component:TenantsListComponent},
  {path:'people-of-benefits-list',component:PeopleOfBenefitsListComponent},
  {path:'purchasers-list',component:PurchasersListComponent},
  {path:'add-owner',component:OwnersComponent},
  {path:'update-owner/:id',component:OwnersComponent},
  {path:'same-owner/:id',component:OwnersComponent},
  {path:'add-tenant',component:TenantsComponent},
  {path:'update-tenant/:id',component:TenantsComponent},
  {path:'same-tenant/:id',component:TenantsComponent},
  {path:'add-office',component:OfficesComponent},
  {path:'update-office/:id',component:OfficesComponent},
  {path:'same-office/:id',component:OfficesComponent},
  {path:'add-vendor',component:VendorsComponent},
  {path:'update-vendor/:id',component:VendorsComponent},
  {path:'vendors-list',component:VendorsListComponent},
  {path:'same-vendor/:id',component:VendorsComponent},
  {path:'add-purchaser',component:PurchasersComponent},
  {path:'update-purchaser/:id',component:PurchasersComponent},
  {path:'same-purchaser/:id',component:PurchasersComponent},
  {path:'add-benefit-person',component:PeopleOfBenefitsComponent},
  {path:'update-benefit-person/:id',component:PeopleOfBenefitsComponent},
  {path:'same-benefit-person/:id',component:PeopleOfBenefitsComponent},
  {path:'units-list',component:UnitsListComponent},
  {path:'add-unit',component:UnitsComponent},
  {path:'update-unit/:id',component:UnitsComponent},
  {path:'units-types-list',component:UnitsTypesListComponent},
  {path:'add-unit-type',component:UnitsTypesComponent},
  {path:'update-unit-type/:id',component:UnitsTypesComponent},
  {path:'grounds-list',component:GroundsListComponent},
  {path:'add-ground',component:GroundsComponent},
  {path:'update-ground/:id',component:GroundsComponent},
  {path:'vendor-commissions-list',component:VendorCommissionsListComponent},
  {path:'add-vendor-commission',component:VendorCommissionsComponent},
  {path:'update-vendor-commission/:id',component:VendorCommissionsComponent},
  {path:"offers-list",component:OffersComponent},
  {path:"add-offer",component:AddOfferComponent},
  {path:"update-offer/:id",component:AddOfferComponent},
  {path:"add-contract/:id",component:ContractComponent},
  {path:"add-contract",component:ContractComponent},
  {path:"update-contract",component:ContractComponent},
  {path:"update-contract/:id",component:ContractComponent},
  {path:"contracts-list/:id",component:ContractListComponent},
  {path:"contracts-list",component:ContractListComponent},
  {path:'add-floor',component:FloorsComponent},
  {path:'update-floor/:id',component:FloorsComponent},
  {path:'floors-list',component:FloorsListComponent},
  {path:'responsible-list',component:ResponsiblePersonsComponent},
  {path:'add-opportunity', component:OpportunityComponent},
  {path:'opportunities-list', component:OpportunityListComponent},
  {path:'update-opportunity/:id', component:OpportunityComponent},
  {path:'add-attribute', component:AttributesComponent},
  {path:'attributes-list', component:AttributesListComponent},
  {path:'update-attribute/:id', component:AttributesComponent},
  {path:'opportunities-offers', component:AdminOffersOpportunitiesListComponent},
  {path:'opportunities-specials', component:AdminSpecialsOpportunitiesListComponent},

  {path:'add-opportunities-offers', component:AdminOffersOpportunitiesComponent},
  {path:'update-opportunities-offers/:id', component:AdminOffersOpportunitiesComponent},
  {path:'add-opportunities-specials', component:AdminSpecialsOpportunitiesComponent},
  {path:'update-opportunities-specials/:id', component:AdminSpecialsOpportunitiesComponent},


  {path:'add-opportunities-types', component:OpportunitiesTypesComponent},
  {path:'update-opportunities-types/:id', component:OpportunitiesTypesComponent},
  {path:'opportunities-types-list', component:OpportunitiesTypesListComponent},
  
  






  ]}


];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,FormsModule]
})
export class UnitAndCustomerRoutingModule { }
