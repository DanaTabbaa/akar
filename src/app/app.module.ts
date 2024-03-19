import { HttpClient, HttpHandler } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlPanelStore } from './core/stores/control-panel.store';
import { HttpClientModule } from '@angular/common/http';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigService } from './core/services/local-services/app-config.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BaseComponent } from './modules/base/base.component';
import { DialogComponent } from './modules/web-site/dialog/dialog.component';





export function initilaizeApp(appConfig: AppConfigService) {
  return () => appConfig.loadConfig()

}

@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    
    
  ],
  imports: [
    BrowserModule,
    NgMultiSelectDropDownModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot(ControlPanelStore),
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 20000, // 15 seconds
      closeButton: true,
      progressBar: true,
    }),

  ],
  providers: [

    AppConfigService,

    {
      provide: APP_INITIALIZER,
      useFactory: initilaizeApp,
      deps: [AppConfigService], multi: true,
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {


}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
