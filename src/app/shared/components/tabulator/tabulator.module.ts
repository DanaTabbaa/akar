import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DraggableMenuItemsComponent } from './draggable-menu-items/draggable-menu-items.component';
import { TabulatorSettingComponent } from './tabulator-setting/tabulator-setting.component';
import { TabulatorComponent } from './tabulator/tabulator.component';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { stringIsNullOrEmpty } from 'src/app/helper/helper';
import { HttpClient } from '@angular/common/http';
@NgModule({
    declarations: [TabulatorComponent, TabulatorSettingComponent, DraggableMenuItemsComponent],
    imports: [FormsModule, CommonModule,
        TranslateModule.forChild(
            {
              loader: {
                provide: TranslateLoader,
                useFactory: (TranslateLoader),
                deps: [HttpClient]
              },
            }
          )],
    exports: [TabulatorComponent],
    providers:[TranslatePipe]
})
export class TabulatorModule {
    lang: string = '';
    constructor(
      private translateService: TranslateService,
      private sharedServices: SharedService,
      //private managerService:ManagerService
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