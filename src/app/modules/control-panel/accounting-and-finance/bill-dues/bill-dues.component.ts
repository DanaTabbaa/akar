import { Component, OnInit, Input, EventEmitter, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RentContractDueVM } from 'src/app/core/models/ViewModel/rent-contract-due-vm';
import { Store } from '@ngrx/store';
import { VMMaintenanceContractDues } from 'src/app/core/models/ViewModel/vm-maintenance-contract-dues';
import { SalesBuyContractDue } from 'src/app/core/models/sales-buy-contract-due';
import { BillsDues } from 'src/app/core/models/bills-dues';
import { MaintenanceContractDuesService } from 'src/app/core/services/backend-services/maintenance-contracts-dues.service';
import { RentContractDuesService } from 'src/app/core/services/backend-services/rent-contract-dues.service';
//import { SalesBuyContractDuesService } from 'src/app/core/services/backend-services/sales-buy-contracts-dues.service';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { RentContractStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';

@Component({
  selector: 'app-bill-dues',
  templateUrl: './bill-dues.component.html',
  styleUrls: ['./bill-dues.component.scss']
})
export class BillDuesComponent implements OnInit, OnChanges, OnDestroy {
  lang: string = '';
  subsList: Subscription[] = [];
  rentContractDues: RentContractDueVM[] = [];
  filterRentContractDues: RentContractDueVM[] = [];
  maintenanceContractDues: VMMaintenanceContractDues[] = [];
  filterMaintenanceContractDues: VMMaintenanceContractDues[] = [];
  salesBuyContractDues: SalesBuyContractDue[] = [];
  filterSalesBuyContractDues: SalesBuyContractDue[] = [];

  billsDues: BillsDues[] = [];
  @Input() typeId: any;
  @Input() contractTypeIds: any;
  @Input() tenantId: any;
  @Input() sellerId: any;
  @Input() purchaserId: any;
  @Input() supplierId: any;

  @Output() onBillDuesChange: EventEmitter<BillsDues[]> = new EventEmitter();

  constructor(private store: Store<any>,
    private maintenanceContractDuesService: MaintenanceContractDuesService,
    private rentContractDuesService: RentContractDuesService,
    //private salesBuyContractDuesService: SalesBuyContractDuesService,
    private SharedServices: SharedService,
    private systemSettingsService: SystemSettingsService



  ) { }

