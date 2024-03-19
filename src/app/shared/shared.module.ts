import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ColorPalletComponent } from './components/color-pallet/color-pallet.component';
import { NavBarComponent } from './components/header/nav-bar/nav-bar.component';


import { MetricsComponent } from './components/dashboard/metrics/metrics.component';
import { GraphComponent } from './components/dashboard/graph/graph.component';
import { DailyBenefitsComponent } from './components/dashboard/daily-benefits/daily-benefits.component';
import { ReservationsComponent } from './components/dashboard/reservations/reservations.component';
import { ReusableUnitComponent } from './components/control-panel-components/reusable-unit/reusable-unit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResuableUnitServicesComponent } from './components/control-panel-components/resuable-unit-services/resuable-unit-services.component';
import { ReusablRentContractDuesComponent } from './components/control-panel-components/reusable-rent-contract-dues/reusable-rent-contract-dues.component';
import { ToolbarComponent } from './components/pages/toolbar/toolbar.component';
import { NgbCalendarIslamicUmalqura, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from './components/modal/modal-component';
import { NgbdModalComponentModule } from './components/modal/modal-component.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TabulatorModule } from './components/tabulator/tabulator.module';
import { MessageModalComponent } from './message-modal/message-modal.component';
import { InputComponent } from './components/form/input/input.component';
import { FilterPipe } from './piples/filter-pipe';
import { UploadFilesFormComponent } from './components/pages/upload-files/upload-files-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadFilesDialogService } from './services/upload-files-dialog.service';
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider';
import { FileUploadModule } from './components/file-upload/file-upload.module';
import { MatMenuModule } from '@angular/material/menu';
import { PerviewUploadedFilesComponent } from './components/pages/upload-files/perview-uploaded-files/perview-uploaded-files.component';
import { LeafletMapComponent } from './components/maps/leaflet-map/leaflet-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DateCalculation } from '../core/services/local-services/date-services/date-calc.service';
import { PriceOffersNotificationComponent } from './components/dashboard/price-offers-notification/price-offers-notification.component';
import { UnitsNotificationComponent } from './components/dashboard/units-notification/units-notification.component';
import { TenantsNotificationComponent } from './components/dashboard/tenants-notification/tenants-notification.component';
import { RentContractsNotificationComponent } from './components/dashboard/rent-contracts-notification/rent-contracts-notification.component';
import { SalesBuyContractsNotificationComponent } from './components/dashboard/sales-buy-contracts-notification/sales-buy-contracts-notification.component';
import { MaintenanceContractsNotificationComponent } from './components/dashboard/maintenance-contracts-notification/maintenance-contracts-notification.component';
import { QuickModalService } from './services/quick-modal.service';
import { NgxSpinnerModule } from 'ngx-spinner';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({

  declarations: [
    NavBarComponent,
    SidebarComponent,
    ColorPalletComponent,
    MetricsComponent,
    GraphComponent,
    DailyBenefitsComponent,
    ReservationsComponent,
    ReusableUnitComponent,
    ResuableUnitServicesComponent,
    ReusablRentContractDuesComponent,
    ToolbarComponent,
    MessageModalComponent,
    InputComponent,
    FilterPipe,
    UploadFilesFormComponent,
    PerviewUploadedFilesComponent,
    LeafletMapComponent,
    TenantsNotificationComponent,
    PriceOffersNotificationComponent,
    UnitsNotificationComponent,
    RentContractsNotificationComponent,
    SalesBuyContractsNotificationComponent,
    MaintenanceContractsNotificationComponent,












  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    FlexLayoutModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    MultiSelectModule,
    MatDialogModule, MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FileUploadModule,
    MatMenuModule,
    LeafletModule,
    TabulatorModule,
    NgxSpinnerModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => { return new TranslateHttpLoader(http, './assets/i18n/', '.json'); },
          deps: [HttpClient]
        }
      }
    ),
  ],
  exports: [
    SidebarComponent,
    NavBarComponent,
    ColorPalletComponent,
    MetricsComponent,
    GraphComponent,
    DailyBenefitsComponent,
    ReservationsComponent,
    ReusableUnitComponent,
    ResuableUnitServicesComponent,
    ReusablRentContractDuesComponent,
    ToolbarComponent,
    TranslateModule,
    TabulatorModule,
    MessageModalComponent,
    InputComponent,
    FilterPipe,
    UploadFilesFormComponent,
    LeafletMapComponent,
    TenantsNotificationComponent,
    PriceOffersNotificationComponent,
    UnitsNotificationComponent,
    RentContractsNotificationComponent,
    SalesBuyContractsNotificationComponent,
    MaintenanceContractsNotificationComponent







  ], providers: [TranslatePipe, FilterPipe,QuickModalService ,UploadFilesDialogService,DateCalculation,NgbCalendarIslamicUmalqura ,DatePipe  ]
})
export class SharedModule { }
