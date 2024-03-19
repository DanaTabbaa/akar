import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { SystemSettings } from 'src/app/core/models/system-settings';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SystemSettingActions } from 'src/app/core/stores/actions/system-setting.actions';
import { Store } from '@ngrx/store';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
const PAGEID = 33; // from pages table in database seeding table

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit, OnDestroy {
  //properties
  systemSettingsForm!: FormGroup;
  id: any = 0;
  submited: boolean = false;
  Response!: ResponseResult<SystemSettings>;
  sub: any;
  url: any;
  subsList: Subscription[] = [];

 // addUrl: string = '/control-panel/settings/system-settings';
  // updateUrl: string = '/control-panel/settings/update-nationality/';
  // listUrl: string = '/control-panel/settings/nationalities-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: '',
    addPath: '',
    componentList: "menu.system-settings",
    componentAdd: "system-settings.system-setting",
  };
  //
  //constructor
  constructor(private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private SystemSettingsService: SystemSettingsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private store: Store<any>,
    private router:Router,
    private spinner:NgxSpinnerService
  ) {

    this.defineSystemSettings();
  }
  //
  defineSystemSettings() {
    this.systemSettingsForm = this.fb.group({
      id: 0,
      showDecimalPoint: false,
      showThousandsComma: false,
      showRoundingFractions: false,
      numberOfFraction: 0,
      numberOfIdentityNo:''

    })
  }
  //ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);
    this.changePath();
    this.getSystemSettings()
  }
  //

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
        next: (res: any) => {
          this.rolePermission = JSON.parse(JSON.stringify(res.data));
          this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
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
  //
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
  //methods
  saveSystemSettings() {

    if (this.systemSettingsForm.value.id == null) {
      this.systemSettingsForm.value.id = 0;
    }
    this.SystemSettingsService.uploadWithUrl("InsertOrUpdate",this.systemSettingsForm.value).subscribe(
      result => {
        if (result != null) {
           
          //this.Response = { ...result };
          ;
          this.showResponseMessage(result.success, AlertTypes.success, this.translate.transform("messages.update-success"));

          if (this.id == 0) {
            this.store.dispatch(SystemSettingActions.actions.insert({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
          }
          else if (this.id > 0) {
            this.store.dispatch(SystemSettingActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...result.data }))
            }));
          }
          ;
          this.systemSettingsForm.reset();
          this.submited = false;
          this.getSystemSettings()


        }
      },
      error => console.error(error))

      this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);
      this.changePath();

  }

  getSystemSettings() {
   this.spinner.show();
    const promise = new Promise<void>((resolve, reject) => {
      this.SystemSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          ;
          if (res.data != null) {
           this.spinner.hide();
            this.systemSettingsForm.patchValue({
              id: res.data[0].id,
              showDecimalPoint: res?.data[0]?.showDecimalPoint == 1 ? true : false,
              showThousandsComma: res?.data[0]?.showThousandsComma == 1 ? true : false,
              showRoundingFractions: res?.data[0]?.showRoundingFractions == 1 ? true : false,
              numberOfFraction: res?.data[0]?.numberOfFraction > 0 && res.data[0].numberOfFraction != null ? res.data[0].numberOfFraction : 0,
              numberOfIdentityNo: res?.data[0]?.numberOfIdentityNo > 0 && res.data[0].numberOfIdentityNo != null ? res.data[0].numberOfIdentityNo : 0,

            });
            this.id = res.data[0].id;
          }
          else {
            this.defineSystemSettings();
          }
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
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform('messages.done'));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform('messages.alert'));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform('messages.info'));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform('messages.error'));
    }
  }
  enableNumberOfFraction(event: any) {
    if (event.target.checked) {
      this.systemSettingsForm.controls['numberOfFraction'].enable();
    }
    else {
      this.systemSettingsForm.controls['numberOfFraction'].disable();

    }

  }
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            // this.sharedServices.changeToolbarPath({
            //   listPath: this.listUrl,
            // } as ToolbarPath);
            // this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.saveSystemSettings();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);

          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.saveSystemSettings();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }


}
