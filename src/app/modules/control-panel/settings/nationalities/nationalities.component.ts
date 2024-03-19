import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NationalityVM } from 'src/app/core/models/ViewModel/nationality-vm';
import { NationalityService } from 'src/app/core/services/backend-services/nationality.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Subscription} from 'rxjs'
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Nationality } from 'src/app/core/models/nationality';
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const PAGEID = 42; // from pages table in database seeding table
@Component({
  selector: 'app-nationalities',
  templateUrl: './nationalities.component.html',
  styleUrls: ['./nationalities.component.scss']
})
export class NationalitiesComponent implements OnInit,OnDestroy {
  changeNationalitiesFlag:number=0;
  NationalitiesForm!: FormGroup;
  Response!: ResponseResult<Nationality>;
  sub: any;
  url: any;
  addUrl: string = '/control-panel/settings/add-nationality';
  updateUrl: string = '/control-panel/settings/update-nationality/';
  listUrl: string = '/control-panel/settings/nationalities-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"component-names.list-nationalities",
    componentAdd: "component-names.add-nationality",
  };
//#region ngOnDestory
ngOnDestroy() {
  this.subsList.forEach((s) => {
    if (s) {
      s.unsubscribe();
    }
  });
}
//#endregion
  constructor( private router: Router,
    private translate:TranslatePipe,
    private sharedServices:SharedService,
    private rolesPerimssionsService:RolesPermissionsService,
    private alertsService:NotificationsAlertsService,
    private NationalityService: NationalityService,
    private spinner :NgxSpinnerService,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.NationalitiesForm = this.fb.group({
      id: 0,
      nationalityNameAr: NAME_REQUIRED_VALIDATORS,
      nationalityNameEn: NAME_REQUIRED_VALIDATORS,
    })
  }
  id: any = 0;
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();

     this.changePath();
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getNationalityById(this.id);
          this.sharedServices.changeButton({ action: 'Update',submitMode:false } as ToolbarData);
        }

      }else{
        this.sharedServices.changeButton({ action: 'SinglePage',submitMode:false } as ToolbarData);
      }
    })
  }

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
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      });
      return promise;

  }
//#endregion
  nationalities: NationalityVM[] = [];
  // saveNationality() {
  //   if(this.NationalitiesForm.valid)
  //   {
  //  this.spinner.show();
  //   if (this.id == 0) {

  //      this.NationalitiesForm.value.id = 0;
  //     this.NationalityService.addData("Insert",this.NationalitiesForm.value).subscribe(
  //       result => {
  //         if (result != null) {


  //         setTimeout(() => {
  //           this.showResponseMessage(
  //             result.success,
  //             AlertTypes.success,
  //             this.translate.transform("messages.add-success")
  //           );
  //           this.router.navigate([this.listUrl]);
  //           this.spinner.hide();
  //         },500);
  //         }
  //       },
  //       error => console.error(error))
  //   }
  //   else {
  //     ;
  //     this.NationalitiesForm.value.id = this.id;
  //     this.NationalityService.updateWithUrl("Update",this.NationalitiesForm.value).subscribe(
  //       result => {
  //         if (result != null) {
  //           setTimeout(() => {
  //             this.showResponseMessage(
  //               result.success,
  //               AlertTypes.success,
  //               this.translate.transform("messages.update-success")
  //             );
  //             this.router.navigate([this.listUrl]);
  //             this.spinner.hide();
  //           },500);
  //         }
  //       },
  //       error => console.error(error))
  //   }
  // }else{
  //   this.errorMessage = this.translate.transform("validation-messages.invalid-data");
  //     this.errorClass = 'errorMessage';
  //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
  //     return this.NationalitiesForm.markAllAsTouched();
  // }
  // }
  get f(): { [key: string]: AbstractControl } {
    return this.NationalitiesForm.controls;
  }
  errorMessage='';
  errorClass='';
  getNationalityById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.NationalityService.getByIdWithUrl("GetById?id="+id).subscribe({
        next: (res: any) => {
          this.NationalitiesForm.setValue({
            id: res.data.id,
            nationalityNameAr: res.data.nationalityNameAr,
            nationalityNameEn: res.data.nationalityNameEn,
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
             this.router.navigate([this.addUrl]);
           } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
             this.onSave();
           } else if (currentBtn.action == ToolbarActions.New) {
             this.NationalitiesForm.reset();
             this.toolbarPathData.componentAdd = this.translate.transform("component-names.add-nationality");
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
    if (this.NationalitiesForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      const promise = new Promise<void>((resolve, reject) => {
        this.NationalityService.addWithUrl(
          "Insert",
          this.NationalitiesForm.value
        ).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result };

            if(result.success && !result.isFound)
            {
            // this.store.dispatch(nationa.actions.insert({
            //   data: JSON.parse(JSON.stringify({ ...result.data }))
            // }));
            //this.defineDistrictForm();
            this.changeNationalitiesFlag++;

            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                this.Response.success,
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
            this.spinner.hide();
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
      return this.NationalitiesForm.markAllAsTouched();
    }
  }
  onUpdate() {
    if (this.NationalitiesForm.valid) {
      this.NationalitiesForm.value.id = this.id;
      const promise = new Promise<void>((resolve, reject) => {
        this.NationalityService.updateWithUrl("Update", this.NationalitiesForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result.response };
               if(result.success &&!result.isFound)
               {


            // this.store.dispatch(RegionActions.actions.update({
            //   data: JSON.parse(JSON.stringify({ ...result.data }))
            // }));
            this.changeNationalitiesFlag++;
           // this.defineRegionForm();

            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.update-success")
              );
             // navigateUrl(this.listUrl, this.router);
            },500);
          }else if(result.isFound){
            this.spinner.hide();
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          },
         error: (err: any) => {
            this.spinner.hide();
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
      return this.NationalitiesForm.markAllAsTouched();
    }
  }
}
