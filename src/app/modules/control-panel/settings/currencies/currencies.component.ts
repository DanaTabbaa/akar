import { Component, EventEmitter, OnDestroy, OnInit,Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Currencies } from 'src/app/core/models/currencies';
import { CurrenciesService } from 'src/app/core/services/backend-services/currencies.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import{Subscription} from 'rxjs'
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { CurrenciesListComponent } from './currencies-list/currencies-list.component';
import { CurrenciesActions } from 'src/app/core/stores/actions/currencies.actions';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { Store } from '@ngrx/store';
const PAGEID=43; // from pages table in database seeding table

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit,OnDestroy {
 //properties


 CurrenciesForm!: FormGroup;
 changeCurrencyFlag:number = 0;
 sub: any;
 Currencies :Currencies[]=[];
 id: number=0;
 currnetUrl;
  addUrl: string = '/control-panel/settings/add-currency';
  updateUrl: string = '/control-panel/settings/update-currency/';
  listUrl: string = '/control-panel/settings/currencies-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"component-names.list-currencies",
    componentAdd: "component-names.add-currency",
  };
  errorMessage = '';
  errorClass = '';
 ///
  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
 //Constructor
 constructor( private router: Router,
   private CurrenciesService: CurrenciesService,
   private rolesPerimssionsService:RolesPermissionsService,
   private sharedServices:SharedService,
   private translate:TranslatePipe,
   private alertsService: NotificationsAlertsService,
   private spinner: NgxSpinnerService,
   private store: Store<any>,
   private fb: FormBuilder, private route: ActivatedRoute) {
    this.createCurrencyForm()
 }
 //
 //onInit
 ngOnInit(): void {
   ;
  this.getPagePermissions(PAGEID)
  this.listenToClickedButton();

  this.changePath();
   this.sub = this.route.params.subscribe(params => {
     if (params['id'] != null) {
       this.id = +params['id'];
       if (this.id > 0) {
         this.getCurrencyById(this.id);
         this.sharedServices.changeButton({ action: 'Update',submitMode:false } as ToolbarData);
       }
     }else{
      this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
     }
   })
 }
 //


//#region Permissions
rolePermission!:RolesPermissionsVm;
userPermissions!:UserPermission;
getPagePermissions(pageId)
{
  const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId="+pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
           this.userPermissions=JSON.parse(this.rolePermission.permissionJson);
           this.sharedServices.setUserPermissions(this.userPermissions);
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;

}
//#endregion
 createCurrencyForm()
 {
  this.CurrenciesForm = this.fb.group({
    id: 0,
    currencyNameAr: NAME_REQUIRED_VALIDATORS,
    currencyNameEn: NAME_REQUIRED_VALIDATORS
  });
 }
 saveCurrency() {
  if(this.CurrenciesForm.valid)
  {
    this.spinner.show();
   if (this.id == 0) {
    let sub = this.CurrenciesService.addWithUrl("Insert",this.CurrenciesForm.value).subscribe(
       result => {
         if (result != null) {
          if(result.success && !result.isFound)
          {
          setTimeout(() => {
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              this.translate.transform("messages.add-success")
            );
            this.changeCurrencyFlag++;

          //  this.router.navigate([this.listUrl]);
            this.spinner.hide();
          }, 500);

         }else if(result.isFound)
         {
           this.spinner.hide();
           this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
           this.showResponseMessage(
             result.success,
             AlertTypes.warning,
             this.translate.transform("messages.record-exsiting")
           );
            this.router.navigate([this.addUrl]);

         }
        }
       },
       error => console.error(error));
       this.subsList.push(sub);
   }
   else {

    //  this.CurrenciesForm.value.id = this.id;
    //  this.CurrenciesService.updateWithUrl("Update",this.CurrenciesForm.value).subscribe(
    //    result => {
    //      if (result != null) {
    //      if(result.success&&!result.isFound){


    //       setTimeout(() => {
    //         this.showResponseMessage(
    //           result.success,
    //           AlertTypes.success,
    //           this.translate.transform("messages.update-success")
    //         );
    //         this.changeCurrencyFlag++;
    //         //this.router.navigate([this.listUrl]);
    //         this.spinner.hide();
    //       }, 500);

    //      }else if(result.success){

    //      }
    //     }
    //    },
    //    error => console.error(error))
   }
   //this.childComponent.getCurrencies();

  }else{
    this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.CurrenciesForm.markAllAsTouched();
  }
 }

 onUpdate() {
  if (this.CurrenciesForm.valid) {
    this.CurrenciesForm.value.id = this.id;
    const promise = new Promise<void>((resolve, reject) => {
      this.CurrenciesService.updateWithUrl("Update", this.CurrenciesForm.value).subscribe({
        next: (result: any) => {
          this.spinner.show();

           if(result.success&&!result.isFound)
           {


          this.store.dispatch(CurrenciesActions.actions.update({
            data: JSON.parse(JSON.stringify({ ...result.data }))
          }));
          this.changeCurrencyFlag++;
         // this.createCurrencyForm();

          setTimeout(() => {
            this.spinner.hide();
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              this.translate.transform("messages.update-success")
            );
            navigateUrl(this.addUrl, this.router);
          },500);
        }else if(result.isFound)
        {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
          this.showResponseMessage(
            result.success,
            AlertTypes.warning,
            this.translate.transform("messages.record-exsiting")
          );
           this.router.navigate([this.addUrl]);
        }
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;
  }

  else {
    this.errorMessage = this.translate.transform("validation-messages.invalid-data");
    this.errorClass = 'errorMessage';
    this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    return this.CurrenciesForm.markAllAsTouched();
  }
}
 get f(): { [key: string]: AbstractControl } {
  return this.CurrenciesForm.controls;
}
currencies
getCurrencies() {

  const promise = new Promise<void>((resolve, reject) => {
    this.CurrenciesService.getAll("GetAll").subscribe({
      next: (res: any) => {
        this.currencies = res.data.map((res: Currencies[]) => {
          return res
        });
        resolve();
        //(("res", res);
        //((" this.currencies", this.currencies);
      },
      error: (err: any) => {
        reject(err);
      },
      complete: () => {

      },
    });
  });

  return promise;


}
 getCurrencyById(id: any) {
   const promise = new Promise<void>((resolve, reject) => {
     this.CurrenciesService.getByIdWithUrl("GetById?id="+id).subscribe({
       next: (res: any) => {


         this.CurrenciesForm.setValue({
           id: res.data.id,
           currencyNameAr: res.data.currencyNameAr,
           currencyNameEn: res.data.currencyNameEn,
         });

       },
       error: (err: any) => {
         reject(err);
       },
       complete: () => {

       },
     });
   });
   return promise;
 }
   //#region Tabulator
   subsList: Subscription[] = [];
   currentBtnResult;
   listenToClickedButton() {
     let sub = this.sharedServices.getClickedbutton().subscribe({
       next: (currentBtn: ToolbarData) => {
         currentBtn;
         if (currentBtn != null) {
           if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
             this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
           } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
             this.saveCurrency();
           } else if (currentBtn.action == ToolbarActions.New) {

             this.toolbarPathData.componentAdd = this.translate.transform("component-names.add-currency");
             this.createCurrencyForm();
             this.sharedServices.changeToolbarPath(this.toolbarPathData);

           } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
             this.onUpdate();
           }
         }
       },
     });
     this.subsList.push(sub);
   }
   changePath() {
     this.sharedServices.changeToolbarPath(this.toolbarPathData);
   }
   showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }

   //#endregion
}
