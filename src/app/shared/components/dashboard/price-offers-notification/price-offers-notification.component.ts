import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { Subscription } from 'rxjs';
import { OffersService } from 'src/app/core/services/backend-services/offers-service.service';
import { OffersListVm } from 'src/app/core/models/ViewModel/offers-vm';


@Component({
  selector: 'app-price-offers-notification',
  templateUrl: './price-offers-notification.component.html',
  styleUrls: ['./price-offers-notification.component.scss']
})
export class PriceOffersNotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() showExpiryPriceOffersOfRent!: boolean;
  @Input() notificationPeriodForExpiryPriceOffersOfRent!: number;
  @Input() showExpiryPriceOffersOfSales!: boolean;
  @Input() notificationPeriodForExpiryPriceOffersOfSales!: number;
  subsList: Subscription[] = [];



  lang: string = '';
  rentOffers: OffersListVm[] = [];
  salesOffers: OffersListVm[] = [];

  isRentListEmpty;
  isSalesListEmpty;

  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  constructor(private SharedServices: SharedService, private offersService: OffersService,
    private router: Router,
    private dateService: DateCalculation


  ) { }

  ngOnInit(): void {
    this.getLanguage()
    this.getOffers();
    this.defineGridColumn();

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
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getOffers() {
     

    const promise = new Promise<void>((resolve, reject) => {
      this.offersService.getAll("GetAll").subscribe({
        next: (res: any) => {
           
          let notificationDateOfRent = this.dateService.AddDaysToGregorian(this.notificationPeriodForExpiryPriceOffersOfRent, {
            year: new Date().getUTCFullYear(),
            month: (new Date().getMonth() + 1),
            day: new Date().getDate()
          });
           
          if (res.data.filter(x => x.purposeType == 1).length > 0 && res.data.filter(x => x.purposeType == 1) != null) {
            this.rentOffers = res.data.filter(x => x.offerDate <= notificationDateOfRent && x.purposeType == 1).map((res: OffersListVm[]) => {
              return res;
            });
          }

          if (this.rentOffers.length == 0) {
            this.isRentListEmpty = true
          }
          let notificationDateOfSales = this.dateService.AddDaysToGregorian(this.notificationPeriodForExpiryPriceOffersOfSales, {
            year: new Date().getUTCFullYear(),
            month: (new Date().getMonth() + 1),
            day: new Date().getDate()
          });
          if (res.data.filter(x => x.purposeType == 2).length > 0 && res.data.filter(x => x.purposeType == 2) != null) {
            this.salesOffers = res.data.filter(x => x.offerDate <= notificationDateOfSales && x.purposeType == 2).map((res: OffersListVm[]) => {
              return res;
            });
          }
          if (this.salesOffers.length == 0) {
            this.isSalesListEmpty = true
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
  //#region Tabulator
  panelId: number = 1;
  sortByCols: any[] = [];
  searchRentFilters: any;
  searchSalesFilters: any;

  groupByCols: string[] = [];
  rentColumnNames: any[] = [];
  salesColumnNames: any[] = [];

  defineGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {

      this.lang = res
      this.rentColumnNames = [

        // {
        //   title: this.lang == 'ar' ? ' رقم ' : 'Number',
        //   field: 'id',
        // },

        this.lang == 'ar'
          ? { title: 'أسم المالك', field: 'ownerNameAr' }
          : { title: 'Owner Name', field: 'ownerNameEn' },
        this.lang == 'ar'
          ? { title: 'اسم المستأجر', field: 'tenantNameAr' }
          : { title: 'Tenant Name', field: 'tenantNamEEn' },
        this.lang == 'ar'
          ? { title: 'اسم المبنى', field: 'buildingNameAr' }
          : { title: 'Building Name', field: 'buildingNameEn' },

        {
          title: this.lang == 'ar' ? ' تاريخ العرض' : 'Offer Date',
          field: 'offerDate',
        },
        {
          title: this.lang == 'ar' ? ' مدة العرض' : 'Offer Duration',
          field: 'offerDuration',
        },



      ];
      this.salesColumnNames = [

        // {
        //   title: this.lang == 'ar' ? ' رقم ' : 'Number',
        //   field: 'ownerNumber',
        // },

        this.lang == 'ar'
          ? { title: 'أسم المالك', field: 'ownerNameAr' }
          : { title: 'Owner Name', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'اسم المبنى', field: 'buildingNameAr' }
          : { title: 'Building Name', field: 'buildingNameEn' },

        {
          title: this.lang == 'ar' ? ' تاريخ العرض' : 'Offer Date',
          field: 'offerDate',
        },
        {
          title: this.lang == 'ar' ? ' مدة العرض' : 'Offer Duration',
          field: 'offerDuration',
        },



      ];
    })
  }



  direction: string = 'ltr';

  onSearchRentTextChange(searchTxt: string) {
    this.searchRentFilters = [
      [
        // { field: 'id', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        { field: 'buildingNameAr', type: 'like', value: searchTxt },
        { field: 'buildingNameEn', type: 'like', value: searchTxt },



        ,
      ],
    ];
  }
  onSearchSalesTextChange(searchTxt: string) {
    this.searchSalesFilters = [
      [
        // { field: 'id', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'buildingNameAr', type: 'like', value: searchTxt },
        { field: 'buildingNameEn', type: 'like', value: searchTxt },



        ,
      ],
    ];
  }




  //#endregion



}
