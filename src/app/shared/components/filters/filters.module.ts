import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltersComponent } from './filters.component';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';
// import { HijriDateModule } from '../date/hijri-date/hijri-date.module';
// import { GregorianDateModule } from '../date/gregorian-date/gregorian-date.module';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { RealestatesService } from 'src/app/core/services/backend-services/realestates.service';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { RegionsService } from 'src/app/core/services/backend-services/regions.service';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FullDateModule } from '../date/full-date/full-date.module';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';

@NgModule({
    declarations: [FiltersComponent],
    exports: [FiltersComponent],
    imports: [FormsModule,
        // HijriDateModule,
        // GregorianDateModule,
        FullDateModule,
        NgxSpinnerModule,
        NgSelectModule,
        NgbNavModule,
        TranslateModule,

        CommonModule, TranslateModule.forChild({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    ],
    providers: [BuildingsService, RealestatesService, TenantsService, RegionsService, UnitsService, DateConverterService,TranslatePipe]
})
export class FiltersModule {
    lang: string = '';
    constructor(
      private translateService: TranslateService,
      private sharedServices: SharedService,
     // private managerService:ManagerService
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
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}