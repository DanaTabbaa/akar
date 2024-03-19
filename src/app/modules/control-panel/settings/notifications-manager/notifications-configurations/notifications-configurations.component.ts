import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AlertTypes,
  convertEnumToArray,
  ToolbarActions,
  WhatsAppProviders,
  WhatsAppProvidersAr,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { Subscription } from 'rxjs';
import { getCurrentUrl, navigateUrl } from 'src/app/core/helpers/helper';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { NotificationsConfigurationsService } from 'src/app/core/services/backend-services/notifications-manager/notifications-configurations.service';
import { NotificationsConfigurations } from 'src/app/core/models/notifications-manager/notifications-configurations';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { ToolbarButtonsAppearance } from 'src/app/core/interfaces/toolbar-buttons-appearance';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { NgxSpinnerService } from 'ngx-spinner';
import { reloadPage } from 'src/app/core/helpers/router-helper';
import { TranslatePipe } from '@ngx-translate/core';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const PAGEID=45; // from pages table in database seeding table
@Component({
  selector: 'app-notifications-configurations',
  templateUrl: './notifications-configurations.component.html',
  styleUrls: ['./notifications-configurations.component.scss'],
})
export class NotificationsConfigurationsComponent implements OnInit, OnDestroy {
  //#region Main Declarations
  lang: string = '';
  NotConfigurationsForm!: FormGroup;
  activeTap = 1;
  WhatsAppProviders: ICustomEnum[] = [];
  notConfigurationsObject!: NotificationsConfigurations;
  Response!: ResponseResult<NotificationsConfigurations>;
  notConfigurationsList: NotificationsConfigurations[] = [];
  showToolbarButtonsObj!: ToolbarButtonsAppearance;
  currnetUrl;
  addUrl: string = '/control-panel/definitions/add-notifications-configurations';
  updateUrl: string ='/control-panel/definitions/update-notifications-configurations/';
  listUrl: string = '/control-panel/definitions/notifications-configurations-list';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"component-names.list-notifications-configurations",
    componentAdd: "component-names.add-notification-configuration",
  };
  //#endregion main variables declarationss

  //#region Constructor

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rolesPerimssionsService:RolesPermissionsService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private spinner:NgxSpinnerService,
    private sharedServices: SharedService,
    private notConfigurationsService: NotificationsConfigurationsService,
    private translate:TranslatePipe,

  ) {
    this.defineNotificationForm();

  }

  //#endregion

  defineNotificationForm() {
    this.NotConfigurationsForm = this.fb.group({
      id: 0,
      sentTime: '',
      repeatNumber: '',
      dayBetweenSent: '',
      email: REQUIRED_VALIDATORS,
      emailPassword: REQUIRED_VALIDATORS,
      dispalyName: REQUIRED_VALIDATORS,
      hostName: REQUIRED_VALIDATORS,
      portNumber: REQUIRED_VALIDATORS,
      smsUrl: '',
      smsUserName: '',
      smsPassword: '',
      smsMessage: '',
      smsMobile: '',
      smsSender: '',
      smsUrlCredit: '',
      isEmail: '',
      isSms: '',
      isWhatsApp: '',
      isEndContract: '',
      numberDayEndContract: '',
      isPaymentDate: '',
      numberDayPaymentDate: '',
      isContractCreated: '',
      isReceiptVoucherCreated: '',
      isOwner: '',
      isTenant: '',
      whatsAppTwilioInstanceId: '',
      whatsAppAccountSid: '',
      whatsAppAuthToken: '',
      whatsAppTwilioToken: '',
      whatsAppProviderId: 1,
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.NotConfigurationsForm.controls;
  }
  sub: any;
  url: any;
  id:any;
  //#endregion
  //#region ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.loadData();
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getNotConfigurationsById(this.id);
          this.sharedServices.changeButton({ action: 'Update',submitMode:false } as ToolbarData);
        }
        this.url = this.router.url.split('/')[2];
      }
    })
  }
  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion

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


  //#region Toolbar Service
   //#region Toolbar
   subsList: Subscription[] = [];
   currentBtnResult;
   listenToClickedButton() {
     let sub = this.sharedServices.getClickedbutton().subscribe({
       next: (currentBtn: ToolbarData) => {
         currentBtn;

         if (currentBtn != null) {
           if (currentBtn.action == ToolbarActions.List) {
            this.onUpdateSelect=false;
           } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode ) {
             this.onSave();
           } else if (currentBtn.action == ToolbarActions.New) {
             this.toolbarPathData.componentAdd = "component-names.add-notification-configuration";
             this.defineNotificationForm();
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

   //#endregion
  //#endregion
  //#region Manage State
  //#endregion

  //#region Permissions
  checkUserPermissions() {}
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  loadData() {
   this.sharedServices.changeButton({action:'Disactive'} as ToolbarData);
    this.listenToClickedButton();
    this.changePath();
    this.getLanguage();
    this.getWhatsAppPorviders();
    this.getNotificationsConfigurations();

  }
  getLanguage()
  {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getWhatsAppPorviders() {
    if(this.lang=='en')
    {
    this.WhatsAppProviders = convertEnumToArray(WhatsAppProviders);
    }
    else
    {
      this.WhatsAppProviders = convertEnumToArray(WhatsAppProvidersAr);

    }
  }

  isConfigurationsCreated: boolean = false;
  getNotificationsConfigurations() {

    const promise = new Promise<void>((resolve, reject) => {

      this.notConfigurationsService.getAll("GetAll").subscribe({

        next: (res: any) => {
          if (res.data != null) {
            this.notConfigurationsList = res.data.map(
              (res: NotificationsConfigurations[]) => {
                return res;
              }
            );
            if (this.notConfigurationsList.length == 0) {
              this.notConfigurationsList = [];
              this.isConfigurationsCreated = false;
              this.sharedServices.changeButton({action:'New'}as ToolbarData)
            } else {
              this.isConfigurationsCreated = true;
            }
            resolve();

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
  //#endregion

  //#region CRUD Operations
  errorMessage = '';
  errorClass = '';
  submited: boolean = false;


  onSave()
  {

    if(this.notConfigurationsList.length==0 && this.NotConfigurationsForm.value!=null){
    if (this.NotConfigurationsForm.valid) {
      this.NotConfigurationsForm.value.Id=0;
      const promise = new Promise<void>((resolve, reject) => {
        this.notConfigurationsService.addData("Insert",this.NotConfigurationsForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();

            this.Response = { ...result.response };
            this.defineNotificationForm();
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                this.Response.success,
                AlertTypes.success,
                this.translate.transform("messages.add-success")
              );
             this.getNotificationsConfigurations();
             this.sharedServices.changeButton({ action: 'List' } as ToolbarData);

            }, 500);
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

    }else
    {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.NotConfigurationsForm.markAllAsTouched();
    }
  }else{
    this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.NotConfigurationsForm.markAllAsTouched();
  }
  }
  onUpdate()
  {

    if (this.NotConfigurationsForm.valid) {
      const promise = new Promise<void>((resolve, reject) => {
        this.notConfigurationsService.updateWithUrl("Update",this.NotConfigurationsForm.value).subscribe({
          next: (result: any) => {
            this.spinner.show();


            this.defineNotificationForm();
            this.submited = false;
            setTimeout(() => {
              this.spinner.hide();
              this.showResponseMessage(
                result.success,
                AlertTypes.success,
                this.translate.transform("messages.update-success")
              );
              this.onUpdateSelect=false;
             this.getNotificationsConfigurations();
             this.sharedServices.changeButton({ action: 'List' } as ToolbarData);

            }, 500);
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

    }else
    {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.NotConfigurationsForm.markAllAsTouched();
    }
  }
  active = 1;
  onUpdateSelect:boolean=false
  getNotConfigurationsById(id: any) {
    this.active = 1;
    this.onUpdateSelect=true;
    this.sharedServices.changeButton({action: 'Update'} as ToolbarData);
    const promise = new Promise<void>((resolve, reject) => {
      this.notConfigurationsService.getByIdWithUrl("GetById?id="+id).subscribe({
        next: (res: any) => {
          let result = res.data;
          if (result != null) {


            //load all form data
            this.NotConfigurationsForm.setValue({ ...result });

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

  //#endregion

  //#region Helper Functions
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
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform('messages.confirm-delete');
    modalRef.componentInstance.title = this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {

      if (rs == 'Confirm') {
        this.spinner.show();
        this.notConfigurationsService.deleteWithUrl("Delete?id="+id).subscribe((resonse) => {
          this.getNotificationsConfigurations();
          setTimeout(() => {
            if (resonse.success == true) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.success,
               this.translate.transform("messages.update-success")
              );
            } else if (resonse.success == false) {
              this.showResponseMessage(
                resonse.success,
                AlertTypes.error,
                this.translate.transform("messages.update-failed")
              );
            }
            this.spinner.hide();
          },500);

        });
      }
    });
  }

  delete(id: any) {
    if(this.userPermissions.isDelete)
    {
      this.showConfirmDeleteMessage(id);
    }
    else{
      this.showResponseMessage(true,AlertTypes.warning,this.translate.transform("permissions.permission-denied"))

    }

  }


  //#endregion
}
