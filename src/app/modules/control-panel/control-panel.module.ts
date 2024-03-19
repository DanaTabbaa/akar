import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelComponent } from './control-panel.component';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { ReusableUnitComponent } from '../../shared/components/control-panel-components/reusable-unit/reusable-unit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QuillModule } from 'ngx-quill';
import { SharedService } from 'src/app/shared/services/shared.service';

import{Subscription}from 'rxjs'
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
//import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';








@NgModule({
  declarations: [
    ControlPanelComponent,
    DashboardComponent,
    
  ],
  imports: [
    CommonModule,
    ControlPanelRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    QuillModule.forRoot(),


  ],
  providers:[/*ManagerService*/]
})
export class ControlPanelModule {


  lang: string = '';
  constructor(
    private translateService: TranslateService,
    private sharedServices: SharedService,
    //private managerService:ManagerService
  ) {
    this.lang = localStorage.getItem('language')!;
    localStorage.setItem("attachments","ids=0");
    this.listenToLanguageChange();
    //managerService.load();
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
