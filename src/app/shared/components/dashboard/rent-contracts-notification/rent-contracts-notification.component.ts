import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { RentContract } from 'src/app/core/models/rent-contracts';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { RentContractDuesService } from 'src/app/core/services/backend-services/rent-contract-dues.service';
import { RentContractDues } from 'src/app/core/models/rent-contract-dues';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { RentContractDueVM } from 'src/app/core/models/ViewModel/rent-contract-due-vm';
import { RentContractStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';


@Component({
  selector: 'app-rent-contracts-notification',
  templateUrl: './rent-contracts-notification.component.html',
  styleUrls: ['./rent-contracts-notification.component.scss']
})
export class RentContractsNotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isEndRentContractNotification!: boolean;
  @Input() endRentContractNotificationPeriod!: number;
  @Input() showDailyDuesForRentContracts!: boolean;

  @Input() showGenerateEntryNotificationForRentContracts!: boolean;
  @Input() notificationPeriodForRentContracts!: number;
  @Input() generateDetailsDueEntryForRentContracts!: boolean;

  subsList: Subscription[] = [];
  lang: string = '';
  errorMessage = '';
  errorClass = ''
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number

  endRentContracts: RentContract[] = [];
  rentContractDues: RentContractDues[] = [];
  generateEntryRentContractDues: RentContractDues[] = [];

  isEndRentContractsListEmpty;
  isRentContractsDuesListEmpty;
  isGenerateEntryRentContractDuesListEmpty;


  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  constructor(private SharedServices: SharedService,
    private router: Router,
    private dateService: DateCalculation,
    private store: Store<any>,
    private rentContractsService: RentContractsService,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private rentContractDuesService: RentContractDuesService,
    private SystemSettingsService: SystemSettingsService,
    private alertsService: NotificationsAlertsService,




  ) { }

  ngOnInit(): void {
    this.getLanguage();
    this.getSystemSettings();
    if (this.isEndRentContractNotification == true) {
      this.getRentContracts();
      this.defineEndRentContractsGridColumn();

    }
     ;
    // if(this.showDailyDuesForRentContracts ==true || this.showGenerateEntryNotificationForRentContracts==true)
    // {
    this.getRentContractsDues();
    //}
     
    // if(this.showDailyDuesForRentContracts ==true)
    // {
    this.defineRentContractDuesGridColumn();

    // }
    // if(this.showGenerateEntryNotificationForRentContracts==true)
    // {
    this.defineGenerateEntryRentContractDuesGridColumn();

    //}




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
  setDecimalNumber(number: any) {
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
  getRentContracts() {
    const promise = new Promise<void>((resolve, reject) => {
      this.rentContractsService.getAll("GetAll").subscribe({
        next: (res: any) => {
           

          let notificationDate = this.dateService.AddDaysToGregorian(this.endRentContractNotificationPeriod,
            {
              year: new Date().getUTCFullYear(),
              month: (new Date().getMonth() + 1),
              day: new Date().getDate()
            }
          );
          this.endRentContracts = res.data.filter(x => x.endContractDate <= notificationDate && x.contractStatus != 3 && x.contractStatus != 4 && x.parentContractId != null).map((res: RentContract[]) => {
            return res
          });
          if (this.endRentContracts.length == 0) {
            this.isEndRentContractsListEmpty = true
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

  getRentContractsDues() {
    const promise = new Promise<void>((resolve, reject) => {
      this.rentContractDuesService.getAll("GetAll").subscribe({
        next: (res: any) => {
           
          this.rentContractDues = res.data.map((res: RentContractDueVM[]) => {
            return res
          });
          if (this.rentContractDues.length == 0) {
            this.isRentContractsDuesListEmpty = true
          }
          let notificationDate = this.dateService.AddDaysToGregorian(this.notificationPeriodForRentContracts,
            {
              year: new Date().getUTCFullYear(),
              month: (new Date().getMonth() + 1),
              day: new Date().getDate()
            }
          );
           
          this.generateEntryRentContractDues = res.data.filter(x => x.isEntryGenerated != true && (x.contractStatus == RentContractStatusEnum.Issued || x.contractStatus == RentContractStatusEnum.IssueRenew) && x.dueStartDate <= notificationDate).map((res: RentContractDueVM[]) => {
            return res
          });
          if (this.generateEntryRentContractDues.length == 0) {
            this.isGenerateEntryRentContractDuesListEmpty = true
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
  searchEndRentContractsFilters: any;
  searchRentContractDuesFilters: any;
  searchGenerateRentContractDuesFilters: any;
  groupByCols: string[] = [];
  endRentContractsColumnNames: any[] = [];
  rentContractDuesColumnNames: any[] = [];
  generateEntryRentContractDuesColumnNames: any[] = [];


  defineEndRentContractsGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.endRentContractsColumnNames = [
        // {
        //   title: this.lang == 'ar' ? ' رقم ' : 'Id',
        //   field: 'id',
        // },
        {
          title: this.lang == 'ar' ? ' رقم العقد' : 'Contract Number',
          field: 'contractNumber',
        },
        this.lang == 'ar'
          ? { title: 'نمط العقد', field: 'contractSettingNameAr' }
          : { title: ' Contract Setting  ', field: 'contractSettingNameEn' },

        this.lang == 'ar'
          ? { title: 'المالك', field: 'ownerNameAr' }
          : { title: ' Owner  ', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'المستأجر', field: 'tenantNameAr' }
          : { title: 'Tenant', field: 'tenantNameEn' },
        this.lang == 'ar'
          ? { title: 'المجموعة العقارية', field: 'realestateNameAr' }
          : { title: 'Realestate Group', field: 'realestateNameEn' },
        this.lang == 'ar'
          ? { title: 'المبنى', field: 'buildingNameAr' }
          : { title: 'Building', field: 'buildingNameEn' },
        {
          title: this.lang == 'ar' ? 'الوحدات' : 'Units',
          field: 'unitsName',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ بداية العقد' : 'Start contract date',
          field: 'startContractDate',
        },
        {
          title: this.lang == 'ar' ? 'تاريخ نهاية العقد' : 'End contract date',
          field: 'endContractDate',
        },
        this.lang == "ar" ? {
          title: "تجديد العقد",
          field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
            this.showConfirmRenewMessage(cell.getRow().getData().id, cell.getRow().getData().rentContractSettingId)
          }
        }
          :
          {
            title: "Renew Contract",
            field: "", formatter: this.editFormatIcon, cellClick: (e, cell) => {
              this.showConfirmRenewMessage(cell.getRow().getData().id, cell.getRow().getData().rentContractSettingId)
            }
          },


      ];
    })
  }
  defineRentContractDuesGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.rentContractDuesColumnNames = [

        this.lang == 'ar'
          ? { title: 'نوع الأستحقاق', field: 'typeNameAr' }
          : { title: 'Due Type', field: 'typeNameEn' },

        {
          title: this.lang == 'ar' ? ' قيمة الاستحقاق' : 'Due Amount',
          field: 'dueAmount'

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
          ? { title: 'المالك', field: 'ownerNameAr' }
          : { title: ' Owner  ', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'المستأجر', field: 'tenantNameAr' }
          : { title: 'Tenant', field: 'tenantNameEn' }





      ];
    })
  }
  defineGenerateEntryRentContractDuesGridColumn() {
    
    if (this.generateDetailsDueEntryForRentContracts == undefined || this.generateDetailsDueEntryForRentContracts == null) {
      this.generateDetailsDueEntryForRentContracts = false;
    }
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.generateEntryRentContractDuesColumnNames = [

        this.lang == 'ar'
          ? { title: 'نوع الأستحقاق', field: 'typeNameAr' }
          : { title: 'Due Type', field: 'typeNameEn' },

        {
          title: this.lang == 'ar' ? ' قيمة الاستحقاق' : 'Due Amount',
          field: 'dueAmount' 

        },
        {
          title: this.lang == 'ar' ? 'تاريخ بداية الأستحقاق' : 'Start Due Date',
          field: 'dueStartDate',
        },

        {
          title: this.lang == 'ar' ? 'تاريخ نهاية الأستحقاق' : 'End Due Date',
          field: 'dueEndDate', visible: this.generateDetailsDueEntryForRentContracts
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
          ? { title: 'المالك', field: 'ownerNameAr' }
          : { title: ' Owner  ', field: 'ownerNameEn' },

        this.lang == 'ar'
          ? { title: 'المستأجر', field: 'tenantNameAr' }
          : { title: 'Tenant', field: 'tenantNameEn' },
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
  showConfirmRenewMessage(id: any, settingId: any) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("dashboard.confirm-renew-rent-contract");
    modalRef.componentInstance.title = this.translate.transform("dashboard.renew-rent-contract");
    modalRef.componentInstance.btnConfirmTxt = this.translate.transform("buttons.yes");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      if (rs == "Confirm") {
        this.renewContract(id, settingId);
      }
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
  renewContract(id: any, settingId: any) {
    this.router.navigate(['/control-panel/definitions/renew-rent-contract', id], { queryParams: { renew: true, settingid: settingId } });
  }
  generateEntry(id: any) {
    this.rentContractsService.addWithUrl("GenerateEntryOnDue", id).subscribe(
      result => {
         
        if (result.success == true) {
          this.alertsService.showSuccess(this.translate.transform("general.generate-entry-success"), this.translate.transform("messageTitle.done"));
          this.getRentContractsDues();
          this.defineGenerateEntryRentContractDuesGridColumn();

          return
        }
        else {
          this.errorMessage = this.translate.transform('general.generate-entry-error');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }

      },
      error => console.error(error))
  }

  direction: string = 'ltr';

  onSearchEndRentContractsTextChange(searchTxt: string) {

    this.searchEndRentContractsFilters = [
      [
        { field: 'id', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },
        { field: 'buildingNameEn', type: 'like', value: searchTxt },
        { field: 'buildingNameAr', type: 'like', value: searchTxt },
        { field: 'realestateNameAr', type: 'like', value: searchTxt },
        { field: 'realestateNameEn', type: 'like', value: searchTxt },
        { field: 'unitsName', type: 'like', value: searchTxt },

      ],
    ];
  }
  onSearchRentContractDuesTextChange(searchTxt: string) {
    this.searchRentContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },

      ],
    ];
  }
  onSearchGenerateEntryRentContractDuesTextChange(searchTxt: string) {
    this.searchGenerateRentContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameAr', type: 'like', value: searchTxt },
        { field: 'ownerNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameEn', type: 'like', value: searchTxt },
        { field: 'tenantNameAr', type: 'like', value: searchTxt },

      ],
    ];
  }



  //#endregion




}
