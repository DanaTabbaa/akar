import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RentContractSettlementService } from 'src/app/core/services/backend-services/rent-contract-settlement.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { SettelmentDetailsVM, Totals } from 'src/app/core/view-models/settlement-details-vm';
import { SharedService } from 'src/app/shared/services/shared.service';



@Component({
  selector: 'app-reusable-rent-contract-dues',
  templateUrl: './reusable-rent-contract-dues.component.html',
  styleUrls: ['./reusable-rent-contract-dues.component.scss']
})
export class ReusablRentContractDuesComponent implements OnInit {

  //Propeties
  lang: any = '';
  valueForClient?: number;
  valueForOwner?: number;
  settelmentList: SettelmentDetailsVM[] = [];
  //contractSettelmentTotals!:FormGroup;
  @Input() operationDate!: { year: number; month: number; day: number; };
  @Input() contractId?: number;
  @Output() onMasterSettelmentChange: EventEmitter<SettelmentDetailsVM[]> = new EventEmitter();
  @Output() onExtSettelmentChange: EventEmitter<SettelmentDetailsVM[]> = new EventEmitter();
  //added by mohamed fawzy
  @Input() isMonthlySettlement: boolean | undefined;
  FormsModule
  /////
  //@Input() isHasChild:boolean;
  //extSettelmentList: SettelmentDetailsVM[] = [];
  //extContractData: any;
  contractSettelmentTotals: Totals = new Totals();
  //extContractSettelmentTotals: Totals = new Totals();

  @Output() getTotalDue: EventEmitter<number> = new EventEmitter();
  customerDue: number = 0;

  direction: string = 'ltr';



  // settlmentPeriod:number = 0;
  // contractPeriod:number = 0;

  @Input() isCalcSettelmentToOperationDate: boolean = false;


  //

