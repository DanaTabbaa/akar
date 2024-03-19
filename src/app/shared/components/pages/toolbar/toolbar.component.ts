import { Component, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ButtonStatus, SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ToolbarButtonsAppearance } from 'src/app/core/interfaces/toolbar-buttons-appearance';
import { ObjectIsNotNullOrEmpty } from 'src/app/helper/helper';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { AlertTypes, PermissionType } from 'src/app/core/constants/enumrators/enums';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { UploadFilesDialogService } from 'src/app/shared/services/upload-files-dialog.service';
import { ContractSettingsRolePermissions } from 'src/app/core/models/contract-settings-role-permissions';
import { EntryTypeRolesPermissions } from 'src/app/core/models/entry-type-roles-permissions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy, AfterViewInit {
  userRoleId: any;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private sharedService: SharedService,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private uploadFileDialog: UploadFilesDialogService,
  ) {
    this.showToolbarButtonsObj = {} as ToolbarButtonsAppearance;
    this.rolesPermissions = JSON.parse(localStorage.getItem('USER_PERMISSIONS')!);
    this.userRoleId = localStorage.getItem('RoleId');
  }


  showButtons!: ToolbarButtonsAppearance;
  disabledList = false;
  disabledSave = false;
  disabledUpate = false;
  disabledNew = false;
  disabledCopy = false;
  disabledCancel = false;
  disabledExport = false;
  disabledPrint = false;
  disableIssue = false;
  disableRenew = false;
  disableView = false;
  disableChangePassword = false;
  disableCancelDefaultReport = false;
  lang:string="";


  rolesPermissions: RolesPermissionsVm[] = [];
  toolbarPathData!: ToolbarPath;
  toolbarData: ToolbarData = {} as ToolbarData;
  toolbarCompnentData: ToolbarData = {} as ToolbarData;
  substringUrl;
  showToolbarButtonsObj!: ToolbarButtonsAppearance;
  currentUrl;

  updateUrl;
  subsList: Subscription[] = [];
  currentBtn!: string;
  pagePermissions: RolesPermissionsVm = new RolesPermissionsVm();

  ngOnInit(): void {
    this.currentUrl = '';
    this.currentUrl = this.router.url;
    this.toolbarData.componentName = this.currentUrl;
    this.sharedService.changeButton(this.toolbarData);
    this.substringUrl = this.currentUrl
      .substring(this.currentUrl.lastIndexOf('/') + 1)
      .trim();
    this.updateUrl = this.currentUrl.replace(this.substringUrl, '');
    this.listenToUserPermission();
    this.listenToShowButton();
    this.listenToPathChange();
    this.listenClickedButton();
    this.listenToButtonStatus();
    this.listenToContractPermission();
    this.listenToEntryTypesRolePermission();
    this.listenToPermissionStatus();
    this.getLanguage();

  }
  getLanguage() {
    this.sharedService.getLanguage().subscribe(res => {
      this.lang = res
    })
  }



  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {

    });
  }

  //#region ngOnDestroy
  ngOnDestroy() {
    localStorage.removeItem('USER_PERMISSIONS')
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  listenToShowButton() {
    let sub = this.sharedService.getAppearanceButtons().subscribe({
      next: (showCurrentBtn: ToolbarButtonsAppearance) => {

        if (ObjectIsNotNullOrEmpty(showCurrentBtn)) {
          this.showButtons = showCurrentBtn;
          this.resetCLickedButtons();

        } else {
          this.resetShowButtons();
        }
      },
    });
    this.subsList.push(sub);
  }
  listenToButtonStatus() {
    let sub = this.sharedService.getButtonStatus().subscribe({
      next: (buttonStatus: ButtonStatus) => {

        if (ObjectIsNotNullOrEmpty(buttonStatus)) {
          if (buttonStatus.button == 'Save') {
            this.disabledSave = buttonStatus.disabled
          }
        }
      },
    });
    this.subsList.push(sub);
  }



  userPermissions!: UserPermission;
  listenToUserPermission() {
    let sub = this.sharedService.getUserPermissions().subscribe({
      next: (userPermissions: UserPermission) => {
        

        if (ObjectIsNotNullOrEmpty(userPermissions)) {
          this.userPermissions = userPermissions;
        }
      },
    });
    this.subsList.push(sub);
  }


  contractSettingsRolePermissions!: ContractSettingsRolePermissions;
  entryTypesRolePermissions!: EntryTypeRolesPermissions;
  permissionStatus: number = -1;
  listenToContractPermission() {
    let sub = this.sharedService.getContractPermissions().subscribe({
      next: (contractSettingsRolePermissions: ContractSettingsRolePermissions) => {

        if (ObjectIsNotNullOrEmpty(contractSettingsRolePermissions)) {
          this.contractSettingsRolePermissions = contractSettingsRolePermissions;
        }
      },
    });
    this.subsList.push(sub);
  }

  listenToPermissionStatus() {
    let sub = this.sharedService.getPermissionsStatus().subscribe({
      next: (status: { permissionStatus: number }) => {

        this.permissionStatus = status.permissionStatus;
        // 0 Mean Page Permission
        // 1 Mean Contract Permission
        // 2 Mean Entry Permission
        // 3 Mean Bill Permission  
      },
    });
    this.subsList.push(sub);
  }

  listenToEntryTypesRolePermission() {
    let sub = this.sharedService.getEntryTypePermissions().subscribe({
      next: (entryTypesPermissions: EntryTypeRolesPermissions) => {

        if (ObjectIsNotNullOrEmpty(entryTypesPermissions)) {
          this.entryTypesRolePermissions = entryTypesPermissions;
        }
      },
    });
    this.subsList.push(sub);
  }

  listenClickedButton() {

    let sub = this.sharedService.getClickedbutton().subscribe({
      next: (toolbarCompnentData: ToolbarData) => {

        if (ObjectIsNotNullOrEmpty(toolbarCompnentData)) {
          this.toolbarCompnentData = toolbarCompnentData;
          if (this.toolbarCompnentData.action == 'New') {
            this.checkButtonClicked('New');
          }
          if (this.toolbarCompnentData.action == 'List') {
            this.checkButtonClicked('List');
          }
          if (this.toolbarCompnentData.action == 'Update') {
            this.checkButtonClicked('Update');
          }
          if (this.toolbarCompnentData.action == 'Save') {

            this.checkButtonClicked('Save');
          } if (this.toolbarCompnentData.action == 'Disactive') {
            this.checkButtonClicked('Disactive')
          }

          if (this.toolbarCompnentData.action == 'Issue') {
            this.checkButtonClicked('Issue');
          }
          if (this.toolbarCompnentData.action == 'Renew') {
            this.checkButtonClicked('Renew');
          }
          if (this.toolbarCompnentData.action == 'Report') {
            this.checkButtonClicked('Report');
          }
          if (this.toolbarCompnentData.action == 'View') {
            this.checkButtonClicked('View');
          }
          if (this.toolbarCompnentData.action == 'CancelDefaultReport') {
            this.checkButtonClicked('CancelDefaultReport');
          }
          if (this.toolbarCompnentData.action == 'Index') {
            this.checkButtonClicked('Index');
          }
          if (this.toolbarCompnentData.action == 'NoIndex') {
            this.checkButtonClicked('NoIndex');
          } if (this.toolbarCompnentData.action == 'ChangePassword') {
            this.checkButtonClicked('ChangePassword');
          } if (this.toolbarCompnentData.action == 'NoAction') {
            this.checkButtonClicked('NoAction');
          } if (this.toolbarCompnentData.action == 'SinglePage') {
            this.checkButtonClicked('SinglePage');
          }
          //(('toolbarCompnentData', toolbarCompnentData);
        }
      },
    });
    this.subsList.push(sub);
  }
  listenToPathChange() {

    let sub = this.sharedService.getToolbarPath().subscribe({
      next: (toolbarPathData: ToolbarPath) => {

        

        this.toolbarPathData = toolbarPathData;

        if (ObjectIsNotNullOrEmpty(toolbarPathData)) {

          if (
            this.toolbarPathData.listPath == this.currentUrl &&
            this.toolbarCompnentData.action == 'List'

          ) {
            this.checkButtonClicked('List');
          } else if (
            this.toolbarPathData.addPath == this.currentUrl &&
            this.toolbarCompnentData.action == 'New'

          ) {
            this.checkButtonClicked('New');
          } else if (
            this.toolbarPathData.updatePath == this.updateUrl &&
            this.toolbarCompnentData.action == 'Update'

          ) {
            this.checkButtonClicked('Update');
          }

        }
      },
    });
    this.subsList.push(sub);
  }

  doSaveEvent() {
    

    if (this.permissionStatus == PermissionType.Contract) {
      if (this.contractSettingsRolePermissions) {
        let perm = JSON.parse(this.contractSettingsRolePermissions.permissionsJson);
        if (perm.isAdd ?? false) {
          this.checkButtonClicked('Save');
          this.toolbarData.submitMode = true;
          this.toolbarData.action = 'Save';
          this.sharedService.changeButton(this.toolbarData);
        } else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }

      }
    }
    else if (this.permissionStatus == PermissionType.Voucher) {
      if (this.entryTypesRolePermissions) {
        let perm = JSON.parse(this.entryTypesRolePermissions.permissionsJson);
        if (perm.isAdd ?? false) {
          this.checkButtonClicked('Save');
          this.toolbarData.submitMode = true;
          this.toolbarData.action = 'Save';
          this.sharedService.changeButton(this.toolbarData);
        } else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }

      }
    }
    else if (this.permissionStatus == PermissionType.Pages) {
      if ((this.userPermissions?.isAdd ?? false)) {

        this.checkButtonClicked('Save');
        this.toolbarData.submitMode = true;
        this.toolbarData.action = 'Save';
        this.sharedService.changeButton(this.toolbarData);
        //this.disabledSave=true;
      }
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
    }
  }
  doChangePasswordEvent() {
    if (this.userPermissions?.isAdd ?? false) {
      this.checkButtonClicked('ChangePassword');
      this.toolbarData.submitMode = true;
      this.toolbarData.action = 'ChangePassword';
      this.sharedService.changeButton(this.toolbarData);
    } else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
    }
  }
  doUpdateEvent() {
    if (this.permissionStatus == PermissionType.Contract) {
      if (this.contractSettingsRolePermissions) {
        let perm = JSON.parse(this.contractSettingsRolePermissions.permissionsJson);
        if (perm.isUpdate ?? false) {
          this.checkButtonClicked('Update');
          this.toolbarData.action = 'Update';
          this.toolbarData.submitMode = true;
          this.sharedService.changeButton(this.toolbarData);
        }
        else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }
      }
    }
    else if (this.permissionStatus == PermissionType.Voucher) {
      if (this.entryTypesRolePermissions) {
        let perm = JSON.parse(this.entryTypesRolePermissions.permissionsJson);
        if (perm.isUpdate ?? false) {
          this.checkButtonClicked('Update');
          this.toolbarData.action = 'Update';
          this.toolbarData.submitMode = true;
          this.sharedService.changeButton(this.toolbarData);
        }
        else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }
      }
    }
    else if (this.permissionStatus == PermissionType.Pages) {
      if ((this.userPermissions?.isUpdate ?? false)) {
        this.checkButtonClicked('Update');
        this.toolbarData.action = 'Update';
        this.toolbarData.submitMode = true;
        this.sharedService.changeButton(this.toolbarData);

      }
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
    }
  }
  doCopyEvent() {
    this.checkButtonClicked('Copy');
    (this.toolbarData.action = 'Copy'),
      this.sharedService.changeButton(this.toolbarData);
  }
  doNewEvent() {
    

    if (this.permissionStatus == PermissionType.Contract) {
      if (this.contractSettingsRolePermissions) {
        let perm = JSON.parse(this.contractSettingsRolePermissions.permissionsJson);
        if (perm.isAdd ?? false) {
          this.checkButtonClicked('New');
          this.toolbarData.submitMode = false;
          this.toolbarData.action = 'New';
          this.sharedService.changeButton(this.toolbarData);
        }
        else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }
      }

    }
    else if (this.permissionStatus == PermissionType.Voucher) {
      if (this.entryTypesRolePermissions) {
        let perm = JSON.parse(this.entryTypesRolePermissions.permissionsJson);
        if (perm.isAdd ?? false) {
          this.checkButtonClicked('New');
          this.toolbarData.submitMode = false;
          this.toolbarData.action = 'New';
          this.sharedService.changeButton(this.toolbarData);
        }
        else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }
      }

    }
    else if (this.permissionStatus == PermissionType.Pages) {
      if ((this.userPermissions?.isAdd ?? false)) {
        this.checkButtonClicked('New');
        this.toolbarData.submitMode = false;
        this.toolbarData.action = 'New';
        this.sharedService.changeButton(this.toolbarData);
      }
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
    }

  }
  doCancelEvent() {
    this.checkButtonClicked('Cancel');
    (this.toolbarData.action = 'Cancel'),
      this.toolbarData.submitMode = false;
    this.sharedService.changeButton(this.toolbarData);
  }
  doExportEvent() {
    this.checkButtonClicked('Export');
    (this.toolbarData.action = 'Export'),
      this.sharedService.changeButton(this.toolbarData);
  }
  doPrintEvent() {
    this.checkButtonClicked('Print');
    (this.toolbarData.action = 'Print'),
      this.sharedService.changeButton(this.toolbarData);
  }
  doDeleteEvent() {
    this.checkButtonClicked('Delete');
    (this.toolbarData.action = 'Delete'),
      this.sharedService.changeButton(this.toolbarData);
  }

  public goToList() {

    if (this.permissionStatus == PermissionType.Contract) {
      if (this.contractSettingsRolePermissions) {
        let perm = JSON.parse(this.contractSettingsRolePermissions.permissionsJson);
        if (perm.isShow ?? false) {
          this.checkButtonClicked('List');
          (this.toolbarData.action = 'List'),
            this.sharedService.changeButton(this.toolbarData);
        }
        else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }
      }
    }
    else if (this.permissionStatus == PermissionType.Voucher) {
      if (this.entryTypesRolePermissions) {
        let perm = JSON.parse(this.entryTypesRolePermissions.permissionsJson);
        if (perm.isShow ?? false) {
          this.checkButtonClicked('List');
          (this.toolbarData.action = 'List'),
            this.sharedService.changeButton(this.toolbarData);
        }
        else {
          this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
        }
      }
    }
    else if (this.permissionStatus == PermissionType.Pages) {
      if ((this.userPermissions?.isShow ?? false)) {
        this.checkButtonClicked('List');
        (this.toolbarData.action = 'List'),
          this.sharedService.changeButton(this.toolbarData);
      }
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
    }
  }
  doIssueEvent() {
    this.checkButtonClicked('Issue');
    this.toolbarData.action = 'Issue';
    this.toolbarData.submitMode = true;
    this.sharedService.changeButton(this.toolbarData);
  }

  doRenewEvent() {
    this.checkButtonClicked('Renew');
    this.toolbarData.action = 'Renew';
    this.toolbarData.submitMode = true;
    this.sharedService.changeButton(this.toolbarData);
  }
  doViewEvent() {

    if (this.userPermissions?.isView ?? false) {
      this.checkButtonClicked('View');
      this.toolbarData.action = 'View';

      this.sharedService.changeButton(this.toolbarData);
    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
    }
  }
  doCancelDefaultReportEvent() {
    if (this.userPermissions?.isView ?? false) {
      this.checkButtonClicked('CancelDefaultReport');
      this.toolbarData.action = 'CancelDefaultReport';
      this.sharedService.changeButton(this.toolbarData);
      this.showResponseMessage(true, AlertTypes.success, this.translate.transform("general.cancel-default-report"))

    }
    else {
      this.showResponseMessage(true, AlertTypes.warning, this.translate.transform("permissions.permission-denied"))
    }
  }
  checkButtonClicked(button: string) {

    this.resetCLickedButtons();

    if (button == 'List') {
      this.disabledSave = true;
      this.disabledNew = false;
      this.disabledCopy = true;
      this.disabledList = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disableChangePassword = true;
      this.showButtons.showChangePassword = false;
      this.disabledCancel = true;
    } else if (button == 'Save') {
      this.disabledUpate = true;
      this.disabledCopy = true;
      this.disabledNew = false;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.showButtons.showChangePassword = false;
      this.disableChangePassword = true;
    } else if (button == 'New') {
      this.disabledUpate = true;
      this.disabledCopy = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disableChangePassword = true;
      this.showButtons.showChangePassword = false;
    } else if (button == 'Copy') {
    } else if (button == 'Update') {
      this.disabledNew = false;
      this.disabledSave = true;
      this.disabledUpate = false;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledCopy = true;
      this.disableChangePassword = true;
      this.showButtons.showChangePassword = false;
    } else if (button == 'Cancel') {
    } else if (button == 'Disactive') {
      this.disabledSave = true;
      this.disabledNew = true;
      this.disabledCopy = true;
      this.disabledList = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disableChangePassword = true;
      this.showButtons.showChangePassword = false;
    }

    else if (button == 'Issue') {
      this.disableIssue = false;
      this.disabledUpate = false;
      this.disabledNew = true;
      this.disabledSave = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledCopy = true;
      this.disableChangePassword = true;
      this.showButtons.showChangePassword = false;
    }
    else if (button == 'Renew') {
      this.disableRenew = false;
      this.disableIssue = true;
      this.disabledUpate = true;
      this.disabledSave = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledCopy = true;
      this.disableChangePassword = true;
      this.showButtons.showChangePassword = false;
    }
    else if (button == 'Report') {

      this.disabledSave = true;
      this.disabledNew = true;
      this.disabledCopy = true;
      this.disabledList = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disableView = false;
      this.disableChangePassword = true;
      this.disableCancelDefaultReport = false;
      this.showButtons.showChangePassword = false;

    }
    else if (button == 'View') {
    }
    else if (button == 'Index') {
      this.disabledSave = true;
      this.disabledNew = true;
      this.disabledCopy = true;
      this.disabledList = false;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disableChangePassword = true;
      this.disableView = true;
      this.disableCancelDefaultReport = true;
      this.showButtons.showChangePassword = false;

    }
    else if (button == 'NoIndex') {
      this.disabledSave = false;
      this.disabledNew = true;
      this.disabledCopy = true;
      this.disabledList = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disableView = true;
      this.disableChangePassword = true;
      this.showButtons.showChangePassword = false;
      this.disableCancelDefaultReport = true;

    } else if (button == 'ChangePassword') {
      this.disabledSave = true;
      this.disableChangePassword = false;
      this.disabledNew = true;
      this.disabledCopy = true;
      this.disabledList = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disableView = true;
      this.disableCancelDefaultReport = true;
      this.showButtons.showChangePassword = true;
    } else if (button == 'NoAction') {
      this.disabledSave = true;
      this.disableChangePassword = true;
      this.disabledNew = false;
      this.disabledCopy = true;
      this.disabledList = false;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disableView = true;
      this.disableCancelDefaultReport = true;
      this.showButtons.showChangePassword = true;
    } else if (button == 'SinglePage') {
      this.disabledSave = false;
      this.disableChangePassword = true;
      this.disabledNew = false;
      this.disabledCopy = true;
      this.disabledList = true;
      this.disabledExport = true;
      this.disabledPrint = true;
      this.disabledUpate = true;
      this.disabledCancel = true;
      this.disableView = true;
      this.disableCancelDefaultReport = true;
      this.showButtons.showChangePassword = false;
    }

  }

  resetCLickedButtons() {
    this.disabledSave = false;
    this.disabledNew = false;
    this.disabledCopy = false;
    this.disabledList = false;
    this.disabledExport = false;
    this.disabledPrint = false;
    this.disabledUpate = false;
    this.disableIssue = true;
    this.disableRenew = true;
    this.disableView = true;
    this.disableCancelDefaultReport = true;

  }
  resetShowButtons() {
    this.showToolbarButtonsObj.showSave = true;
    this.showToolbarButtonsObj.showCancel = true;
    this.showToolbarButtonsObj.showChangePassword = true;
    this.showToolbarButtonsObj.showDelete = true;
    this.showToolbarButtonsObj.showExport = true;
    this.showToolbarButtonsObj.showCopy = true;
    this.showToolbarButtonsObj.showList = true;
    this.showToolbarButtonsObj.showNew = true;
    this.showToolbarButtonsObj.showPrint = true;
    this.showToolbarButtonsObj.showReset = true;
    this.showToolbarButtonsObj.showUpdate = true;
    this.showToolbarButtonsObj.showIssue = true;
    this.showToolbarButtonsObj.showRenew = true;
    this.showToolbarButtonsObj.showView = true;
    this.showToolbarButtonsObj.showCancelDefaultReport = true;

    this.sharedService.changeButtonApperance(this.showToolbarButtonsObj);
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

  openUploadFileDialog() {
    ;
    let recordId = parseInt(localStorage.getItem("RecordId")!);
    let title = this.translate.transform(this.toolbarPathData.componentList);
    let sub = this.uploadFileDialog
      .showDialog(title, this.toolbarPathData.pageId, recordId)
      .subscribe((d) => {

      });
    this.subsList.push(sub);
  }

  openPreviewUploadedFilesDialog() {
    let recordId = parseInt(localStorage.getItem("RecordId")!);
    let title = this.translate.transform(this.toolbarPathData.componentList);
    let sub = this.uploadFileDialog
      .showDialogPerviewUploadedFiles(title, this.toolbarPathData.pageId, recordId)
      .subscribe((d) => {

      });
    this.subsList.push(sub);
  }

}


