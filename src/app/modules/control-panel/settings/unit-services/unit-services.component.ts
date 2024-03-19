import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {  AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { UnitServices } from 'src/app/core/models/unit-services';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { UnitServicesService } from 'src/app/core/services/backend-services/unit-services.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID=36; // from pages table in database seeding table
@Component({
  selector: 'app-unit-services',
  templateUrl: './unit-services.component.html',
  styleUrls: ['./unit-services.component.scss']
})
export class UnitServicesComponent implements OnInit, OnDestroy {

  //properties
  changeUnitServicesFlag:number=0;
  unitServicesForm!: FormGroup;
  sub: any;
  url: any;
  unitServices: UnitServices[] = [];
  id: any = 0;
  subsList: Subscription[] = [];
  submited: boolean = false;
  errorMessage = '';
  errorClass = '';
  Response!: ResponseResult<UnitServices>;
  unitServicesObj!: UnitServices;

  addUrl: string = '/control-panel/settings/add-unit-service';
  updateUrl: string = '/control-panel/settings/update-unit-service/';
  listUrl: string = '/control-panel/settings/unit-services-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"menu.unit-services",
    componentAdd: '',
  };

  //
  //constructor

  constructor(private router: Router,
    private UnitServicesService: UnitServicesService,
    private fb: FormBuilder, private route: ActivatedRoute,
    private sharedServices: SharedService,
    private spinner:NgxSpinnerService,
    private rolesPerimssionsService:RolesPermissionsService,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,



  ) {
    this.createUnitServicesForm();
  }
  createUnitServicesForm() {
    this.unitServicesForm = this.fb.group({
      id: 0,
      unitServiceArName: REQUIRED_VALIDATORS,
      unitServiceEnName: REQUIRED_VALIDATORS,

    })
  }
  //
  //oninit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getUnitServiceById(this.id);
          this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);

        }

      }else{
        this.sharedServices.changeButton({ action: 'SinglePage', submitMode: false } as ToolbarData);

      }

    })

  }
  //
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  //methods
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

  onSave() {


    if (this.unitServicesForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      this.unitServicesForm.value.id=0;
        this.UnitServicesService.addData(
          'Insert',
          this.unitServicesForm.value
        ).subscribe((result) => {
         if(result.message&&!result.isFound)
         {
          this.spinner.show();

          this.showResponseMessage(
            true,AlertTypes.success
            ,
            this.translate.transform('messages.add-success')
            );
          this.unitServicesForm.reset();
          this.createUnitServicesForm();

          setTimeout(() => {
            this.navigateUrl(this.listUrl);
            this.spinner.hide();
          }, 500);
        }else if(result.isFound)
        {
          this.spinner.hide();
          this.showResponseMessage(
            result.success,
            AlertTypes.warning,
            this.translate.transform("messages.record-exsiting")
          );
        }
        },err=>{
          this.spinner.hide();
        });
      } else {
        this.sharedServices.changeButtonStatus({button:'Save',disabled:false})
        this.spinner.hide();
        this.errorMessage = this.translate.transform("validation-messages.invalid-data");
        this.errorClass = 'errorMessage';
        this.alertsService.showError(this.errorMessage,  this.translate.transform("message-title.wrong"));
        return this.unitServicesForm.markAllAsTouched();
      }

  }

  onUpdate() {
    if (this.unitServicesForm.valid) {
      this.unitServicesForm.value.id = this.id;
      const promise = new Promise<void>((resolve, reject) => {
        this.UnitServicesService.updateWithUrl("Update", this.unitServicesForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();
            this.Response = { ...result.response };
               if(result.success &&!result.isFound)
               {
                this.spinner.show();


            this.changeUnitServicesFlag++;
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
      this.spinner.hide();
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.unitServicesForm.markAllAsTouched();
    }
  }

  // saveUnitService() {
  //   this.spinner.show();
  //   if (this.id == 0) {

  //     //(("unitServicesForm", this.unitServicesForm.value)

  //     this.UnitServicesService.addRequest(this.unitServicesForm.value).subscribe(
  //       result => {
  //         if (result != null) {

  //           this.router.navigate(['/control-panel/settings/unit-services-list']);
  //           setTimeout(() => {
  //             this.spinner.hide();
  //           },500);


  //         }
  //       },

  //       error =>{
  //         this.spinner.hide();
  //       })


  //   }
  //   else {

  //     ;
  //     this.unitServicesForm.value.id = this.id;
  //     //(("this.unitServicesForm.value", this.unitServicesForm.value)
  //     this.UnitServicesService.update(this.unitServicesForm.value).subscribe(
  //       result => {
  //         if (result != null) {

  //           this.router.navigate(['/control-panel/settings/unit-services-list']);
  //           setTimeout(() => {
  //             this.spinner.hide();
  //           },500);

  //         }
  //       },
  //       error => {
  //         this.spinner.hide();
  //       })
  //   }
  // }
  getUnitServiceById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.UnitServicesService.getByIdWithUrl("GetById?id="+id).subscribe({
        next: (res: any) => {

          //(("result data getbyid", res.data);
          this.unitServicesForm.setValue({
            id: res.data.id,
            unitServiceArName: res.data.unitServiceArName,
            unitServiceEnName: res.data.unitServiceEnName,
          });
          //(("this.unitServicesForm.value set value", this.unitServicesForm.value)

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
    return this.unitServicesForm.controls;
  }
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "unit-services.add-unit-service";
            this.createUnitServicesForm();
            this.router.navigate([this.addUrl]);
            this.sharedServices.changeToolbarPath(this.toolbarPathData);

          } else if (
            currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
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
}
