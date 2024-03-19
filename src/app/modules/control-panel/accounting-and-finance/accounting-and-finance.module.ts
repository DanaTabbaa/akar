import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountsComponent } from './accounts/accounts.component';
import { RequestIssueCheckComponent } from './request-issue-check/request-issue-check.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { GenerateEntryBenefitComponent } from './generate-entry-benefit/generate-entry-benefit.component';
import { EntitlementsAlertsComponent } from './entitlements-alerts/entitlements-alerts.component';
import { DiscountRequestComponent } from './discount-request/discount-request.component';
import { AddLeaseAgreementComponent } from './add-lease-agreement/add-lease-agreement.component';
import { ClausesNewContractsComponent } from './clauses-new-contracts/clauses-new-contracts.component';
import { RealReceiptBondsComponent } from './real-receipt-bonds/real-receipt-bonds.component';
import { SARExchangeBondsComponent } from './sar-exchange-bonds/sar-exchange-bonds.component';
import { CheckCashingVouchersComponent } from './check-cashing-vouchers/check-cashing-vouchers.component';
import { DebitNoticesAddComponent } from './debit-notices-add/debit-notices-add.component';
import { CreditNoticesDeductionsComponent } from './credit-notices-deductions/credit-notices-deductions.component';
import { RentalInvoiceComponent } from './rental-invoice/rental-invoice.component';
import { MarketingInvoiceComponent } from './marketing-invoice/marketing-invoice.component';
import { DistributionRevenueDueComponent } from './distribution-revenue-due/distribution-revenue-due.component';
import { AirConditioningBillsComponent } from './air-conditioning-bills/air-conditioning-bills.component';
import { WaterBillsComponent } from './water-bills/water-bills.component';
import { BanksComponent } from './banks/banks.component';
import { CheckStockComponent } from './check-stock/check-stock.component';
import { FinantialConstraintsComponent } from './finantial-constraints/finantial-constraints.component';
import { AccountingAndFinanceRoutingModule } from './accounting-and-finance-routing.module';
import { AccountingAndFinanceComponent } from './accounting-and-finance.component';
import { AccountsListComponent } from './accounts/accounts-list/accounts-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountsTypesListComponent } from './accounts-types/accounts-types-list/accounts-types-list.component';
import { AccountsTypesComponent } from './accounts-types/accounts-types.component';
import { AccountsClassificationListComponent } from './accounts-classification/accounts-classification-list/accounts-classification-list.component';
import { AccountsClassificationComponent } from './accounts-classification/accounts-classification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntryTypesComponent } from './entry-types/entry-types.component';
import { EntryComponent } from './entry/entry.component';
import { FullDateModule } from 'src/app/shared/components/date/full-date/full-date.module';
import { VoucherComponent } from './voucher/voucher.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { EntryTypeListComponent } from './entry-type-list/entry-type-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherDetailsComponent } from './voucher-details/voucher-details.component';
import { VoucherDuesComponent } from './voucher-dues/voucher-dues.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchFormModule } from 'src/app/shared/components/search-form/search-form.module';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { BillTypesComponent } from './bill-types/bill-types.component';
import { BillTypeListComponent } from './bill-type-list/bill-type-list.component';
import { BillComponent } from './bill/bill.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillItemsComponent } from './bill-items/bill-items.component';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { BillDuesComponent } from './bill-dues/bill-dues.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginationService } from 'src/app/core/services/local-services/pagination.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';
import { GeneralAccountIntegrationSettingsComponent } from './general-account-integration-settings/general-account-integration-settings.component';



@NgModule({
  declarations: [
    AccountingAndFinanceComponent,
    AccountsComponent,
    AccountsListComponent,
    AccountsTypesListComponent,
    AccountsTypesComponent,
    AccountsClassificationListComponent,
    AccountsClassificationComponent,
    RequestIssueCheckComponent,
    BenefitsComponent,
    GenerateEntryBenefitComponent,
    EntitlementsAlertsComponent,
    DiscountRequestComponent,
    AddLeaseAgreementComponent,
    ClausesNewContractsComponent,
    RealReceiptBondsComponent,
    SARExchangeBondsComponent,
    CheckCashingVouchersComponent,
    DebitNoticesAddComponent,
    CreditNoticesDeductionsComponent,
    RentalInvoiceComponent,
    MarketingInvoiceComponent,
    DistributionRevenueDueComponent,
    AirConditioningBillsComponent,
    WaterBillsComponent,
    BanksComponent,
    CheckStockComponent,
    FinantialConstraintsComponent,
    EntryTypesComponent,
    EntryComponent,
    VoucherComponent,
    EntryTypeListComponent,
    VoucherListComponent,
    VoucherDetailsComponent,
    VoucherDuesComponent,
    BillTypesComponent,
    BillTypeListComponent,
    BillComponent,
    BillListComponent,
    BillDuesComponent,
    BillItemsComponent,
    GeneralAccountIntegrationSettingsComponent


  ],
  imports: [
    CommonModule,
    AccountingAndFinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    FullDateModule,
    NgxSpinnerModule,
    NgbModule,
    SearchFormModule,
    MultiSelectModule

  ],
  providers:[
    TranslatePipe,
    DatePipe,
    DateConverterService,
    SearchDialogService,
    DateCalculation,
    PaginationService 
  ]
})
export class AccountingAndFinanceModule {
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
