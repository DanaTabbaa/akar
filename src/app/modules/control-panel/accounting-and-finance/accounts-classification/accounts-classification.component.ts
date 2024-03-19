import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { AccountsClassification } from 'src/app/core/models/accounts-classification';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { AccountsClassificationService } from 'src/app/core/services/backend-services/accounts-classification.service';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 62;

@Component({
  selector: 'app-accounts-classification',
  templateUrl: './accounts-classification.component.html',
  styleUrls: ['./accounts-classification.component.scss']
})
export class AccountsClassificationComponent implements OnInit, OnDestroy {
  //properties
  errorMessage = '';
  errorClass = ''
  submited: boolean = false;
  accountClassificationForm!: FormGroup;
  Response!: ResponseResult<AccountsClassification>;

  sub: any;
  url: any;
  accountsClassification: AccountsClassification[] = [];
  id: any = 0;
  subsList: Subscription[] = [];
  addUrl: string = '/control-panel/accounting/add-account-classification';
  updateUrl: string = '/control-panel/accounting/update-accountification/';
  listUrl: string = '/control-panel/accounting/accounts-classification-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "sidebar.accounts-classification",
    componentAdd: '',
  };

  //
  //constructor
  constructor(private router: Router,
    private AccountsClassificationService: AccountsClassificationService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private store: Store<any>,
    private alertsService: NotificationsAlertsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.createAccountClassificationForm();

  }
  ///

  createAccountClassificationForm() {
    this.accountClassificationForm = this.fb.group({
      id: 0,
      classificationArName: REQUIRED_VALIDATORS,
      classificationEnName: REQUIRED_VALIDATORS

    })
  }
  //oninit
  ngOnInit(): void {

    localStorage.setItem("PageId",PAGEID.toString());
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedService.changeButton({ action: 'Save', submitMode: false } as ToolbarData);
    this.sub = this.route.params.subscribe(params => {

      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId",params["id"]);
          this.getAccountClassificationById(this.id);
          this.sharedService.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
        }


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
    localStorage.removeItem("PageId");
     localStorage.removeItem("RecordId");
  }
  //
  //methods
  onSave() {
    this.spinner.show();
     this.submited = true;
     if (this.accountClassificationForm.valid) {
       this.accountClassificationForm.value.id = 0;
       this.AccountsClassificationService.addData(
         'Insert',
         this.accountClassificationForm.value
       ).subscribe((result) => {
         ;
         this.Response = { ...result };
         console.log("result.data",this.Response)
        //  this.store.dispatch(AccountClassificationActions.actions.insert({
        //    data: JSON.parse(JSON.stringify({ ...result.response.data }))
        //  }));
         this.showResponseMessage(
           true,
           AlertTypes.success,
           this.translate.transform('messages.add-success')
         );
         this.accountClassificationForm.reset();
         this.createAccountClassificationForm();

           setTimeout(() => {
             this.navigateUrl(this.listUrl);
             this.spinner.hide();
           }, 500);

           this.submited = false;
         });
       } else {
         this.spinner.hide();
         this.errorMessage = this.translate.transform("validation-messages.invalid-data");
         this.errorClass = 'errorMessage';
         this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
         return this.accountClassificationForm.markAllAsTouched();
       }

   }

   onUpdate() {
     this.spinner.show();
     this.submited = true;
     if (this.accountClassificationForm.valid) {
     if (this.accountClassificationForm != null) {
       this.accountClassificationForm.value.id=this.id;
       this.AccountsClassificationService.updateWithUrl("Update",this.accountClassificationForm.value).subscribe(
         (result) => {
           if (result != null) {
             this.showResponseMessage(
               true,
               AlertTypes.success,
               this.translate.transform('messages.update-success')
             );

             setTimeout(() => {
               this.navigateUrl(this.listUrl);
               this.spinner.hide();
             },500);
           }
         },
         (error) =>
         {
           this.spinner.hide();
         }
       );
     }
   }
   else {
     this.spinner.hide();
     this.errorMessage = this.translate.transform("validation-messages.invalid-data");
     this.errorClass = 'errorMessage';
     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
     return this.accountClassificationForm.markAllAsTouched();
   }
   }
   navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  // saveAccountClassification() {
  //   if (this.id == 0) {
  //     this.AccountsClassificationService.addRequest(this.accountClassificationForm.value).subscribe(
  //       result => {
  //         if (result != null) {

  //           this.router.navigate(['/control-panel/accounting/accounts-classification-list']);

  //         }
  //       },
  //       error => console.error(error))

  //   }
  //   else {
  //     this.accountClassificationForm.value.id = this.id;
  //     this.AccountsClassificationService.update(this.accountClassificationForm.value).subscribe(
  //       result => {
  //         if (result != null) {

  //           this.router.navigate(['/control-panel/accounting/accounts-classification-list']);

  //         }
  //       },
  //       error => console.error(error))
  //   }
  // }
  getAccountClassificationById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.AccountsClassificationService.getByIdWithUrl("GetById?id="+id).subscribe({
        next: (res: any) => {
          this.accountClassificationForm.setValue({
            id: res.data.id,
            classificationArName: res.data.classificationArName,
            classificationEnName: res.data.classificationEnName,

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


  //


  get f(): { [key: string]: AbstractControl } {
    return this.accountClassificationForm.controls;
  }
//#region Permissions
rolePermission!: RolesPermissionsVm;
userPermissions!: UserPermission;
getPagePermissions(pageId) {
  const promise = new Promise<void>((resolve, reject) => {
    this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
      next: (res: any) => {
        this.rolePermission = JSON.parse(JSON.stringify(res.data));
        this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
        this.sharedService.setUserPermissions(this.userPermissions);
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
//

  listenToClickedButton() {
    let sub = this.sharedService.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedService.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "accounts-classification.add-account-classification";
            this.createAccountClassificationForm();
            this.router.navigate([this.addUrl]);
            this.sharedService.changeToolbarPath(this.toolbarPathData);
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
    ;
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning==alertType) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info==alertType) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error==alertType) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }

}
