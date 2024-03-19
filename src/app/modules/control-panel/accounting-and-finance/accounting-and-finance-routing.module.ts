import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingAndFinanceComponent } from './accounting-and-finance.component';
import { AccountsClassificationListComponent } from './accounts-classification/accounts-classification-list/accounts-classification-list.component';
import { AccountsClassificationComponent } from './accounts-classification/accounts-classification.component';
import { AccountsTypesListComponent } from './accounts-types/accounts-types-list/accounts-types-list.component';
import { AccountsTypesComponent } from './accounts-types/accounts-types.component';
import { AccountsListComponent } from './accounts/accounts-list/accounts-list.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AddLeaseAgreementComponent } from './add-lease-agreement/add-lease-agreement.component';
import { AirConditioningBillsComponent } from './air-conditioning-bills/air-conditioning-bills.component';
import { BanksComponent } from './banks/banks.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillTypeListComponent } from './bill-type-list/bill-type-list.component';
import { BillTypesComponent } from './bill-types/bill-types.component';
import { BillComponent } from './bill/bill.component';
import { CheckCashingVouchersComponent } from './check-cashing-vouchers/check-cashing-vouchers.component';
import { CheckStockComponent } from './check-stock/check-stock.component';
import { ClausesNewContractsComponent } from './clauses-new-contracts/clauses-new-contracts.component';
import { CreditNoticesDeductionsComponent } from './credit-notices-deductions/credit-notices-deductions.component';
import { DebitNoticesAddComponent } from './debit-notices-add/debit-notices-add.component';
import { DiscountRequestComponent } from './discount-request/discount-request.component';
import { DistributionRevenueDueComponent } from './distribution-revenue-due/distribution-revenue-due.component';
import { EntitlementsAlertsComponent } from './entitlements-alerts/entitlements-alerts.component';
import { EntryTypeListComponent } from './entry-type-list/entry-type-list.component';
import { EntryTypesComponent } from './entry-types/entry-types.component';
import { FinantialConstraintsComponent } from './finantial-constraints/finantial-constraints.component';
import { GeneralAccountIntegrationSettingsComponent } from './general-account-integration-settings/general-account-integration-settings.component';
import { GenerateEntryBenefitComponent } from './generate-entry-benefit/generate-entry-benefit.component';
import { MarketingInvoiceComponent } from './marketing-invoice/marketing-invoice.component';
import { RealReceiptBondsComponent } from './real-receipt-bonds/real-receipt-bonds.component';
import { RentalInvoiceComponent } from './rental-invoice/rental-invoice.component';
import { RequestIssueCheckComponent } from './request-issue-check/request-issue-check.component';
import { SARExchangeBondsComponent } from './sar-exchange-bonds/sar-exchange-bonds.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherComponent } from './voucher/voucher.component';
import { WaterBillsComponent } from './water-bills/water-bills.component';


const routes: Routes = [{
  path:'',component:AccountingAndFinanceComponent,children:[
     {path:'accounts-list',component:AccountsListComponent},
     {path:'add-account',component:AccountsComponent},
     {path:'update-account/:id',component:AccountsComponent},

     {path:'accounts-types-list',component:AccountsTypesListComponent},
     {path:'add-account-type',component:AccountsTypesComponent},
     {path:'update-account-type/:id',component:AccountsTypesComponent},
     {path:'accounts-classification-list',component:AccountsClassificationListComponent},
     {path:'add-account-classification',component:AccountsClassificationComponent},
     {path:'update-account-classification/:id',component:AccountsClassificationComponent},
     {path:'add-lease-agreement',component:AddLeaseAgreementComponent},
     {path:'air-conditioning-bills',component:AirConditioningBillsComponent},
     {path:'banks',component:BanksComponent},
     {path:'benefits',component:BenefitsComponent},
     {path:'check-vouchers',component:CheckCashingVouchersComponent},
     {path:'check-stock',component:CheckStockComponent},
     {path:'clauses-contracts',component:ClausesNewContractsComponent},
     {path:'credit-deductions',component:CreditNoticesDeductionsComponent},
     {path:'debit-notices-add',component:DebitNoticesAddComponent},
     {path:'discount-request',component:DiscountRequestComponent},
     {path:'distribution-revenue',component:DistributionRevenueDueComponent},
     {path:'entitlements-alerts',component:EntitlementsAlertsComponent},
     {path:'finantial-constraints',component:FinantialConstraintsComponent},
     {path:'generate-entry',component:GenerateEntryBenefitComponent},
     {path:'marketing-invoice',component:MarketingInvoiceComponent},
     {path:'receipt-bonds',component:RealReceiptBondsComponent},
     {path:'rental-invoice',component:RentalInvoiceComponent},
     {path:'request-issue',component:RequestIssueCheckComponent},
     {path:'sar-exchange-bonds',component:SARExchangeBondsComponent},
     {path:'water-bills',component:WaterBillsComponent},
     {path:'entry-type-list',component:EntryTypeListComponent},
     {path:'add-entry-type',component:EntryTypesComponent},
     {path:'update-entry-type/:id',component:EntryTypesComponent},
     {path:'update-voucher',component:VoucherComponent},
     {path:'update-voucher/:id',component:VoucherComponent},
     {path:'add-voucher',component:VoucherComponent},
     {path:'voucher/:id',component:VoucherComponent},
     {path:'voucher-list/:id',component:VoucherListComponent},
     {path:'voucher-list',component:VoucherListComponent},
     {path:'bill-type-list',component:BillTypeListComponent},
     {path:'add-bill-type',component:BillTypesComponent},
     {path:'update-bill-type/:id',component:BillTypesComponent},
     {path:'update-bill/:id',component:BillComponent},
     {path:'add-bill',component:BillComponent},
     {path:'bill-list',component:BillListComponent},
     {path:'acc-settings',component:GeneralAccountIntegrationSettingsComponent}


  ]


}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingAndFinanceRoutingModule { }
