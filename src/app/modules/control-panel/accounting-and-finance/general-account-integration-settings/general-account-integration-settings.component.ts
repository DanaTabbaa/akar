import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AccIntegrationTypeArEnum, AccIntegrationTypeEnum, AlertTypes, ConnectionTypeEnum, convertEnumToArray, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { GeneralIntegrationSettings } from 'src/app/core/models/general-integration-settings';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { GeneralIntegrationSettingsService } from 'src/app/core/services/backend-services/general-integration-settings';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
const PAGEID = 1017;
@Component({
  selector: 'app-general-account-integration-settings',
  templateUrl: './general-account-integration-settings.component.html',
  styleUrls: ['./general-account-integration-settings.component.scss']
})
export class GeneralAccountIntegrationSettingsComponent implements OnInit , OnDestroy {


  addUrl: string = '/control-panel/accounting/acc-settings';
  updateUrl: string = '/control-panel/accounting/acc-settings/';
  listUrl: string = '/control-panel/accounting/acc-settings';
  accountIntegrationForm!: FormGroup;
  accIntegrationTypes: ICustomEnum[] = [];
  connectionTypes: ICustomEnum[] = [];
  subsList: Subscription[] = [];
  
  lang: string = "ar";
  regId: any = 0;
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "component-names.general-integration-settings",
    componentAdd: 'component-names.general-integration-settings',

  };
  constructor(
    private fb: FormBuilder,
    private managerService: ManagerService,
    private sharedServices: SharedService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private generalIntegrationSettingsService: GeneralIntegrationSettingsService,
    private alertsService: NotificationsAlertsService,
    private router:Router) {
    this.createForm();
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('language')!;
    this.getAccConnectionTypes();
    this.getAccIntegrationTypes();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadPagePermissions(PAGEID),      
    ]).then(a => {
      
      this.managerService.loadGeneralAccountIntegrationSetting().then(settings=>{
        this.spinner.hide();
        if(settings)
        {
        
          this.accountIntegrationForm.patchValue({...settings});
          this.sharedServices.changeButton({ action: 'Update', submitMode: false } as ToolbarData);

        }else
        {
          this.sharedServices.changeButton({ action: 'New' } as ToolbarData);
        }

      }).catch(e=>{
        this.spinner.hide();
      });
      //this.getCurrentAccountIntegrationSetting();
      this.changePath();
      this.listenToClickedButton();
     
     })
      .catch(e => {
        this.spinner.hide();
       
      });
  }

 
  createForm() {
    this.accountIntegrationForm = this.fb.group({
      dbName: ['',],
      authType: ['',],
      sqlUserName: ['',],
      sqlPassword: ['',],
      accIntegrationType: ['',],
      serverName: ['',]
    });
  }

  getAccIntegrationTypes() {
    if (this.lang == 'en') {
      this.accIntegrationTypes = convertEnumToArray(AccIntegrationTypeEnum);
    }
    else {
      this.accIntegrationTypes = convertEnumToArray(AccIntegrationTypeArEnum);
    }
  }

  getAccConnectionTypes() {
    if (this.lang == 'en') {
      this.connectionTypes = convertEnumToArray(ConnectionTypeEnum);
    }
    else {
      this.connectionTypes = convertEnumToArray(ConnectionTypeEnum);
    }
  }

  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe({
       next:( res) => {
          this.lang = res;
          resolve();
        }, error:(err) => {
          resolve();
        }
      });
      this.subsList.push(sub);
    });

  }

  checkConnection() {
    this.spinner.show();
    let sub = this.generalIntegrationSettingsService.post("CheckConnection", this.accountIntegrationForm.value).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.showResponseMessage(res.success, AlertTypes.success, this.translate.transform("messages.connection-succes"))
        }
        else {
          this.showResponseMessage(res.success, AlertTypes.error, this.translate.transform("messages.connection-fail"))
        }
      },
      error: (err) => {
        this.spinner.hide();
      },
      complete: () => { }
    });

    this.subsList.push(sub);
  }


  // getCurrentAccountIntegrationSetting() {
 
  //   let sub = this.generalIntegrationSettingsService.getWithResponse<GeneralIntegrationSettings>("GetCurrentSetting").subscribe({
  //     next: (res) => {
  //        
  //       this.spinner.hide();
  //       if (res.success ) {
  //         if(res.data)
  //         {
            
  //           this.accountIntegrationForm.patchValue({ ...res.data });
  //         }else
  //         {
            
  //         }     
  //       }
  //       else
  //       {
          
  //         this.showResponseMessage(res.success, AlertTypes.error, this.translate.transform("messages.get-general-configuration-error"));
  //       }

  //     },
  //     error: (err) => {
        
  //       this.spinner.hide();
  //     },
  //     complete: () => { }
  //   });

  //   this.subsList.push(sub);
  // }


 


  syncAccountData() {
    this.spinner.show();
    let sub = this.generalIntegrationSettingsService.getWithResponseNormal("SyncAccountData?ownerId=" + this.regId).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.showResponseMessage(res.success, AlertTypes.success, this.translate.transform("messages.sync-acc-success"))
        }
        else {
          this.showResponseMessage(res.success, AlertTypes.error, this.translate.transform("messages." + res.message))
        }

      },
      error: (err) => {
        this.spinner.hide();
      },
      complete: () => { }
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

  onSave(){
    this.spinner.show();
    this.confirmSave().then(a=>{
      this.spinner.hide();
    });
  }
  onUpdate(){
    this.onSave();
  }

  confirmSave(){
    return new Promise<void>((resolve, reject)=>{
      let sub = this.generalIntegrationSettingsService.addWithResponse<GeneralIntegrationSettings>("AddOrUpdate", this.accountIntegrationForm.value).subscribe({
        next: (result: ResponseResult<GeneralIntegrationSettings>) => {
          resolve();
          if (result.success && !result.isFound) {

            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            this.accountIntegrationForm.patchValue({...result.data})
            navigateUrl(this.listUrl, this.router);
          } else if (result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages.add-failed")
            );
          }
        },
        error: (error) => {
          this.showResponseMessage(
            false,
            AlertTypes.error,
            this.translate.transform("messages.connection-error")
          );
          resolve();
          console.error(error)
        }

      });
      this.subsList.push(sub);
    });

  }


  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {

            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.general-integration-settings";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.ownerForm.reset();
            this.router.navigate([this.addUrl]);
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

  ngOnDestroy(): void {
    this.subsList.forEach(s=>{
      if(s){
        s.unsubscribe();
      }
    });
  }

}
