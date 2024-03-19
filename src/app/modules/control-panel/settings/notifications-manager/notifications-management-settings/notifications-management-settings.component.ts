import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AlertTypes,
  convertEnumToArray,
  NotificationsEvents,
  NotificationsEventsAr,
  ToolbarActions,
} from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Building } from 'src/app/core/models/buildings';
import { NotificationsManagementSettings } from 'src/app/core/models/notifications-manager/notifications-management-settings';
import { Owner } from 'src/app/core/models/owners';
import { Tenants } from 'src/app/core/models/tenants';
import { BuildingsService } from 'src/app/core/services/backend-services/buildings.service';
import { OwnersService } from 'src/app/core/services/backend-services/owners.service';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { SettingMenuShowOptions } from 'src/app/core/view-models/setting-menu-show-options';
import { Subscription } from 'rxjs';
import { getCurrentUrl } from 'src/app/core/helpers/helper';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/app/core/services/backend-services/notifications-manager/notifications.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { reloadPage } from 'src/app/core/helpers/router-helper';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsManagementViewModel } from 'src/app/core/models/ViewModel/notifications-manager/notifiactions-management-view-model';
import { NotificationsLogsService } from 'src/app/core/services/backend-services/notifications-manager/notifications-logs.service';
import {
  NotificationsManagementLogs,
  VwNotificationManagementLogs,
} from 'src/app/core/models/notifications-manager/notifications-logs';
import { BuildingSelectors } from 'src/app/core/stores/selectors/building.selectors';
import { BuildingsModel } from 'src/app/core/stores/store.model.ts/buildings.store.model';
import { OwnerSelectors } from 'src/app/core/stores/selectors/owners.selectors';
import { OwnersModel } from 'src/app/core/stores/store.model.ts/owner.store.model';
import { Store } from '@ngrx/store';
import { TenantsSelectors } from 'src/app/core/stores/selectors/tenant.selectors';
import { TenantModel } from 'src/app/core/stores/store.model.ts/tenants.store.model';
import Delta from 'quill-delta';
import { QuillEditorComponent } from 'ngx-quill';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
const MESSAGE_MAX_LENGTH = 700;
const PAGEID = 44; // from pages table in database seeding table
@Component({
  selector: 'app-notifications-management-settings',
  templateUrl: './notifications-management-settings.component.html',
  styleUrls: ['./notifications-management-settings.component.scss'],
})
export class NotificationsManagementSettingsComponent
  implements OnInit, AfterViewInit {
  //#region Main Declarations
  NotificationForm!: FormGroup;
  dropdownSettings = {};
  ownersListSelected: Owner[] = [];
  MessageBody!: any;
  contentError: boolean = true;
  tenantsListSelected: Tenants[] = [];
  buildingsListSelected: Building[] = [];
  contentSize: number = 700;
  tenantsList: Tenants[] = [];
  ownersList: Owner[] = [];
  buildingsList: Building[] = [];
  lang = 'ar';
  submited: boolean = false;
  notificationObject!: NotificationsManagementViewModel;
  Response!: ResponseResult<NotificationsManagementSettings>;
  notificatrions: NotificationsManagementSettings[] = [];
  notificatonsLogsList: VwNotificationManagementLogs[] = [];
  currentAction: string = '';
  addUrl: string = '/control-panel/settings/notifications-management-settings';
  updateUrl: string = '/control-panel/settings/update-notification/';
  listUrl: string = '/control-panel/settings/notifications-management-settings';
  toolbarPathData: ToolbarPath = {
    pageId:PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: 'component-names.list-notifications-settings',
    componentAdd: '',
  };
  //#endregion main variables declarationss

  //#region Constructor

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnersService,
    private buildingsService: BuildingsService,
    private tenantsService: TenantsService,
    private sharedServices: SharedService,
    private rolesPerimssionsService: RolesPermissionsService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private alertsService: NotificationsAlertsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private spinner: NgxSpinnerService,
    private store: Store<any>,
    private notificationsLogsService: NotificationsLogsService
  ) {
    this.defineNotificationForm();
    this.notificationObject = new NotificationsManagementViewModel();
  }

  @ViewChild('quillEditor', { static: false }) editor?: QuillEditorComponent;
  onInsertText(text) {
    const cursorPosition = this.editor?.quillEditor.getSelection().index;

    const clipboardDelta = this.editor?.quillEditor.clipboard.convert(text);

    const delta = new Delta().retain(cursorPosition).concat(clipboardDelta);

    //(('delte', delta);

    this.editor?.quillEditor.updateContents(delta, 'user');
  }
  ngAfterViewInit(): void {
    // this.listenToClickedButton();
  }

  onSelectText(value) {
    if (value == 1) {
      this.onInsertText('@ContractId@');
    } else if (value == 2) {
      this.onInsertText('@EndContractDate@');
    } else if (value == 3) {
      this.onInsertText('@DueEndDate@');
    } else if (value == 4) {
      this.onInsertText('@OwnerName@');
    } else if (value == 5) {
      this.onInsertText('@TenantName@');
    } else if (value == 6) {
      this.onInsertText('@UnitName@');
    } else if (value == 7) {
      this.onInsertText('@TotalContractAmount@');
    } else if (value == 8) {
      this.onInsertText('@BuildingName@');
    } else if (value == 9) {
      this.onInsertText('@RemainingPeriod@');
    } else if (value == 10) {
      this.onInsertText('@RemainDueAmount@');
    } else if (value == 11) {
      this.onInsertText('@DuePeriod@');
    }
  }
  //#endregion
  //#region Form Group

  defineNotificationForm() {
    this.NotificationForm = this.fb.group({
      id: 0,
      eventId: [1, Validators.compose([Validators.required])],
      period: '',
      receiverCheckId: 1,
      ownersIds: '',
      tenantsIds: '',
      buildingsIds: '',
      isWhatsApp: '',
      isEmail: ['', Validators.compose([Validators.required])],
      isSms: '',
      sender: ['', Validators.compose([Validators.required])],
      subject: ['', Validators.compose([Validators.required])],
      notificationBody: '',
      emailBody: '',
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.NotificationForm.controls;
  }
  //#endregion
  //#region ngOnInit
  sub: any;
  id: any;
  url: any;
  activeTab;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['activeTabId'] == 2 ?? false) {
        this.activeTab = Number(params['activeTabId']);
        this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
      }
      if (params['activeTabId'] == 1 ?? false) {
        this.activeTab = Number(params['activeTabId']);
        this.sharedServices.changeButton({ action: 'Save' } as ToolbarData);
      }
    });

    this.getPagePermissions(PAGEID);
    // this.sharedServices.changeButton({ action: 'List' } as ToolbarData);
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.getLanguage();
    this.loadDataByOwner();
    this.listenToClickedButton();
    this.defineGridColumn();

    this.sub = this.route.params.subscribe((params) => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.getNotificationById(this.id);
        }
        this.url = this.router.url.split('/')[2];
      }
    });
  }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }

  //#region Permissions
  rolePermission!: RolesPermissionsVm;
  userPermissions!: UserPermission;
  getPagePermissions(pageId) {
    const promise = new Promise<void>((resolve, reject) => {
      this.rolesPerimssionsService
        .getAll('GetPagePermissionById?pageId=' + pageId)
        .subscribe({
          next: (res: any) => {
            this.rolePermission = JSON.parse(JSON.stringify(res.data));
            this.userPermissions = JSON.parse(
              this.rolePermission.permissionJson
            );
            this.sharedServices.setUserPermissions(this.userPermissions);
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
    });
    return promise;
  }
  //#endregion
  //#endregion
  //#region ngOnDestroy
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  //#endregion
  //#region Toolbar Service
  subsList: Subscription[] = [];
  currentUrl;

  getCurrentUrl() {
    this.currentUrl = getCurrentUrl();
  }
  currentBtn!: string;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          this.currentAction = currentBtn.action;
          if (currentBtn.action == ToolbarActions.List) {
            this.activeTabId = 2;
            this.router.navigateByUrl(this.listUrl + '?activeTabId=2');
          } else if (
            currentBtn.action == ToolbarActions.Save &&
            currentBtn.submitMode
          ) {
            this.onSubmit();
          } else if (
            currentBtn.action == ToolbarActions.Update &&
            currentBtn.submitMode
          ) {
            this.onUpdate();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.activeTabId = 1;
            this.router.navigateByUrl(this.addUrl + '?activeTabId=1');
            this.resetLists();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  //#endregion

  //#region Authentications
  //
  //
  //#endregion

  //#region Manage State
  //#endregion

  //#region Permissions
  //
  //#endregion

  //#region Basic Data
  ///Geting form dropdown list data
  notificationsEvents: ICustomEnum[] = [];
  loadDataByOwner(ownerId?: any) {
    this.getNotificationsEvents();
    this.getTenants();
    this.getBuildings();
    this.getOwners();
    this.getNotifications();
    this.getNotificationsLogs();
  }
  getNotificationsEvents() {
    if (this.lang == 'en') {
      this.notificationsEvents = convertEnumToArray(NotificationsEvents);
    }
    else {
      this.notificationsEvents = convertEnumToArray(NotificationsEventsAr);

    }
  }
  getNotificationsLogs() {
    const promise = new Promise<void>((resolve, reject) => {
      this.notificationsLogsService.getAll('GetAll').subscribe({
        next: (res: any) => {
          this.notificatonsLogsList = res.data.map(
            (res: VwNotificationManagementLogs[]) => {
              return res;
            }
          );
          resolve();
          //(('res', res);
          //((' notificatonsLogsList', this.notificatonsLogsList);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
    return promise;
  }
  onSelectMessageInformation() {
    this.activeTabId = 1;
    // this.sharedServices.changeButton({action:'Save',submitMode:false}as ToolbarData);
  }
  getTenants() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store
        .select(TenantsSelectors.selectors.getListSelector)
        .subscribe({
          next: (res: TenantModel) => {
            this.tenantsList = JSON.parse(JSON.stringify(res.list));
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }
  getOwners() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store
        .select(OwnerSelectors.selectors.getListSelector)
        .subscribe({
          next: (res: OwnersModel) => {
            this.ownersList = JSON.parse(JSON.stringify(res.list));
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }
  getBuildings() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store
        .select(BuildingSelectors.selectors.getListSelector)
        .subscribe({
          next: (res: BuildingsModel) => {
            this.buildingsList = JSON.parse(JSON.stringify(res.list));
            resolve();
          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => { },
        });
      this.subsList.push(sub);
    });
  }
  ownerDataChanged(event: any[]) {
    // here comes the object as parameter
    // if (event.length>0) {
    //   this.ownersListSlected = [];
    //   this.ownersListSlected = event;
    // }
  }
  //#endregion
  errorMessage = '';
  errorClass = '';
  //#region CRUD Operations
  onSelectReceiver(value) {
    //(("onSelectReceiver",value);
    if (value == 1) {
      this.tenantsListSelected = [];
      this.buildingsListSelected = [];
    } else if (value == 2) {
      this.ownersListSelected = [];
      this.buildingsListSelected = [];
    } else if (value == 3) {
      this.ownersListSelected = [];
      this.tenantsListSelected = [];
    }
  }
  onSubmit() {
    this.submited = true;
    if (this.NotificationForm.valid) {
      this.NotificationForm.value.id = 0;
      this.spinner.show();
      this.notificationObject.notificationsSetting = {
        ...this.NotificationForm.value,
      };
      if (this.ownersListSelected.length > 0) {
        this.notificationObject.ownersSelectedList = this.ownersListSelected;
        this.notificationObject.notificationsSetting.ownersIds =
          this.prepareIdsToSave(this.ownersListSelected);
      }
      if (this.tenantsList.length > 0) {
        this.notificationObject.tenantsSelectedList = this.tenantsListSelected;
        this.notificationObject.notificationsSetting.tenantsIds =
          this.prepareIdsToSave(this.tenantsListSelected);
      }
      if (this.buildingsList.length > 0) {
        this.notificationObject.notificationsSetting.buildingsIds =
          this.prepareIdsToSave(this.buildingsListSelected);
      }

      //(('notificationObject', this.notificationObject);
      this.notificationService
        .addData('Insert', this.notificationObject)
        .subscribe((result) => {
          this.Response = { ...result.response };
          this.submited = false;
          setTimeout(() => {
            this.spinner.hide();
            this.showResponseMessage(
              this.Response.success,
              AlertTypes.success,
              this.translate.transform('messages.add-success')
            );
            this.getNotifications();
            this.getNotificationsLogs();
            this.activeTabId = 2;
          },500);
          this.defineNotificationForm();

          this.resetLists();
          this.submited = false;
        });
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.NotificationForm.markAllAsTouched();
    }
  }
  setData() {
    this.notificationObject.notificationsSetting = {
      ...this.NotificationForm.value,
    };
    if (this.ownersListSelected.length > 0) {
      this.notificationObject.ownersSelectedList = this.ownersListSelected;
      this.notificationObject.notificationsSetting.ownersIds =
        this.prepareIdsToSave(this.ownersListSelected);
    }
    if (this.tenantsList.length > 0) {
      this.notificationObject.tenantsSelectedList = this.tenantsListSelected;
      this.notificationObject.notificationsSetting.tenantsIds =
        this.prepareIdsToSave(this.tenantsListSelected);
    }
    if (this.buildingsList.length > 0) {
      this.notificationObject.notificationsSetting.buildingsIds =
        this.prepareIdsToSave(this.buildingsListSelected);
    }
  }
  onUpdate() {
    this.submited = true;

    if (this.NotificationForm.valid) {
      this.NotificationForm.value.id = this.id;
      this.spinner.show();
      this.setData();
      //(('notificationObject', this.notificationObject);
      this.notificationService
        .updateWithUrl('Update', this.notificationObject)
        .subscribe((result) => {
          this.Response = { ...result };
          this.submited = false;
          setTimeout(() => {
            this.spinner.hide();
            this.showResponseMessage(
              this.Response.success,
              AlertTypes.success,
              this.translate.transform('messages.update-success')
            );
            this.getNotifications();
            this.getNotificationsLogs();
            this.activeTabId = 2;
          },500);
          this.defineNotificationForm();

          this.resetLists();
          this.submited = false;
        });
    } else {
      this.errorMessage = this.translate.transform(
        'validation-messages.invalid-data'
      );
      this.errorClass = 'errorMessage';
      this.alertsService.showError(
        this.errorMessage,
        this.translate.transform('message-title.wrong')
      );
      return this.NotificationForm.markAllAsTouched();
    }
  }
  getNotifications() {
    this.activeTabId = 2;
    return new Promise<void>((resolve, reject) => {
      this.notificationService.getAll('GetAll').subscribe({
        next: (res: any) => {
          if (res.data != null) {
            this.notificationList = res.data.map(
              (res: NotificationsManagementSettings[]) => {
                return res;
              }
            );
            if (this.notificationList.length == 0) {
              this.notificationList = [];
            }
            resolve();
            //(('notificationList', this.notificationList);
          }
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
  }
  activeTabId = 1;

  getNotificationById(id: any) {
    this.activeTabId = 1;
    this.sharedServices.changeButton({
      action: 'Update',
      submitMode: false,
    } as ToolbarData);
    const promise = new Promise<void>((resolve, reject) => {
      this.notificationService.getByIdWithUrl('GetById?id=' + id).subscribe({
        next: (res: any) => {
          let result = res.data;
          if (result != null) {
            //(('res.data get by id', result.data);
            if (result.receiverCheckId == 1) {
              this.getSelectedDataFromList(
                result.ownersIds,
                result.receiverCheckId
              );
            } else if (result.receiverCheckId == 2) {
              this.getSelectedDataFromList(
                result.tenantsIds,
                result.receiverCheckId
              );
            } else if (result.receiverCheckId == 3) {
              this.getSelectedDataFromList(
                result.buildingsIds,
                result.receiverCheckId
              );
            }
            //load all form data
            this.NotificationForm.patchValue({ ...res.data });
            console.log('this.NotificationForm', this.NotificationForm.value);
          }
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => { },
      });
    });
    return promise;
  }
  edit(id) {
    this.sharedServices.changeButton({
      action: 'Update',
      submitMode: false,
    } as ToolbarData);
    this.router.navigateByUrl(this.updateUrl + id);
  }

  //#endregion

  //#region Helper Functions
  stringOfIds: string = '';
  prepareIdsToSave(list: any[]) {
    this.stringOfIds = '';
    if (list != undefined && list.length > 0) {
      list.forEach((element) => {
        if (element != undefined) {
          this.stringOfIds += element.id.toString() + ',';
        }
      });
      this.stringOfIds = this.stringOfIds.slice(0, this.stringOfIds.length - 1);
      return this.stringOfIds;
    }
    return '';
  }

  resetLists() {
    this.ownersListSelected = [];
    this.tenantsListSelected = [];
    this.buildingsListSelected = [];
  }

  resetForm() {
    this.defineNotificationForm();
    this.resetLists();
  }
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        message,
        this.translate.transform('messageTitle.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        message,
        this.translate.transform('messageTitle.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        message,
        this.translate.transform('messageTitle.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        message,
        this.translate.transform('messageTitle.error')
      );
    }
  }
  showConfirmDeleteMessage(id: number) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('buttons.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then((rs) => {
      //((rs);
      if (rs == 'Confirm') {
        this.spinner.show();
        this.notificationService
          .deleteWithUrl('Delete?id=' + id)
          .subscribe((resonse) => {
            this.getNotifications();
            this.getNotificationsLogs();

            setTimeout(() => {
              if (resonse.success == true) {
                this.showResponseMessage(
                  resonse.success,
                  AlertTypes.success,
                  this.translate.transform('messages.delete-success')
                );
              } else if (resonse.success == false) {
                this.showResponseMessage(
                  resonse.success,
                  AlertTypes.error,
                  this.translate.transform('messages.delete-faild')
                );
              }
              this.spinner.hide();
            },500);
          });
      }
    });
  }

  getSelectedDataFromList(ids: string, listTypeFlag: number) {
    var spiltedIds: string[] = [];
    if (ids != '' && ids != null) {
      this.resetLists();
      spiltedIds = ids.split(',');
      for (var i = 0; i <= spiltedIds.length - 1; i++) {
        if (listTypeFlag == 1) {
          this.ownersListSelected.push(
            this.ownersList.find((x) => x?.id == parseInt(spiltedIds[i]))!
          );
        } else if (listTypeFlag == 2) {
          this.tenantsListSelected.push(
            this.tenantsList.find((x) => x.id == parseInt(spiltedIds[i]))!
          );
        } else if (listTypeFlag == 3) {
          {
            this.buildingsListSelected.push(
              this.buildingsList.find((x) => x.id == parseInt(spiltedIds[i]))!
            );
          }
        }
      }
    }
  }

  setMessageText(quillText, quillHtml) {
    this.NotificationForm.value.notificationBody = quillText;
    this.NotificationForm.value.emailBody = quillHtml;
  }

  //#region Text Editor
  maxLengthmainTextText(e) {
    //(('Quil Event', e);
    // //(('quillEditor', e.editor.getLength());
    let size = 700;
    if (e.editor.getLength() > 700) {
      e.editor.deleteText(700, e.editor.getLength());
      this.contentError = false;
    } else {
      this.contentError = true;
      this.contentSize = size - e.editor.getLength();
      // message body format for sending to email and whatsapp & sms
      this.setMessageText(e.text, e.text);
    }
  }
  QuillContent;
  textChanged($event) {
    if ($event.editor.getLength() > MESSAGE_MAX_LENGTH) {
      $event.editor.deleteText(MESSAGE_MAX_LENGTH, $event.editor.getLength());
      this.contentError = true;
    }
  }
  //#endregion

  //#region Tabulator
  notificationList: NotificationsManagementSettings[] = [];
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  columnNames: any[] = [];
  defineGridColumn() {
    this.sharedServices.getLanguage().subscribe((res) => {
      this.lang = res;
      this.columnNames = [
        {
          title: this.lang == 'en' ? 'Notification Id' : ' الرقم',
          field: 'notificationId',
        },
        this.lang == 'en'
          ? { title: 'Event Type', field: 'eventTypeEn' }
          : { title: 'الحدث', field: 'eventTypeAr' },
        this.lang == 'en'
          ? { title: 'Notification Type', field: 'notificationTypeEn' }
          : { title: 'نوع التنبيه', field: 'notificationTypeAr' },
        this.lang == 'en'
          ? { title: 'Sender', field: 'sender' }
          : { title: 'المرسل', field: 'sender' },
        this.lang == 'en'
          ? { title: 'Subject', field: 'subject' }
          : { title: 'العنوان', field: 'subject' },
        this.lang == 'en'
          ? { title: 'Reciever Name', field: 'recieverNameEn' }
          : { title: 'المرسل إليه', field: 'recieverNameAr' },
        this.lang == 'en'
          ? { title: 'Reciever Mobile', field: 'recieverMobileEn' }
          : { title: ' الجوال', field: 'recieverMobileAr' },
        this.lang == 'en'
          ? { title: 'Reciever Email', field: 'recieverEmailEn' }
          : { title: ' البريد الإلكتروني', field: 'recieverEmailAr' },
        this.lang == 'en'
          ? { title: 'Send Text', field: 'sendTextEn' }
          : { title: ' نص الرسالة', field: 'sendTextAr' },
        this.lang == 'en'
          ? { title: 'Sent Status', field: 'sentStatusEn' }
          : { title: ' نص الرسالة', field: 'sentStatusAr' },
      ];
    });
  }

  menuOptions: SettingMenuShowOptions = {
    showDelete: true,
    showEdit: true,
  };

  direction: string = 'ltr';
  openAddBuilding() { }

  onMenuActionSelected(e: any) {
    //(('onMenuActionSelected', e);
  }

  onSearchTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'ownerNameAR', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }
  onChange() {
    this.activeTabId = 1;
  }
  //#endregion

  openNotificatonsLogsList() { }
  delete(id: any) {
    if (this.userPermissions.isDelete) {
      this.showConfirmDeleteMessage(id);
    } else {
      this.showResponseMessage(
        true,
        AlertTypes.warning,
        this.translate.transform('permissions.permission-denied')
      );
    }
  }
}

interface INotificationEvents {
  id: number;
  nameAr: string;
  nameEn: string;
}
