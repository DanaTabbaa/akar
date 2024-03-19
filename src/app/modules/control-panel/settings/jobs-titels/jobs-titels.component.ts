import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { JobsTiltes } from 'src/app/core/models/jobs-titles';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { JobsTitlesService } from 'src/app/core/services/backend-services/jobs-titles.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID=41;//page id same company activity
@Component({
  selector: 'app-jobs-titels',
  templateUrl: './jobs-titels.component.html',
  styleUrls: ['./jobs-titels.component.scss']
})

export class JobsTitelsComponent implements OnInit {

   //properties
changeCompaniesActivityFlag:number=0;
jobsTiltesForm!: FormGroup;
sub: any;
jobsTiltes :JobsTiltes[]=[];
Response!: ResponseResult<JobsTiltes>;
id: number=0;
addUrl: string = '/control-panel/settings/add-job-title';
updateUrl: string = '/control-panel/settings/add-job-title/';
listUrl: string = '/control-panel/settings/add-job-title';
toolbarPathData: ToolbarPath = {
  listPath: '',
  updatePath: this.updateUrl,
  addPath: this.addUrl,
  componentList:"component-names.list-jobs-titles",
  componentAdd: "component-names.add-job-title",
};
///
//Constructor
constructor( private router: Router,
  private translate:TranslatePipe,
  private rolesPerimssionsService:RolesPermissionsService,
  private spinner:NgxSpinnerService,
  private sharedServices:SharedService,
  private jobTitlesSevice:JobsTitlesService,
  private store: Store<any>,
  private alertsService:NotificationsAlertsService,

  private fb: FormBuilder, private route: ActivatedRoute) {
  this.jobsTiltesForm = this.fb.group({
    id: 0,
    nameAr: NAME_REQUIRED_VALIDATORS,
    nameEn: NAME_REQUIRED_VALIDATORS,
    isActive:''
  })
}
//
//onInit
  ngOnInit(): void {
    localStorage.setItem("PageId",PAGEID.toString());
  this.getPagePermissions(PAGEID)
  this.listenToClickedButton();

  this.changePath();
  this.getCompanyActivities();
  this.sub = this.route.params.subscribe(params => {
    if (params['id'] != null) {
      this.id = +params['id'];
      if (this.id > 0) {
        this.getActivityById(this.id);
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
//#region ngOnDestory
ngOnDestroy() {
  this.subsList.forEach((s) => {
    if (s) {
      s.unsubscribe();
    }
  });
}
//#endregion
getCompanyActivities() {
  const promise = new Promise<void>((resolve, reject) => {
    this.jobTitlesSevice.getAll().subscribe({
      next: (res: any) => {
        this.jobsTiltes = res.data.map((res: JobsTiltes[]) => {
          return res
        });
        resolve();
        //(("res", res);
        //((" this.companyActivityForm", this.CompaniesActivitiesForm);
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

errorClass='';
errorMessage='';
getActivityById(id: any) {
  const promise = new Promise<void>((resolve, reject) => {
    this.jobTitlesSevice.getByIdWithUrl("GetById?id="+id).subscribe({
      next: (res: any) => {
        ;
        //(("result data getbyid", res.data);
        this.jobsTiltesForm.setValue({
          id: res.data.id,
          nameAr: res.data.activityNameAr,
          nameEn: res.data.activityNameEn,
        });
        //(("this.companyActivityForm.value set value", this.CompaniesActivitiesForm.value)
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
get f(): { [key: string]: AbstractControl } {
  return this.jobsTiltesForm.controls;
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
          this.router.navigate([this.addUrl]);
        } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
          this.onSave();
        } else if (currentBtn.action == ToolbarActions.New) {
          this.toolbarPathData.componentAdd = "component-names.add-job-title";
          this.sharedServices.changeToolbarPath(this.toolbarPathData);
          this.router.navigate([this.addUrl])
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
onSave() {
  if (this.jobsTiltesForm.valid) {
    this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
    const promise = new Promise<void>((resolve, reject) => {
      this.jobTitlesSevice.addWithUrl(
        'Insert',
        this.jobsTiltesForm.value
      ).subscribe({
        next: (result: any) => {
          this.spinner.show();


       //   this.defineCityForm();
       if(result.success && !result.isFound)
       {
        // this.store.dispatch(CompanyActivityActions.actions.insert({
        //   data: JSON.parse(JSON.stringify({ ...result.data }))
        // }));
       //this.defineDistrictForm();
       this.changeCompaniesActivityFlag++;

       setTimeout(() => {
         this.spinner.hide();
         this.showResponseMessage(
          result.success,
           AlertTypes.success,
           this.translate.transform("messages.add-success")
         );
         //navigateUrl(this.listUrl, this.router);
       },500);
     }else if(result.isFound)
     {
       this.spinner.hide();
       this.showResponseMessage(
         result.success,
         AlertTypes.warning,
         this.translate.transform("messages.record-exsiting")
       );

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

  } else {
    this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
    this.errorMessage = this.translate.transform("validation-messages.invalid-data");
    this.errorClass = 'errorMessage';
    this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    return this.jobsTiltesForm.markAllAsTouched();
  }
}
onUpdate() {
  if (this.jobsTiltesForm.valid) {
    this.jobsTiltesForm.value.id = this.id;
    const promise = new Promise<void>((resolve, reject) => {
      this.jobTitlesSevice.updateWithUrl("Update", this.jobsTiltesForm.value).subscribe({
        next: (result: any) => {
          this.spinner.show();
        //  this.response = { ...result.response };
             if(result.success&&!result.isFound)
             {
              // this.store.dispatch(CompanyActivityActions.actions.update({
              //   data: JSON.parse(JSON.stringify({ ...result.data }))
              // }));
              this.changeCompaniesActivityFlag++;


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
                this.showResponseMessage(
                  result.success,
                  AlertTypes.warning,
                  this.translate.transform("messages.record-exsiting")
                );

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
    return this.jobsTiltesForm.markAllAsTouched();
  }
}


}
