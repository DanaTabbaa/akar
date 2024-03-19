import { Component, OnInit, Input, EventEmitter, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { SalesBuyContractsService } from 'src/app/core/services/backend-services/sales-contracts.service';
import { VoucherDueDetails, VoucherRentDueDetailsVm } from 'src/app/core/models/voucher-due-details';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { MaintenanceContractsService } from 'src/app/core/services/backend-services/maintenance-contracts.service';
import { VoucherMaintenanceContractsDuesVM } from 'src/app/core/models/ViewModel/voucher-maintenance-contracts-dues-vm';
import { VoucherDueDetailsService } from 'src/app/core/services/backend-services/voucher-due-details.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PaginationService } from 'src/app/core/services/local-services/pagination.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { VouchersRentContractsDuesVM } from 'src/app/core/models/ViewModel/vouchers-rent-contracts-dues-vm';
import { VouchersSalesBuyContractsDuesVM } from 'src/app/core/models/ViewModel/vouchers-sales-buy-contracts-dues-vm';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { RentContractDuesService } from 'src/app/core/services/backend-services/rent-contract-dues.service';

@Component({
  selector: 'app-voucher-dues',
  templateUrl: './voucher-dues.component.html',
  styleUrls: ['./voucher-dues.component.scss']
})
export class VoucherDuesComponent implements OnInit, OnChanges, OnDestroy {
  subsList: Subscription[] = [];
  //salesBuyContractDues:VouchersSalesBuyContractsDuesVM[] = [];
  //rentContractDues:VouchersRentContractsDuesVM[] = [];
  //maintenanceContractDues:VoucherMaintenanceContractsDuesVM[] = [];

  //voucherDues:VoucherDueDetails[] = [];
  // @Input() typeId:any;
  // //@Input() ownerId:any;
  // @Input() tenantId:any;
  // @Input() purchaserId:any;
  // @Input() id: any;
  // @Input() contractsSettings:ContractsSettings[]=[];
  @Input() voucherRentDuesDetails: VoucherRentDueDetailsVm[] = []

  @Output() onVoucherDueDetailsChange: EventEmitter<VoucherDueDetails[]> = new EventEmitter();
  pagination: any = {};

  // Paged items
  //pagedRentContractsItems!: any[];
  //pagedSalesBuyContractsItems!: any[];
  //pagedMaintenanceContractsItems!: any[];

  showDecimalPoint: any;
  showThousandsComma: any;
  showRoundingFractions: any;
  numberOfFraction: any;
  constructor(
    private sharedServices: SharedService,
    private systemSettingsService: SystemSettingsService,
  ) { }

  ngOnInit(): void {
    this.getLanguage();
    this.getSystemSettings();
  }
  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })

  }
  getSystemSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.systemSettingsService.getAll("GetAll").subscribe({
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
  // getSalesBuyContractDues() {

  //   let sub = this.contractService.getWithResponse<VouchersSalesBuyContractsDuesVM[]>('GetVoucherContractDues?typeId='+this.typeId).subscribe({
  //     next:(res)=>{
  //       if(res.success){

  //         this.salesBuyContractDues = res.data?.filter(x=>x.ownerId==this.ownerId&&x.purchaserId==this.purchaserId)!;
  //         this.salesBuyContractDues.forEach(c=>{
  //           this.voucherDues.push({
  //             amount:0,
  //             id:0,
  //             notes:'',
  //             parentId:0,
  //             dueId:c.id,
  //             contractKindId:c.contractTypeId

  //           });
  //         })
  //         this.setSalesBuyContractsPage(1);        // Initialize to page 1


  //       }


  //     },
  //     error:(err)=>{

  //     },
  //     complete:()=>{}
  //   });

  //   this.subsList.push(sub);

  // }
  // getRentContractDues()
  // {
  //   this.rentContractService.getVoucherRentContractDues(this.typeId).subscribe(a => {
  //      
  //     this.rentContractDues = a.filter(x=>x.ownerId==this.ownerId && x.tenantId==this.tenantId);
  //     this.rentContractDues.forEach(c=>{
  //       this.voucherDues.push({
  //         amount:0,
  //         id:0,
  //         notes:'',
  //         parentId:0,
  //         dueId:c.id,
  //         contractKindId:1

  //       });
  //     })
  //      
  //     this.setPage(1);        // Initialize to page 1

  //   })
  // }
  // getMaintenanceContractDues() {
  //   let sub = this.maintenanceContractService.getWithResponse<VoucherMaintenanceContractsDuesVM[]>('GetVoucherMaintenanceContractDues?typeId='+this.typeId).subscribe({
  //     next:(res)=>{
  //       if(res.success){
  //          
  //         this.maintenanceContractDues = res.data!;
  //         this.maintenanceContractDues.forEach(c=>{
  //           this.voucherDues.push({
  //             amount:0,
  //             id:0,
  //             notes:'',
  //             parentId:0,
  //             dueId:c.id,
  //             contractKindId:4
  //           });
  //         })
  //         this.setMaintenanceContractsPage(1);

  //       }


  //     },
  //     error:(err)=>{

  //     },
  //     complete:()=>{}
  //   });

  //   this.subsList.push(sub);

  // }


  ngOnChanges(changes: SimpleChanges): void {



  }

  // getVoucherDueDetailsById(parentId: any) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.voucherDueDetailsService.getWithResponse<VoucherDueDetails[]>("GetListByFieldNameVM?fieldName=Parent_Id&fieldValue=" + parentId).subscribe({
  //       next: (res: ResponseResult<VoucherDueDetails[]>) => {
  //         if (res.success) {

  //           this.voucherDues = JSON.parse(JSON.stringify(res.data));
  //           this.onVoucherDueDetailsChange.emit(this.voucherDues);



  //         }
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });

  //     this.subsList.push(sub);
  //   });

  // }
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  onAmountchange(i) {
    // var remain = this.getRemain(i);
    this.prepareVoucherDues();


  }
  //#region Tabulator
  panelId: number = 1;
  sortByCols: any[] = [];
  searchFilters: any;
  groupByCols: string[] = [];
  lang: string = '';
  columnNames: any[] = [];
  // defineRentContractDuesGridColumn() {
  //   this.sharedServices.getLanguage().subscribe(res => {
  //     this.lang = res
  //     this.columnNames = [
  //       {
  //         title: this.lang == 'ar' ? 'قيمة الاستحقاق' : 'Due Amount',
  //         field: 'dueAmount',
  //       },


  //       {
  //         title: this.lang == 'ar' ? 'الدفعة' : ' Payment', editor: "input",
  //         field: 'amount',
  //         cellEdited: (e, cell) => {

  //           this.onAmountchange();
  //         }
  //       },
  //       {
  //         title: this.lang == 'ar' ? 'ملاحظات' : ' Notes', editor: "input",
  //         field: 'notes',
  //       },


  //     ];
  //   })
  // }


  direction: string = 'ltr';
  onSearchRentContractDuesTextChange(searchTxt: string) {
    this.searchFilters = [
      [
        { field: 'id', type: 'like', value: searchTxt },
        { field: 'nameAr', type: 'like', value: searchTxt },
        { field: 'nameEn', type: 'like', value: searchTxt },
        ,
      ],
    ];
  }

  //#endregion
  // setPage(page: number) {
  //    
  //   // if (page < 1 || page > this.pagination.totalPages) {
  //   //   return;
  //   // }

  //   // Get pagination object from service
  //   this.pagination = this.paginationService.getPagination(this.rentContractDues.length, page);

  //   // Get current page of items
  //   this.pagedRentContractsItems = this.rentContractDues.slice(this.pagination.startIndex, this.pagination.endIndex + 1);
  // }
  // setSalesBuyContractsPage(page: number) {
  //   // Get pagination object from service
  //   this.pagination = this.paginationService.getPagination(this.salesBuyContractDues.length, page);
  //   // Get current page of items
  //   this.pagedSalesBuyContractsItems = this.salesBuyContractDues.slice(this.pagination.startIndex, this.pagination.endIndex + 1);
  // }
  // setMaintenanceContractsPage(page: number) {
  //   // Get pagination object from service

  //   this.pagination = this.paginationService.getPagination(this.maintenanceContractDues.length, page);
  //   // Get current page of items
  //   this.pagedMaintenanceContractsItems = this.maintenanceContractDues.slice(this.pagination.startIndex, this.pagination.endIndex + 1);
  // }
  setDecimalNumber(number: any) {
    return this.systemSettingsService.setDecimalNumber(number);
  }

  getRemain(index: number) {
    let selectedDue = this.voucherRentDuesDetails[index];
   // console.log("Selected Due", index, selectedDue, this.voucherRentDuesDetails[index].dueAmount - this.voucherRentDuesDetails[index].paid);
    let remain = (this.voucherRentDuesDetails[index].dueAmount ?? 0)
      - (this.voucherRentDuesDetails[index].paid ?? 0)
      - (this.voucherRentDuesDetails[index].recieveVoucherAmount ?? 0)
      + (this.voucherRentDuesDetails[index].payVoucherAmount ?? 0)
      - (this.voucherRentDuesDetails[index].creditNoteVoucherAmount ?? 0)
      + (this.voucherRentDuesDetails[index].debitNoteVoucherAmount ?? 0)
      - (this.voucherRentDuesDetails[index].amount ?? 0);
   // console.log("Remain Value --------------------------------------", remain, this.voucherRentDuesDetails[index].dueAmount - this.voucherRentDuesDetails[index].paid);
    return remain;
  }

  prepareVoucherDues() {
    let voucherDues: VoucherDueDetails[] = [];
    this.voucherRentDuesDetails.forEach(v=>{
      if(v.amount)
      {
        voucherDues.push({
          amount:v.amount,
          dueId:v.dueId,
          id:v.id,
          notes:v.notes,
          parentId:0,
          creditNoteVoucherAmount:v.creditNoteVoucherAmount,
          debitNoteVoucherAmount:v.debitNoteVoucherAmount,
          payVoucherAmount:v.payVoucherAmount,
          recieveVoucherAmount:v.recieveVoucherAmount,
          settlementAmount:v.settlementAmount,
          settlementDiscount:v.settlementDiscount          
        });
      }
    });

    this.onVoucherDueDetailsChange.emit(voucherDues);
  }
}
