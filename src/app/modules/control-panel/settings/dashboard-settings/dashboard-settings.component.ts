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
import { RolesPermissionsService } from 'src/app/core/services/backend-services/permissions/roles-permissions.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DashboardSettings } from 'src/app/core/models/dashboard-settings';
import { DashboardSettingsService } from 'src/app/core/services/backend-services/dashboard-settings.service';
import { DashboardSettingsActions } from 'src/app/core/stores/actions/dashboard-settings.actions';
const PAGEID = 66; // from pages table in database seeding table

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit, OnDestroy {
  //properties
  dashboardSettingsForm!: FormGroup;
  id: any = 0;
  submited: boolean = false;
  Response!: ResponseResult<DashboardSettings>;
  sub: any;
  url: any;
  subsList: Subscription[] = [];
  errorMessage = '';
  errorClass = ''

  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: '',
    addPath: '',
    componentList: "sidebar.dashboard-settings",
    componentAdd: "dashboard-settings.dashboard-settings",
  };
  //
  //constructor
  constructor(private fb: FormBuilder,
    private alertsService: NotificationsAlertsService,
    private translate: TranslatePipe,
    private dashboardSettingsService: DashboardSettingsService,
    private rolesPerimssionsService: RolesPermissionsService,
    private sharedServices: SharedService,
    private store: Store<any>,
    private router: Router
  ) {

    this.defineDashboardSettings();
  }
  //
  defineDashboardSettings() {
    this.dashboardSettingsForm = this.fb.group({
      id: 0,
      showGenerateEntryNotificationForRentContracts: false,
      notificationPeriodForRentContracts: '',
      generateDetailsDueEntryForRentContracts: false,
      isEndRentContractNotification: false,
      endRentContractNotificationPeriod: '',
      showGenerateEntryNotificationForSalesContracts: false,
      notificationPeriodForSalesContracts: '',
      generateDetailsDueEntryForSalesContracts: false,
      showGenerateEntryNotificationForBuyContracts: false,
      notificationPeriodForBuyContracts: '',
      showExpiryOfPersonIdentity: false,
      notificationPeriodForExpiryOfPersonIdentity: '',
      showLatePaymentsToTenants: false,
      notificationPeriodForLatePaymentsToTenants: '',
      showExpiryPriceOffersOfRent: false,
      notificationPeriodForExpiryPriceOffersOfRent: '',
      showExpiryPriceOffersOfSales: false,
      notificationPeriodForExpiryPriceOffersOfSales: '',
      showDailyDuesForRentContracts: false,
      showUnderContractRentalUnits: false,
      showDailyDuesForSalesContracts:false,
      showDailyDuesForBuyContracts:false,
      showDailyDuesForMaintenanceContracts:false,
      showGenerateEntryNotificationForMaintenanceContracts:false,
      notificationPeriodForMaintenanceContracts:''



    })
  }
  //ngOnInit
  ngOnInit(): void {
    this.getPagePermissions(PAGEID)
    this.listenToClickedButton();
    this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);
    this.changePath();
    this.getDashboardSettings()
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
  onSave() {
    var result = this.validateNotification()
    if (result == true) {
      if (this.dashboardSettingsForm.value.id == null) {
        this.dashboardSettingsForm.value.id = 0;
      }
       
      let sub = this.dashboardSettingsService.addWithResponse("Add?checkAll=false", this.dashboardSettingsForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            this.store.dispatch(DashboardSettingsActions.actions.insert({
              data: JSON.parse(JSON.stringify({ ...res.data }))
            }));
            this.showResponseMessage(true, AlertTypes.success, this.translate.transform("messages.add-success"));
            this.dashboardSettingsForm.reset();
            this.submited = false;
            this.getDashboardSettings();
            this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);
            this.changePath();
          }
        },
        error: (err) => { },
        complete: () => { }
      });

      this.subsList.push(sub);
    }
  }
  onUpdate() {
     
    var result = this.validateNotification()
    if (result == true) {
      let sub = this.dashboardSettingsService.updateWithResponse('Update?idColName=Id&checkAll=false', this.dashboardSettingsForm.value).subscribe({
        next: (res) => {
           
          if (res.success) {
            this.store.dispatch(DashboardSettingsActions.actions.update({
              data: JSON.parse(JSON.stringify({ ...res.data }))
            }));
            this.showResponseMessage(true, AlertTypes.success, this.translate.transform("messages.update-success"));
            this.dashboardSettingsForm.reset();
            this.submited = false;
            this.getDashboardSettings()
            this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);
            this.changePath();
          }
        },
        error: (err) => { },
        complete: () => { }
      });

      this.subsList.push(sub);
    }
  }
  validateNotification() {
     ;
    if (this.dashboardSettingsForm.value.showExpiryOfPersonIdentity == true &&
       (this.dashboardSettingsForm.value.notificationPeriodForExpiryOfPersonIdentity == null || 
        this.dashboardSettingsForm.value.notificationPeriodForExpiryOfPersonIdentity == undefined
        ||this.dashboardSettingsForm.value.notificationPeriodForExpiryOfPersonIdentity == "")) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-expiry-Of-person-identity-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }

    if (this.dashboardSettingsForm.value.showLatePaymentsToTenants == true &&
       (this.dashboardSettingsForm.value.notificationPeriodForLatePaymentsToTenants == null || 
        this.dashboardSettingsForm.value.notificationPeriodForLatePaymentsToTenants == undefined || 
        this.dashboardSettingsForm.value.notificationPeriodForLatePaymentsToTenants == "")) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-late-payments-to-tenants-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }


    if (this.dashboardSettingsForm.value.showExpiryPriceOffersOfRent == true && 
      (this.dashboardSettingsForm.value.notificationPeriodForExpiryPriceOffersOfRent == null ||
         this.dashboardSettingsForm.value.notificationPeriodForExpiryPriceOffersOfRent == undefined || 
         this.dashboardSettingsForm.value.notificationPeriodForExpiryPriceOffersOfRent == ""
         )) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-before-expire-price-offers-of-rent-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }

    if (this.dashboardSettingsForm.value.showExpiryPriceOffersOfSales == true && 
      (this.dashboardSettingsForm.value.notificationPeriodForExpiryPriceOffersOfSales == null ||
         this.dashboardSettingsForm.value.notificationPeriodForExpiryPriceOffersOfSales == undefined || 
         this.dashboardSettingsForm.value.notificationPeriodForExpiryPriceOffersOfSales == ""
         )) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-before-expire-price-offers-of-sales-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }

    if (this.dashboardSettingsForm.value.showGenerateEntryNotificationForRentContracts == true && 
      (this.dashboardSettingsForm.value.notificationPeriodForRentContracts == null || 
        this.dashboardSettingsForm.value.notificationPeriodForRentContracts == "")) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-entries-rent-contracts-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }


    if (this.dashboardSettingsForm.value.isEndRentContractNotification == true &&
      (this.dashboardSettingsForm.value.endRentContractNotificationPeriod == null || 
        this.dashboardSettingsForm.value.endRentContractNotificationPeriod == undefined ||
        this.dashboardSettingsForm.value.endRentContractNotificationPeriod == ""
        )) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-expire-rent-contracts-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.dashboardSettingsForm.value.showGenerateEntryNotificationForSalesContracts == true && 
      (this.dashboardSettingsForm.value.notificationPeriodForSalesContracts == null ||
         this.dashboardSettingsForm.value.notificationPeriodForSalesContracts == undefined || 
         this.dashboardSettingsForm.value.notificationPeriodForSalesContracts == ""
         )) {


      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-entries-sales-contracts-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.dashboardSettingsForm.value.showGenerateEntryNotificationForBuyContracts == true && 
      (this.dashboardSettingsForm.value.notificationPeriodForBuyContracts == null 
        || this.dashboardSettingsForm.value.notificationPeriodForBuyContracts == undefined
        || this.dashboardSettingsForm.value.notificationPeriodForBuyContracts == ""

        )) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-entries-buy-contracts-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    if (this.dashboardSettingsForm.value.showGenerateEntryNotificationForMaintenanceContracts == true && 
      (this.dashboardSettingsForm.value.notificationPeriodForMaintenanceContracts == null 
        || this.dashboardSettingsForm.value.notificationPeriodForMaintenanceContracts == undefined
        || this.dashboardSettingsForm.value.notificationPeriodForMaintenanceContracts == ""

        )) {

      this.errorMessage = this.translate.transform('dashboard-settings.notification-period-entries-maintenance-contracts-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return
    }
    return true;
  }



  // saveDashboardSettings() {

  //   if (this.dashboardSettingsForm.value.id == null) {
  //     this.dashboardSettingsForm.value.id = 0;
  //   }
  //   this.SystemSettingsService._addRequest(this.systemSettingsForm.value).subscribe(
  //     result => {
  //       if (result != null) {
  //         this.Response = { ...result };
  //         if (this.id == 0) {
  //           this.store.dispatch(SystemSettingActions.actions.insert({
  //             data: JSON.parse(JSON.stringify({ ...result.response.data }))
  //           }));
  //         }
  //         else if (this.id > 0) {
  //           this.store.dispatch(SystemSettingActions.actions.update({
  //             data: JSON.parse(JSON.stringify({ ...result.data }))
  //           }));
  //         }
  //         ;
  //         this.showResponseMessage(this.Response.success, AlertTypes.success, this.translate.transform("messages.update-success"));
  //         this.dashboardSettingsForm.reset();
  //         this.submited = false;
  //         this.getSystemSettings()


  //       }
  //     },
  //     error => console.error(error))

  //     this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);
  //     this.changePath();

  // }

  getDashboardSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.dashboardSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          if (res.data != null) {
             
            this.dashboardSettingsForm.setValue({
              id: res.data[0].id,
              showGenerateEntryNotificationForRentContracts: res?.data[0]?.showGenerateEntryNotificationForRentContracts == 1 ? true : false,
              notificationPeriodForRentContracts: res?.data[0]?.notificationPeriodForRentContracts > 0 && res.data[0].notificationPeriodForRentContracts != null ? res.data[0].notificationPeriodForRentContracts : '',
              generateDetailsDueEntryForRentContracts: res?.data[0]?.generateDetailsDueEntryForRentContracts == 1 ? true : false,
              isEndRentContractNotification: res?.data[0]?.isEndRentContractNotification == 1 ? true : false,
              endRentContractNotificationPeriod: res?.data[0]?.endRentContractNotificationPeriod > 0 && res.data[0].endRentContractNotificationPeriod != null ? res.data[0].endRentContractNotificationPeriod : '',
              showGenerateEntryNotificationForSalesContracts: res?.data[0]?.showGenerateEntryNotificationForSalesContracts == 1 ? true : false,
              notificationPeriodForSalesContracts: res?.data[0]?.notificationPeriodForSalesContracts > 0 && res.data[0].notificationPeriodForSalesContracts != null ? res.data[0].notificationPeriodForSalesContracts : '',
              generateDetailsDueEntryForSalesContracts: res?.data[0]?.generateDetailsDueEntryForSalesContracts == 1 ? true : false,
              showGenerateEntryNotificationForBuyContracts: res?.data[0]?.showGenerateEntryNotificationForBuyContracts == 1 ? true : false,
              notificationPeriodForBuyContracts: res?.data[0]?.notificationPeriodForBuyContracts > 0 && res.data[0].notificationPeriodForBuyContracts != null ? res.data[0].notificationPeriodForBuyContracts : '',
              showExpiryOfPersonIdentity: res?.data[0]?.showExpiryOfPersonIdentity == 1 ? true : false,
              notificationPeriodForExpiryOfPersonIdentity: res?.data[0]?.notificationPeriodForExpiryOfPersonIdentity > 0 && res.data[0].notificationPeriodForExpiryOfPersonIdentity != null ? res.data[0].notificationPeriodForExpiryOfPersonIdentity : '',
              showLatePaymentsToTenants: res?.data[0]?.showLatePaymentsToTenants == 1 ? true : false,
              notificationPeriodForLatePaymentsToTenants: res?.data[0]?.notificationPeriodForLatePaymentsToTenants > 0 && res.data[0].notificationPeriodForLatePaymentsToTenants != null ? res.data[0].notificationPeriodForLatePaymentsToTenants : '',
              showExpiryPriceOffersOfRent: res?.data[0]?.showExpiryPriceOffersOfRent == 1 ? true : false,
              notificationPeriodForExpiryPriceOffersOfRent: res?.data[0]?.notificationPeriodForExpiryPriceOffersOfRent > 0 && res.data[0].notificationPeriodForExpiryPriceOffersOfRent != null ? res.data[0].notificationPeriodForExpiryPriceOffersOfRent : '',
              showExpiryPriceOffersOfSales: res?.data[0]?.showExpiryPriceOffersOfSales == 1 ? true : false,
              notificationPeriodForExpiryPriceOffersOfSales: res?.data[0]?.notificationPeriodForExpiryPriceOffersOfSales > 0 && res.data[0].notificationPeriodForExpiryPriceOffersOfSales != null ? res.data[0].notificationPeriodForExpiryPriceOffersOfSales : '',
              showDailyDuesForRentContracts: res?.data[0]?.showDailyDuesForRentContracts == 1 ? true : false,
              showUnderContractRentalUnits: res?.data[0]?.showUnderContractRentalUnits == 1 ? true : false,
              showDailyDuesForSalesContracts:res?.data[0]?.showDailyDuesForSalesContracts == 1 ? true : false,
              showDailyDuesForBuyContracts:res?.data[0]?.showDailyDuesForBuyContracts == 1 ? true : false,
              showDailyDuesForMaintenanceContracts:res?.data[0]?.showDailyDuesForMaintenanceContracts == 1 ? true : false,
              showGenerateEntryNotificationForMaintenanceContracts:res?.data[0]?.showGenerateEntryNotificationForMaintenanceContracts == 1 ? true : false,
              notificationPeriodForMaintenanceContracts:res?.data[0]?.notificationPeriodForMaintenanceContracts > 0 && res.data[0].notificationPeriodForMaintenanceContracts != null ? res.data[0].notificationPeriodForMaintenanceContracts : '',



            });
            this.id = res.data[0].id;
          }
          else {
            this.defineDashboardSettings();
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
            if (this.id == 0) {
              this.onSave();

            }
            else {
              this.onUpdate();
            }
          } else if (currentBtn.action == ToolbarActions.New) {
            this.sharedServices.changeButton({ action: 'NoIndex', submitMode: false } as ToolbarData);

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


}
