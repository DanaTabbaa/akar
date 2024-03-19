import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DashboardSettings } from 'src/app/core/models/dashboard-settings';
import { DashboardSettingsService } from 'src/app/core/services/backend-services/dashboard-settings.service';
import { DashboardSettingsSelectors } from 'src/app/core/stores/selectors/dashboard-settings.selectors';
import { DashboardSettingsModel } from 'src/app/core/stores/store.model.ts/dashboard-settings.store.model';
import { SharedService } from 'src/app/shared/services/shared.service';

declare var mainFunction :any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit, OnDestroy {

  constructor(private dashboardSettingsService: DashboardSettingsService,
    private store: Store<any>,
    private sharedService:SharedService,
    ) { }
    lang:string="";
    showExpiryOfPersonIdentity!:boolean;
    notificationPeriodForExpiryOfPersonIdentity!:number;
    showExpiryPriceOffersOfRent!:boolean;
    notificationPeriodForExpiryPriceOffersOfRent!:number;
    showExpiryPriceOffersOfSales!:boolean;
    notificationPeriodForExpiryPriceOffersOfSales!:number;
    showUnderContractRentalUnits!:boolean;
    isEndRentContractNotification!: boolean;
    endRentContractNotificationPeriod!: number;
    showDailyDuesForRentContracts!:boolean;
    showGenerateEntryNotificationForRentContracts!:boolean;
    notificationPeriodForRentContracts!: number;
    generateDetailsDueEntryForRentContracts!:boolean;
    showGenerateEntryNotificationForSalesContracts!:boolean;
    notificationPeriodForSalesContracts!: number;
    showGenerateEntryNotificationForBuyContracts!:boolean;
    notificationPeriodForBuyContracts!: number;
    showDailyDuesForSalesContracts!:boolean;
    showDailyDuesForBuyContracts!:boolean;
    showDailyDuesForMaintenanceContracts!:boolean;
    showGenerateEntryNotificationForMaintenanceContracts!:boolean;
    notificationPeriodForMaintenanceContracts!: number;



    subsList: Subscription[] = [];
    dashboardSettings: DashboardSettings[] = [];

  ngOnInit(): void {
     this.getDashboardSettings();
     this.getLanguage();
   }
   getLanguage() {
     this.sharedService.getLanguage().subscribe(res => {
       this.lang = res
     })
   }
  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }
  ngAfterViewInit(): void {

  }
  getDashboardSettings() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(DashboardSettingsSelectors.selectors.getListSelector).subscribe({
        next: (res: DashboardSettingsModel) => {
           
          this.dashboardSettings = JSON.parse(JSON.stringify(res.list));
          if( this.dashboardSettings.length>0&& this.dashboardSettings!=null)
          {
          this.showExpiryOfPersonIdentity=  this.dashboardSettings[0].showExpiryOfPersonIdentity;
          this.notificationPeriodForExpiryOfPersonIdentity=  this.dashboardSettings[0].notificationPeriodForExpiryOfPersonIdentity;
          this.showExpiryPriceOffersOfRent=  this.dashboardSettings[0].showExpiryPriceOffersOfRent;
          this.notificationPeriodForExpiryPriceOffersOfRent=  this.dashboardSettings[0].notificationPeriodForExpiryPriceOffersOfRent;
          this.showExpiryPriceOffersOfSales=  this.dashboardSettings[0].showExpiryPriceOffersOfSales;
          this.notificationPeriodForExpiryPriceOffersOfSales=  this.dashboardSettings[0].notificationPeriodForExpiryPriceOffersOfSales;
          this.showUnderContractRentalUnits=  this.dashboardSettings[0].showUnderContractRentalUnits;
          this.isEndRentContractNotification=this.dashboardSettings[0].isEndRentContractNotification;
          this.endRentContractNotificationPeriod=this.dashboardSettings[0].endRentContractNotificationPeriod;
          this.showDailyDuesForRentContracts=this.dashboardSettings[0].showDailyDuesForRentContracts;
          this.showGenerateEntryNotificationForRentContracts=this.dashboardSettings[0].showGenerateEntryNotificationForRentContracts;
          this.notificationPeriodForRentContracts=this.dashboardSettings[0].notificationPeriodForRentContracts;
          this.generateDetailsDueEntryForRentContracts=this.dashboardSettings[0].generateDetailsDueEntryForRentContracts;
          this.showGenerateEntryNotificationForSalesContracts=this.dashboardSettings[0].showGenerateEntryNotificationForSalesContracts;
          this.notificationPeriodForSalesContracts=this.dashboardSettings[0].notificationPeriodForSalesContracts;
          this.showGenerateEntryNotificationForBuyContracts=this.dashboardSettings[0].showGenerateEntryNotificationForBuyContracts;
          this.notificationPeriodForBuyContracts=this.dashboardSettings[0].notificationPeriodForBuyContracts;
          this.showDailyDuesForSalesContracts=this.dashboardSettings[0].showDailyDuesForSalesContracts;
          this.showDailyDuesForBuyContracts=this.dashboardSettings[0].showDailyDuesForBuyContracts;
          this.showDailyDuesForMaintenanceContracts=this.dashboardSettings[0].showDailyDuesForMaintenanceContracts;
          this.showGenerateEntryNotificationForMaintenanceContracts=this.dashboardSettings[0].showGenerateEntryNotificationForMaintenanceContracts;
          this.notificationPeriodForMaintenanceContracts=this.dashboardSettings[0].notificationPeriodForMaintenanceContracts;





          }
          resolve();
        },
        error: (err) => {
          //((err);
          resolve();
        }
      });
      this.subsList.push(sub);
    });
    // const promise = new Promise<void>((resolve, reject) => {
    //   this.dashboardSettingsService.getAll("GetAll").subscribe({
    //     next: (res: any) => {
    //       if (res.data != null) {
    //          
            
    //           // id: res.data[0].id,
    //           // showGenerateEntryNotificationForRentContracts: res?.data[0]?.showGenerateEntryNotificationForRentContracts == 1 ? true : false,
    //           // notificationPeriodForRentContracts: res?.data[0]?.notificationPeriodForRentContracts > 0 && res.data[0].notificationPeriodForRentContracts != null ? res.data[0].notificationPeriodForRentContracts : '',
    //           // generateDetailsDueEntryForRentContracts: res?.data[0]?.generateDetailsDueEntryForRentContracts == 1 ? true : false,
    //           // isEndRentContractNotification: res?.data[0]?.isEndRentContractNotification == 1 ? true : false,
    //           // endRentContractNotificationPeriod: res?.data[0]?.endRentContractNotificationPeriod > 0 && res.data[0].endRentContractNotificationPeriod != null ? res.data[0].endRentContractNotificationPeriod : '',
    //           // showGenerateEntryNotificationForSalesContracts: res?.data[0]?.showGenerateEntryNotificationForSalesContracts == 1 ? true : false,
    //           // notificationPeriodForSalesContracts: res?.data[0]?.notificationPeriodForSalesContracts > 0 && res.data[0].notificationPeriodForSalesContracts != null ? res.data[0].notificationPeriodForSalesContracts : '',
    //           // generateDetailsDueEntryForSalesContracts: res?.data[0]?.generateDetailsDueEntryForSalesContracts == 1 ? true : false,
    //           // showGenerateEntryNotificationForBuyContracts: res?.data[0]?.showGenerateEntryNotificationForBuyContracts == 1 ? true : false,
    //           // notificationPeriodForBuyContracts: res?.data[0]?.notificationPeriodForBuyContracts > 0 && res.data[0].notificationPeriodForBuyContracts != null ? res.data[0].notificationPeriodForBuyContracts : '',
    //           this.showExpiryOfPersonIdentity= res?.data[0]?.showExpiryOfPersonIdentity == 1 ? true : false;
    //           this.notificationPeriodForExpiryOfPersonIdentity= res?.data[0]?.notificationPeriodForExpiryOfPersonIdentity > 0 && res.data[0].notificationPeriodForExpiryOfPersonIdentity != null ? res.data[0].notificationPeriodForExpiryOfPersonIdentity : '';
    //           // showLatePaymentsToTenants: res?.data[0]?.showLatePaymentsToTenants == 1 ? true : false,
    //           // notificationPeriodForLatePaymentsToTenants: res?.data[0]?.notificationPeriodForLatePaymentsToTenants > 0 && res.data[0].notificationPeriodForLatePaymentsToTenants != null ? res.data[0].notificationPeriodForLatePaymentsToTenants : '',
    //           // showExpiryPriceOffers: res?.data[0]?.showExpiryPriceOffers == 1 ? true : false,
    //           // notificationPeriodForExpiryPriceOffers: res?.data[0]?.notificationPeriodForExpiryPriceOffers > 0 && res.data[0].notificationPeriodForExpiryPriceOffers != null ? res.data[0].notificationPeriodForExpiryPriceOffers : '',
    //           // showDailyDuesForRentContracts: res?.data[0]?.showDailyDuesForRentContracts == 1 ? true : false,
    //           // showUnderContractRentalUnits: res?.data[0]?.showUnderContractRentalUnits == 1 ? true : false
    //           mainFunction();



    //       }
        
    //       resolve();

    //     },
    //     error: (err: any) => {
    //       reject(err);
    //     },
    //     complete: () => {

    //     },
    //   });
    // });
    // return promise;


  }

}
