import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { SalesBuyContractStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SalesBuyContractDue } from 'src/app/core/models/sales-buy-contract-due';
import { SalesBuyContractsService } from 'src/app/core/services/backend-services/sales-contracts.service';
//import { SalesBuyContractDuesService } from 'src/app/core/services/backend-services/sales-buy-contracts-dues.service';


@Component({
  selector: 'app-sales-buy-contracts-notification',
  templateUrl: './sales-buy-contracts-notification.component.html',
  styleUrls: ['./sales-buy-contracts-notification.component.scss']
})
export class SalesBuyContractsNotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() showDailyDuesForSalesContracts!: boolean;
  @Input() showDailyDuesForBuyContracts!: boolean;

  @Input() showGenerateEntryNotificationForSalesContracts!: boolean;
  @Input() showGenerateEntryNotificationForBuyContracts!: boolean;

  @Input() notificationPeriodForSalesContracts!: number;
  @Input() notificationPeriodForBuyContracts!: number;

  subsList: Subscription[] = [];
  lang: string = '';
  errorMessage = '';
  errorClass = ''
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number

  salesContractDues: SalesBuyContractDue[] = [];
  buyContractDues: SalesBuyContractDue[] = [];

  generateEntrySalesContractDues: SalesBuyContractDue[] = [];
  generateEntryBuyContractDues: SalesBuyContractDue[] = [];


  isSalesContractsDuesListEmpty;
  isBuyContractsDuesListEmpty;

  isGenerateEntrySalesContractDuesListEmpty;
  isGenerateEntryBuyContractDuesListEmpty;


  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  constructor(private SharedServices: SharedService,
    private router: Router,
    private dateService: DateCalculation,
    private store: Store<any>,
    private salesBuyContractsService: SalesBuyContractsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    //private salesBuyContractDuesService: SalesBuyContractDuesService,
    private SystemSettingsService: SystemSettingsService,
    private alertsService: NotificationsAlertsService,

  ) { }

  ngOnInit(): void {
    this.getLanguage();
    this.getSystemSettings();

    this.getSalesBuyContractsDues();
    this.defineSalesContractDuesGridColumn();
    this.defineBuyContractDuesGridColumn();

    this.defineGenerateEntrySalesContractDuesGridColumn();
    this.defineGenerateEntryBuyContractDuesGridColumn();


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
  setDecimalNumber(number:any)
  {
    this.SystemSettingsService.setDecimalNumber(number);
  }
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getSystemSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.SystemSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.showDecimalPoint = res.data[0].showDecimalPoint
          this.showThousandsComma = res.data[0].showThousandsComma
          this.showRoundingFractions = res.data[0].showRoundingFractions
          this.numberOfFraction = res.data[0].numberOfFraction
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


  getSalesBuyContractsDues() {
    const promise = new Promise<void>((resolve, reject) => {
      // this.salesBuyContractDuesService.getWithResponse<SalesBuyContractDue[]>("GetAllVMFromSubTable").subscribe({
      //   next: (res: any) => {
      //      
      //     this.salesContractDues = res.data.filter(x=>x.contractTypeId==2).map((res: SalesBuyContractDue[]) => {
      //       return res
      //     });
      //     if (this.salesContractDues.length == 0) {
      //       this.isSalesContractsDuesListEmpty = true
      //     }
      //     let notificationDateForSales = this.dateService.AddDaysToGregorian(this.notificationPeriodForSalesContracts,
      //       {
      //         year: new Date().getUTCFullYear(),
      //         month: (new Date().getMonth() + 1),
      //         day: new Date().getDate()
      //       }
      //     );
      //      
      //     this.generateEntrySalesContractDues = res.data.filter(x => x.isEntryGenerated != true && x.contractTypeId==2 && x.contractStatus == SalesBuyContractStatusEnum.Issued  && x.dueStartDate <= notificationDateForSales).map((res: SalesBuyContractDue[]) => {
      //       return res
      //     });
      //     if (this.generateEntrySalesContractDues.length == 0) {
      //       this.isGenerateEntrySalesContractDuesListEmpty = true
      //     }



      //     this.buyContractDues = res.data.filter(x=>x.contractTypeId==3).map((res: SalesBuyContractDue[]) => {
      //       return res
      //     });
      //     if (this.buyContractDues.length == 0) {
      //       this.isBuyContractsDuesListEmpty = true
      //     }
      //     let notificationDateForBuy = this.dateService.AddDaysToGregorian(this.notificationPeriodForBuyContracts,
      //       {
      //         year: new Date().getUTCFullYear(),
      //         month: (new Date().getMonth() + 1),
      //         day: new Date().getDate()
      //       }
      //     );
      //      
      //     this.generateEntryBuyContractDues = res.data.filter(x => x.isEntryGenerated != true && x.contractTypeId==3 && x.contractStatus == SalesBuyContractStatusEnum.Issued  && x.dueStartDate <= notificationDateForBuy).map((res: SalesBuyContractDue[]) => {
      //       return res
      //     });
      //     if (this.generateEntryBuyContractDues.length == 0) {
      //       this.isGenerateEntryBuyContractDuesListEmpty = true
      //     }

      //     resolve();
      //   },
      //   error: (err: any) => {
      //     reject(err);
      //   },
      //   complete: () => {

      //   },
      // });
    });
    return promise;


  }

  //#region Tabulator

  panelId: number = 1;
  sortByCols: any[] = [];
  searchSalesContractDuesFilters: any;
  searchBuyContractDuesFilters: any;

  searchGenerateSalesContractDuesFilters: any;
  searchGenerateBuyContractDuesFilters: any;

  groupByCols: string[] = [];
  salesContractDuesColumnNames: any[] = [];
  generateEntrySalesContractDuesColumnNames: any[] = [];

  buyContractDuesColumnNames: any[] = [];
  generateEntryBuyContractDuesColumnNames: any[] = [];


  
  defineSalesContractDuesGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.salesContractDuesColumnNames = [

        this.lang == 'ar'
          ? { title: 'نوع الأستحقاق', field: 'typeNameAr' }
          : { title: 'Due Type', field: 'typeNameEn' },

        {
          title: this.lang == 'ar' ? ' قيمة الاستحقاق' : 'Due Amount',
          field: 'dueAmount',

        },
        {
          title: this.lang == 'ar' ? 'تاريخ بداية الأستحقاق' : 'Start Due Date',
          field: 'dueStartDate',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ نهاية الأستحقاق' : 'End Due Date',
          field: 'dueEndDate',
        },
        {
          title: this.lang == 'ar' ? 'رقم العقد' : 'Contract Number',
          field: 'contractNumber',
        },
        this.lang == 'ar'
          ? { title: 'نمط العقد', field: 'contractSettingNameAr' }
          : { title: 'Contract Setting', field: 'contractSettingNameEn' },
        this.lang == 'ar'
          ? { title: 'حالة العقد', field: 'contractStatusNameAr' }
          : { title: 'Contract Status', field: 'contractStatusNameEn' },
        this.lang == 'ar'
          ? { title: 'البائع', field: 'ownerNameAr' }
          : { title: ' Seller  ', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'المشترى', field: 'purchaserNameAr' }
          : { title: 'Purchaser', field: 'purchaserNameEn' }





      ];
    })
  }
  defineBuyContractDuesGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.buyContractDuesColumnNames = [

        this.lang == 'ar'
          ? { title: 'نوع الأستحقاق', field: 'typeNameAr' }
          : { title: 'Due Type', field: 'typeNameEn' },

        {
          title: this.lang == 'ar' ? ' قيمة الاستحقاق' : 'Due Amount',
          field: 'dueAmount',

        },
        {
          title: this.lang == 'ar' ? 'تاريخ بداية الأستحقاق' : 'Start Due Date',
          field: 'dueStartDate',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ نهاية الأستحقاق' : 'End Due Date',
          field: 'dueEndDate',
        },
        {
          title: this.lang == 'ar' ? 'رقم العقد' : 'Contract Number',
          field: 'contractNumber',
        },
        this.lang == 'ar'
          ? { title: 'نمط العقد', field: 'contractSettingNameAr' }
          : { title: 'Contract Setting', field: 'contractSettingNameEn' },
        this.lang == 'ar'
          ? { title: 'حالة العقد', field: 'contractStatusNameAr' }
          : { title: 'Contract Status', field: 'contractStatusNameEn' },
        this.lang == 'ar'
          ? { title: 'المشترى', field: 'ownerNameAr' }
          : { title: ' Purchaser  ', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'البائع', field: 'purchaserNameAr' }
          : { title: 'Seller', field: 'purchaserNameEn' }





      ];
    })
  }
  defineGenerateEntrySalesContractDuesGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.generateEntrySalesContractDuesColumnNames = [

        this.lang == 'ar'
          ? { title: 'نوع الأستحقاق', field: 'typeNameAr' }
          : { title: 'Due Type', field: 'typeNameEn' },

        {
          title: this.lang == 'ar' ? ' قيمة الاستحقاق' : 'Due Amount',
          field: 'dueAmount',

        },
        {
          title: this.lang == 'ar' ? 'تاريخ بداية الأستحقاق' : 'Start Due Date',
          field: 'dueStartDate',
        },

        {
          title: this.lang == 'ar' ? 'تاريخ نهاية الأستحقاق' : 'End Due Date',
          field: 'dueEndDate',
        },
        {
          title: this.lang == 'ar' ? 'رقم العقد' : 'Contract Number',
          field: 'contractNumber',
        },
        this.lang == 'ar'
          ? { title: 'نمط العقد', field: 'contractSettingNameAr' }
          : { title: 'Contract Setting', field: 'contractSettingNameEn' },
        // this.lang == 'ar'
        //   ? { title: 'حالة العقد', field: 'contractStatusNameAr' }
        //   : { title: 'Contract Status', field: 'contractStatusNameEn' },
        this.lang == 'ar'
          ? { title: 'البائع', field: 'ownerNameAr' }
          : { title: ' Seller  ', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'المشترى', field: 'purchaserNameAr' }
          : { title: 'Purchaser', field: 'purchaserNameEn' },
        this.lang == "ar" ? {
          title: "توليد القيد",
          field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
            this.showConfirmGenerateEntryMessage(cell.getRow().getData().id)
          }
        }
          :
          {
            title: "Generate Entry",
            field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
              this.showConfirmGenerateEntryMessage(cell.getRow().getData().id)
            }
          },





      ];
    })
  }
  defineGenerateEntryBuyContractDuesGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.generateEntryBuyContractDuesColumnNames = [

        this.lang == 'ar'
          ? { title: 'نوع الأستحقاق', field: 'typeNameAr' }
          : { title: 'Due Type', field: 'typeNameEn' },

        {
          title: this.lang == 'ar' ? ' قيمة الاستحقاق' : 'Due Amount',
          field: 'dueAmount',

        },
        {
          title: this.lang == 'ar' ? 'تاريخ بداية الأستحقاق' : 'Start Due Date',
          field: 'dueStartDate',
        },

        {
          title: this.lang == 'ar' ? 'تاريخ نهاية الأستحقاق' : 'End Due Date',
          field: 'dueEndDate',
        },
        {
          title: this.lang == 'ar' ? 'رقم العقد' : 'Contract Number',
          field: 'contractNumber',
        },
        this.lang == 'ar'
          ? { title: 'نمط العقد', field: 'contractSettingNameAr' }
          : { title: 'Contract Setting', field: 'contractSettingNameEn' },
        // this.lang == 'ar'
        //   ? { title: 'حالة العقد', field: 'contractStatusNameAr' }
        //   : { title: 'Contract Status', field: 'contractStatusNameEn' },
        this.lang == 'ar'
          ? { title: 'المشترى', field: 'ownerNameAr' }
          : { title: ' Purchaser  ', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'البائع', field: 'purchaserNameAr' }
          : { title: 'Seller', field: 'purchaserNameEn' },
        this.lang == "ar" ? {
          title: "توليد القيد",
          field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
            this.showConfirmGenerateEntryMessage(cell.getRow().getData().id)
          }
        }
          :
          {
            title: "Generate Entry",
            field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
              this.showConfirmGenerateEntryMessage(cell.getRow().getData().id)
            }
          },





      ];
    })
  }
  
  showConfirmGenerateEntryMessage(id: any) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("dashboard.confirm-generate-entry");
    modalRef.componentInstance.title = this.translate.transform("dashboard.generate-entry");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.yes");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      if (rs == "Confirm") {
         this.generateEntry(id);
      }
    })

  }

 
  generateEntry(id:any)
  {
    this.salesBuyContractsService.addWithUrl("GenerateEntryOnDue", id).subscribe(
      result => {
         
        if(result.success==true)
        {
          this.alertsService.showSuccess(this.translate.transform("general.generate-entry-success"), this.translate.transform("messageTitle.done"));
          this.getSalesBuyContractsDues();
          this.defineGenerateEntrySalesContractDuesGridColumn();
          this.defineGenerateEntryBuyContractDuesGridColumn();


          return
        }
        else{
          this.errorMessage = this.translate.transform('general.generate-entry-error');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }

      },
      error => console.error(error))
  }

  direction: string = 'ltr';


  onSearchSalesContractDuesTextChange(searchTxt: string) {
    this.searchSalesContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameAr', type: 'like', value: searchTxt },

      ],
    ];
  }
  onSearchBuyContractDuesTextChange(searchTxt: string) {
    this.searchBuyContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameAr', type: 'like', value: searchTxt },

      ],
    ];
  }
  onSearchGenerateEntrySalesContractDuesTextChange(searchTxt: string) {
    this.searchGenerateSalesContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameAr', type: 'like', value: searchTxt },

      ],
    ];
  }
  
  onSearchGenerateEntryBuyContractDuesTextChange(searchTxt: string) {
    this.searchGenerateSalesContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameEn', type: 'like', value: searchTxt },
        { field: 'purchaserNameAr', type: 'like', value: searchTxt },

      ],
    ];
  }


  //#endregion




}
