import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserManagerComponent } from './permissions/user-manager/user-manager.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRegisterationRequestComponent } from './user-registeration-request/user-registeration-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsRoutingModule } from '../settings/settings-routing.module';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Subscription} from 'rxjs'
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { FullDateModule } from 'src/app/shared/components/date/full-date/full-date.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserPermissionsComponent } from './permissions/user-permissions/user-permissions.component';
import { RolesPermissionsListComponent } from './permissions/roles-permissions-list/roles-permissions-list.component';
import { FilterPipe } from 'src/app/shared/piples/filter-pipe';
import { AddSubUsersComponent } from './permissions/user-manager/add-sub-users/add-sub-users.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ChangePasswordComponent } from './permissions/change-password/change-password.component';

import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
    declarations: [
        UserRegisterationRequestComponent,
        AdminPanelComponent,
        UserManagerComponent,
        UserPermissionsComponent,
        RolesPermissionsListComponent,
        AddSubUsersComponent,
        ChangePasswordComponent,

    ],
    imports: [
        AdminPanelRoutingModule,
        FormsModule,
        CommonModule,
        SharedModule,
        NgbNavModule,
        NgSelectModule,
        ReactiveFormsModule,
        NgbModule,
        FullDateModule,
        NgxSpinnerModule,
        MatSlideToggleModule,
        MatCheckboxModule


    ],providers:[DateConverterService,DatePipe,TranslatePipe ]
})
export class AdminPanelModule {
  lang: string = '';
  constructor(
    private translateService: TranslateService,
    private sharedServices: SharedService
  ) {
    this.lang = localStorage.getItem('language')!;
    this.listenToLanguageChange();
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