  //#region Constructor
  constructor(
    private router: Router,
    private rentContractSettlementService: RentContractSettlementService,
    private dateCalculation: DateCalculation,
    private SharedServices: SharedService,
    private fb: FormBuilder, private route: ActivatedRoute
  ) {

  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getLanguage();
    this.doCalculate();
  //  this.defineGridColumn();
  }
  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {

  }
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  doCalculate() {
    this.valueForClient = 0;
    this.valueForOwner = 0;

    let date: any = this.dateCalculation.getDateForInsert(this.operationDate);
    this.rentContractSettlementService.calculateContractSettelment(this.contractId, date).subscribe(data => {
      this.settelmentList = data;
      this.contractSettelmentTotals = {
        totalAddedValue: 0,
        totalDiscountValue: 0,
        totalDueAmount: 0,
        totalPaidValue: 0,
        totalRemainValue: 0,
        totalSettelment: 0,
        totalSettelmentDiscount: 0
      };
      this.settelmentList.forEach(item => {
        this.contractSettelmentTotals.totalDueAmount += item.totalAmount;
        this.contractSettelmentTotals.totalAddedValue += item.totalAddedValue;
        this.contractSettelmentTotals.totalDiscountValue += item.totalDiscountValue;
        this.contractSettelmentTotals.totalSettelmentDiscount += (item.totalAmount - item.settelmentForPeriod);
        this.contractSettelmentTotals.totalPaidValue += item.totalPaid;
        this.contractSettelmentTotals.totalRemainValue += item.settelmentRemainValue;
        this.contractSettelmentTotals.totalSettelment += item.settelmentForPeriod;


      });


      this.contractSettelmentTotals =
      {
        totalAddedValue: Number(this.contractSettelmentTotals.totalAddedValue.toFixed(2)),
        totalDiscountValue: Number(this.contractSettelmentTotals.totalDiscountValue.toFixed(2)),
        totalDueAmount: Number(this.contractSettelmentTotals.totalDueAmount.toFixed(2)),
        totalPaidValue: Number(this.contractSettelmentTotals.totalPaidValue.toFixed(2)),
        totalRemainValue: Number(this.contractSettelmentTotals.totalRemainValue.toFixed(2)),
        totalSettelment: Number(this.contractSettelmentTotals.totalSettelment.toFixed(2)),
        totalSettelmentDiscount: Number(this.contractSettelmentTotals.totalSettelmentDiscount.toFixed(2)),
      };

      this.customerDue = this.contractSettelmentTotals.totalRemainValue;
      this.getTotalDue.emit(this.customerDue);

      this.onMasterSettelmentChange.emit(this.settelmentList);

      // this.leasingService.getExtendedContract(this.contractId).subscribe(extContract => {
      //   if (extContract) {
      //     ////(("Extended Contract Data", extContract)
      //     this.extContractData = extContract;
      //     this.leasingService.calculateContractSettelmentNew(extContract.id, date).subscribe(extData => {
      //       if (extData) {
      //         this.extSettelmentList = extData;

      //         this.extContractSettelmentTotals = {
      //           totalAddedValue: 0,
      //           totalDiscountValue: 0,
      //           totalDueAmount: 0,
      //           totalPaidValue: 0,
      //           totalRemainValue: 0,
      //           totalSettelment: 0,
      //           totalSettelmentDiscount: 0
      //         };
      //         this.extSettelmentList.forEach(item => {
      //           this.extContractSettelmentTotals.totalDueAmount += item.totalAmount;
      //           this.extContractSettelmentTotals.totalAddedValue += item.totalAddedValue;
      //           this.extContractSettelmentTotals.totalDiscountValue += item.totalDiscountValue;
      //           this.extContractSettelmentTotals.totalSettelmentDiscount += (item.totalAmount - item.settelmentForPeriod);
      //           this.extContractSettelmentTotals.totalPaidValue += item.totalPaid;
      //           this.extContractSettelmentTotals.totalRemainValue += item.settelmentRemainValue;
      //           this.extContractSettelmentTotals.totalSettelment += item.settelmentForPeriod;
      //         });
      //         this.extContractSettelmentTotals =
      //         {
      //           totalAddedValue: Number(this.extContractSettelmentTotals.totalAddedValue.toFixed(2)),
      //           totalDiscountValue: Number(this.extContractSettelmentTotals.totalDiscountValue.toFixed(2)),
      //           totalDueAmount: Number(this.extContractSettelmentTotals.totalDueAmount.toFixed(2)),
      //           totalPaidValue: Number(this.extContractSettelmentTotals.totalPaidValue.toFixed(2)),
      //           totalRemainValue: Number(this.extContractSettelmentTotals.totalRemainValue.toFixed(2)),
      //           totalSettelment: Number(this.extContractSettelmentTotals.totalSettelment.toFixed(2)),
      //           totalSettelmentDiscount: Number(this.extContractSettelmentTotals.totalSettelmentDiscount.toFixed(2)),
      //         };
      //         if(this.extContractData)
      //         {
      //           this.customerDue += this.extContractSettelmentTotals.totalRemainValue;
      //         }

      //         this.getTotalDue.emit(this.customerDue);

      //         this.onExtSettelmentChange.emit(this.extSettelmentList);
      //       }else
      //       {
      //         this.getTotalDue.emit(this.customerDue);
      //       }




      //     });
      //   }

      // });

    });
  }
  // //#region Tabulator
  // panelId: number = 1;
  // sortByCols: any[] = [];
  // searchFilters: any;
  // groupByCols: string[] = [];
  // columnNames: any[] = [];
  // defineGridColumn() {
  //   this.SharedServices.getLanguage().subscribe(res => {
  //     this.lang = res
  //     this.columnNames = [
  //       {
  //         title: this.lang == 'ar' ? ' رقم العقد' : 'Contract Number',
  //         field: 'contractNumber',
  //       },
  //       this.lang == 'ar'
  //         ? { title: 'الأستحقاق', field: 'dueNameAr' }
  //         : { title: 'Due', field: 'dueNameEn' },
  //       {
  //         title: this.lang == 'ar' ? 'تاريخ بداية الأستحقاق' : 'Due Start Date',
  //         field: 'dueStartDate',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'تاريخ نهاية الأستحقاق' : ' Due End Date',
  //         field: 'dueEndDate',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'مدة الأستحقاق' : 'Due Period',
  //         field: 'duePeriod',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'مبلغ الأستحقاق' : 'Due Amount',
  //         field: 'totalAmount',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'مدة التسوية' : 'Settlement Period',
  //         field: 'toSettelmentPeriod',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'يخصم القيمة الغير مستحقة' : 'Discount not due amount',
  //         field: 'totalAmount - settelmentForPeriod',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'قيمة التسوية' : 'Settlement Amount',
  //         field: 'settelmentForPeriod',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'الاضافات' : 'additions',
  //         field: 'totalAddedValue',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'الخصومات' : 'Discounts',
  //         field: 'totalDiscountValue',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'المدفوع' : 'Paid',
  //         field: 'totalPaid',
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'المتبقى' : 'Remain',
  //         field: 'settelmentRemainValue',
  //       },

  //     ];
  //   })
  // }


  // onSearchTextChange(searchTxt: string) {
  //   this.searchFilters = [
  //     [
  //       { field: 'contractNumber', type: 'like', value: searchTxt },
  //       { field: 'dueNameEn', type: 'like', value: searchTxt },
  //       { field: 'dueNameAr', type: 'like', value: searchTxt },
  //       ,
  //     ],
  //   ];
  // }

  // //#endregion


}
