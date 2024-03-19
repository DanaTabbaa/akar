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
import { MaintenanceContractStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { MaintenanceContractDuesService } from 'src/app/core/services/backend-services/maintenance-contracts-dues.service';
import { VMMaintenanceContractDues } from 'src/app/core/models/ViewModel/vm-maintenance-contract-dues';
import { MaintenanceContractsService } from 'src/app/core/services/backend-services/maintenance-contracts.service';


@Component({
  selector: 'app-maintenance-contracts-notification',
  templateUrl: './maintenance-contracts-notification.component.html',
  styleUrls: ['./maintenance-contracts-notification.component.scss']
})
export class MaintenanceContractsNotificationComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() showDailyDuesForMaintenanceContracts!: boolean;

  @Input() showGenerateEntryNotificationForMaintenanceContracts!: boolean;
  @Input() notificationPeriodForMaintenanceContracts!: number;

  subsList: Subscription[] = [];
  lang: string = '';
  errorMessage = '';
  errorClass = ''
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number

  maintenanceContractDues: VMMaintenanceContractDues[] = [];
  generateEntryMaintenanceContractDues: VMMaintenanceContractDues[] = [];

  isMaintenanceContractsDuesListEmpty;
  isGenerateEntryMaintenanceContractDuesListEmpty;


  editFormatIcon() { //plain text value
    return "<i class=' fa fa-edit'></i>";
  };
  constructor(private SharedServices: SharedService,
    private router: Router,
    private dateService: DateCalculation,
    private store: Store<any>,
    private modalService: NgbModal,
    private translate: TranslatePipe,
    private maintenanceContractService: MaintenanceContractsService,
    private maintenanceContractDuesService: MaintenanceContractDuesService,
    private SystemSettingsService: SystemSettingsService,
    private alertsService: NotificationsAlertsService,

  ) { }

  ngOnInit(): void {
    this.getLanguage();
    this.getSystemSettings();
    this.getMaintenanceContractsDues();
    this.defineMaintenanceContractDuesGridColumn();
    this.defineGenerateEntryMaintenanceContractDuesGridColumn();

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


  getMaintenanceContractsDues() {
    const promise = new Promise<void>((resolve, reject) => {
      this.maintenanceContractDuesService.getWithResponse<VMMaintenanceContractDues[]>("GetAllVMFromSubTable").subscribe({
        next: (res: any) => {
           
          this.maintenanceContractDues = res.data.map((res: VMMaintenanceContractDues[]) => {
            return res
          });
          if (this.maintenanceContractDues.length == 0) {
            this.isMaintenanceContractsDuesListEmpty = true
          }
          let notificationDate = this.dateService.AddDaysToGregorian(this.notificationPeriodForMaintenanceContracts,
            {
              year: new Date().getUTCFullYear(),
              month: (new Date().getMonth() + 1),
              day: new Date().getDate()
            }
          );
           
          this.generateEntryMaintenanceContractDues = res.data.filter(x => x.isEntryGenerated != true && x.contractStatus == MaintenanceContractStatusEnum.Issued  && x.dueStartDate <= notificationDate).map((res: VMMaintenanceContractDues[]) => {
            return res
          });
          if (this.generateEntryMaintenanceContractDues.length == 0) {
            this.isGenerateEntryMaintenanceContractDuesListEmpty = true
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
  searchMaintenanceContractDuesFilters: any;
  searchGenerateMaintenanceContractDuesFilters: any;
  groupByCols: string[] = [];
  maintenanceContractDuesColumnNames: any[] = [];
  generateEntryMaintenanceContractDuesColumnNames: any[] = [];


 
  defineMaintenanceContractDuesGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.maintenanceContractDuesColumnNames = [

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
          ? { title: 'المورد', field: 'supplierNameAr' }
          : { title: 'عححمهثق', field: 'supplierNameEn' },

       





      ];
    })
  }
  defineGenerateEntryMaintenanceContractDuesGridColumn() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
      this.generateEntryMaintenanceContractDuesColumnNames = [

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
          ? { title: 'المورد', field: 'supplierNameAr' }
          : { title: 'Supplier', field: 'supplierNameEn' },

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
    this.maintenanceContractService.addWithUrl("GenerateEntryOnDue", id).subscribe(
      result => {
         
        if(result.success==true)
        {
          this.alertsService.showSuccess(this.translate.transform("general.generate-entry-success"), this.translate.transform("messageTitle.done"));
          this.getMaintenanceContractsDues();
          this.defineGenerateEntryMaintenanceContractDuesGridColumn();

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


  onSearchMaintenanceContractDuesTextChange(searchTxt: string) {
    this.searchMaintenanceContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'supplierNameAr', type: 'like', value: searchTxt },
        { field: 'supplierNameEn', type: 'like', value: searchTxt },
      

      ],
    ];
  }
  onSearchGenerateEntryMaintenanceContractDuesTextChange(searchTxt: string) {
    this.searchGenerateMaintenanceContractDuesFilters = [
      [
        { field: 'typeNameAr', type: 'like', value: searchTxt },
        { field: 'typeNameEn', type: 'like', value: searchTxt },
        { field: 'dueAmount', type: 'like', value: searchTxt },
        { field: 'contractNumber', type: 'like', value: searchTxt },
        { field: 'contractSettingNameEn', type: 'like', value: searchTxt },
        { field: 'contractSettingNameAr', type: 'like', value: searchTxt },
        { field: 'supplierNameAr', type: 'like', value: searchTxt },
        { field: 'supplierNameEn', type: 'like', value: searchTxt },

      ],
    ];
  }



  //#endregion




}