  ngOnInit(): void {
    this.getLanguage();
  }
  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })

  }
  ngOnChanges(changes: SimpleChanges): void {
     
    if (this.typeId == 1) {

      this.getRentContractDues();
    }
    else if (this.typeId == 2) {
       
      this.getMaintenanceContractDues();
    }
    else if (this.typeId == 4 || this.typeId == 5) {//4: sales bill - 5:Buy bill
       
      this.getSalesBuyContractDues();
    }
  }
  getRentContractDues() {
    if (this.tenantId > 0) {
      this.rentContractDues = [];
      this.filterRentContractDues = [];
      return new Promise<void>((acc, rej) => {
        let sub = this.rentContractDuesService.getAll("getAll")
          .subscribe(
            (data: ResponseResult<RentContractDueVM[]>) => {
              if (this.contractTypeIds != null && this.contractTypeIds != "") {
                let contractTypeIds = JSON.parse("[" + this.contractTypeIds + "]");
                contractTypeIds.forEach(element => {
                  this.filterRentContractDues = data.data?.filter(x => x.isInvoiced != true && x.tenantId == this.tenantId
                    && (x.contractStatus == RentContractStatusEnum.Issued
                      || x.contractStatus == RentContractStatusEnum.IssueRenew
                    )
                    &&
                    x.contractSettingId == element
                  )!;

                  if (this.filterRentContractDues.length > 0 && this.filterRentContractDues != null) {
                    this.filterRentContractDues.forEach(element2 => {

                      this.rentContractDues.push(element2);
                    })
                  }
                });


              }
              else {
                this.rentContractDues = data.data?.filter(x => x.isInvoiced != true && x.tenantId == this.tenantId
                  && (x.contractStatus == RentContractStatusEnum.Issued
                    || x.contractStatus == RentContractStatusEnum.IssueRenew
                  ))!;
              }
              acc();

            },
            (err: any) => {
              acc();
            },
            () => {

            }
          );
        this.subsList.push(sub);
      });
    }
    else {
      this.rentContractDues = [];
      this.filterRentContractDues = [];
      return;
    }
    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.store.select(RentContractDuesSelectors.selectors.getListSelector).subscribe({
    //     next: (res: RentContratDuesModel) => {
    //       //
    //       this.rentContractDues = JSON.parse(JSON.stringify(res.list.filter(x=>x.isInvoiced!=true )))
    //       resolve();
    //     },
    //     error: (err: any) => {
    //       reject(err);
    //     },
    //     complete: () => {

    //     },
    //   });
    //   this.subsList.push(sub);
    // });

  }

  getMaintenanceContractDues() {
     
    if (this.supplierId > 0) {
      this.maintenanceContractDues = [];
      return new Promise<void>((resolve, reject) => {
        let sub = this.maintenanceContractDuesService.getWithResponse<VMMaintenanceContractDues[]>("GetAllVMFromSubTable").subscribe({
          next: (res) => {
            if (res.success) {
               
              this.maintenanceContractDues = res.data?.filter(x => x.isInvoiced != true && x.supplierId == this.supplierId)!;
            }
            resolve();

          },
          error: (err: any) => {
            resolve();
          },
          complete: () => {

            resolve();
          },
        });

        this.subsList.push(sub);
      });
    }
    else {
      this.maintenanceContractDues = [];
      return;
    }

    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.store.select(MaintenanceContractDuesSelectors.selectors.getListSelector).subscribe({
    //     next: (res: MaintenanceContractDuesModel) => {
    //       //
    //
    //       this.maintenanceContractDues = JSON.parse(JSON.stringify(res.list.filter(x=>x.isInvoiced!=true)))
    //       resolve();
    //     },
    //     error: (err: any) => {
    //       reject(err);
    //     },
    //     complete: () => {

    //     },
    //   });
    //   this.subsList.push(sub);
    // });

  }

  getSalesBuyContractDues() {
    let contractType
    if (this.typeId == 4)// Sales bill
    {
      contractType = 2
    } else if (this.typeId == 5)//Buy bill
    {
      contractType = 3
    }
    if (this.sellerId > 0 && this.purchaserId > 0) {
      this.salesBuyContractDues = [];
      return new Promise<void>((resolve, reject) => {
        // let sub = this.salesBuyContractDuesService.getWithResponse<SalesBuyContractDue[]>("GetAllVMFromSubTable").subscribe({
        //   next: (res) => {
        //     if (res.success) {
              
        //       // this.salesBuyContractDues = res.data!.filter(x => x.isInvoiced != true && x.contractTypeId == contractType
        //       //   && x.sellerId == this.sellerId && x.purchaserId == this.purchaserId);
        //     }
        //     resolve();

        //   },
        //   error: (err: any) => {
        //     resolve();
        //   },
        //   complete: () => {

        //     resolve();
        //   },
        // });

        // this.subsList.push(sub);
      });
    }
    else {
      this.salesBuyContractDues = [];
      return;
    }

    // return new Promise<void>((acc, rej) => {
    //   let sub = this.salesBuyContractDuesService.getAll("getAll")
    //     .subscribe(
    //       (res: ResponseResult<ContractDueVM[]>) => {
    //          
    //         this.salesBuyContractDues = res.data!.filter(x => x.isInvoiced != true && x.contractTypeId == this.typeId);

    //         acc();

    //       },
    //       (err: any) => {
    //         acc();
    //       },
    //       () => {

    //       }
    //     );
    //   this.subsList.push(sub);
    // });
    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.store.select(SalesBuyContractsDuesSelectors.selectors.getListSelector).subscribe({
    //     next: (res: SalesBuyContractsDuesModel) => {
    //       //
    //       this.salesBuyContractDues = JSON.parse(JSON.stringify(res.list.filter(x=>x.isInvoiced!=true&&x.contractTypeId==this.typeId)))
    //       resolve();
    //     },
    //     error: (err: any) => {
    //       reject(err);
    //     },
    //     complete: () => {

    //     },
    //   });
    //   this.subsList.push(sub);
    // });

  }

  selectSaleBuyDues(item: SalesBuyContractDue, event) {
    if (event.target.checked) {
      this.billsDues.push({
        amount: item.dueAmount,
        id: 0,
        notes: '',
        billId: 0,
        dueId: item.id,
        dueTypeId: ''
      });

    }
    else {
      let removedItem = this.billsDues.find(x => x.dueId == item.id);
      const index = this.billsDues.indexOf(removedItem!);
      if (index > -1) {
        this.billsDues.splice(index, 1);

      }


    }
    this.onBillDuesChange.emit(this.billsDues);

  }
  selectRentDues(item: RentContractDueVM, event) {
    if (event.target.checked) {
      this.billsDues.push({
        amount: item.dueAmount,
        id: 0,
        notes: '',
        billId: 0,
        dueId: item.id,
        dueTypeId: item.typeId
      });

    }
    else {
      let removedItem = this.billsDues.find(x => x.dueId == item.id);
      const index = this.billsDues.indexOf(removedItem!);
      if (index > -1) {
        this.billsDues.splice(index, 1);

      }


    }
    this.onBillDuesChange.emit(this.billsDues);



  }
  selectMaintenanceDues(item: VMMaintenanceContractDues, event) {


    if (event.target.checked) {
      console.log("event-----", event)
      this.billsDues.push({
        amount: item.dueAmount,
        id: 0,
        notes: '',
        billId: 0,
        dueId: item.id,
        dueTypeId: item.typeId
      });


    }
    else {
      let removedItem = this.billsDues.find(x => x.dueId == item.id);
      const index = this.billsDues.indexOf(removedItem!);
      if (index > -1) {
        this.billsDues.splice(index, 1);

      }


    }
    this.onBillDuesChange.emit(this.billsDues);


  }
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  setDecimalNumber(number: any) {
    return this.systemSettingsService.setDecimalNumber(number);
  }

}
