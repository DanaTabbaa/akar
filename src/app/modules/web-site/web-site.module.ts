
 // import ngx-translate and the http loader


//import { NgxPaginationModule } from 'npm i ngx-pagination';

import { WebSiteComponent } from "./web-site.component";
import { WebSiteRoutingModule } from "./web-site-routing.module";
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { LoginComponent } from "./login/login.Component";
import { HomeComponent } from "./home/home.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { ProductDetailsComponent } from "./product-details/product-details.Component";
import { PropertyListingComponent } from "./property-listing/property-listing.Component";
import { RecentlyAddedComponent } from "./recently-added/recently-added.component";
import { ViewMapComponent } from "./view-map/view-map.component";

import { ResetPasswordComponent } from './security/reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSpinnerModule } from "ngx-spinner";
import { TranslateLoader, TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { MapComponent } from './map/map.component';
import { OpportuityMapPopupComponent } from './opportuity-map-popup/opportuity-map-popup.component';
import { FullDateModule } from "src/app/shared/components/date/full-date/full-date.module";
import { NgImageSliderModule } from 'ng-image-slider';
import { OpportunityDetails1Component } from './opportunity-details1/opportunity-details1.component';
import { OpportunityDetails2Component } from './opportunity-details2/opportunity-details2.component';
import { SpecicalOpportunitiesComponent } from './specical-opportunities/specical-opportunities.component';
import { OffersOpportunitiesComponent } from './offers-opportunities/offers-opportunities.component';
import { OpportunityDetails3Component } from './opportunity-details3/opportunity-details3.component';

import { OpportunityDetails4Component } from './opportunity-details4/opportunity-details4.component';


import { CarouselModule } from 'ngx-owl-carousel-o';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
//import { ManagerService } from "src/app/core/services/backend-services/manager.service";
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';

import { OtpInputComponentComponent } from './otp-input-component/otp-input-component.component';


// import material components
import { MatSliderModule } from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductMapComponent } from "./product-map/product-map.component";
import { MatDialogModule} from '@angular/material/dialog';
import { AddPropertyDialogComponent } from './add-property-dialog/add-property-dialog.component';
import { DndDirective } from './dnd.directive';


@NgModule({
  imports: [
    //  TranslateModule.forChild({
    //    loader: {
    //        provide: TranslateLoader,
    //        useFactory: HttpLoaderFactory,
    //        deps: [HttpClient]
    //    }
    //   }),
    //   TranslateModule.forRoot(
    //     {
    //       loader: {
    //         provide: TranslateLoader,
    //         useFactory: (http:HttpClient) => { return new TranslateHttpLoader(http,'./assets/i18n/','.json'); },
    //         deps: [HttpClient]
    //     }
    //     }
    //   ),
    //  FormsModule,

      MatSliderModule,
      MatRadioModule,
      MatButtonToggleModule,
      MatIconModule,
      MatInputModule,
      MatFormFieldModule,
      MatCheckboxModule,
      MatDialogModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
     ReactiveFormsModule,
     NgSelectModule,
     NgxSpinnerModule,
     SharedModule,
     FormsModule,
     FullDateModule,
     NgImageSliderModule,
     


  //   NgxPaginationModule,
  HttpClientModule,
  CarouselModule,
    CommonModule, WebSiteRoutingModule],
  declarations: [WebSiteComponent, SearchBarComponent,FooterComponent,LoginComponent,HeaderComponent,HomeComponent,
    AboutUsComponent,ContactUsComponent,ProductDetailsComponent,PropertyListingComponent,RecentlyAddedComponent,
    ViewMapComponent, ResetPasswordComponent, MapComponent, OpportuityMapPopupComponent, OpportunityDetails1Component, 
    OpportunityDetails2Component, SpecicalOpportunitiesComponent, OffersOpportunitiesComponent, OpportunityDetails3Component,
    OpportunityDetails4Component,
    ForgetPasswordComponent,
    OtpInputComponentComponent,ProductMapComponent, AddPropertyDialogComponent, DndDirective]
  ,providers :[TranslatePipe,DateConverterService/*ManagerService*/]
})
export class WebSiteModule {}

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }
