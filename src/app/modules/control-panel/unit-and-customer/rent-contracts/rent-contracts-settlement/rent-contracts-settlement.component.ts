import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { accountType } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { Accounts } from 'src/app/core/models/accounts';
import { Tenants } from 'src/app/core/models/tenants';
import { AccountService } from 'src/app/core/services/backend-services/account.service';
import { RentContractSettlementService } from 'src/app/core/services/backend-services/rent-contract-settlement.service';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { TenantsService } from 'src/app/core/services/backend-services/tenants.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { SettelmentDetailsVM, SettlementDetailsNewVM, SettlementItems, SettlementsVM } from 'src/app/core/view-models/settlement-details-vm';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-rent-contracts-settlement',
  templateUrl: './rent-contracts-settlement.component.html',
  styleUrls: ['./rent-contracts-settlement.component.scss']
})
export class RentContractsSettlementComponent implements OnInit {
//properties
  tenants: Tenants[] = [];
  ownerAccount: Accounts[] = [];
  settingId: any;
  queryParams: any;
  contractid: any = "";
  lang: string = '';
  contractName!:string;

  settelmentDate!: { year: number, day: number, month: number };
  operationDate!: { year: number, day: number, month: number };
  isMonthlySettlement: boolean = false;
  masterSettelmentItems: SettelmentDetailsVM[] = [];
  extSettelmentItems: SettelmentDetailsVM[] = [];
  totalCustomerDueAmount!: number;
  serviceAmount:any = 0;
  sub: any;
  id: any = 0;
  valueForClient: number = 0;
  valueForOwner: number = 0;
  insert = 1;
  settlementType: any=1;
  SettlementList: SettelmentDetailsVM[] = [];
  settelmentPeriod: any;
  contractPeriod?: number;
  contractNumber:any;
  tenantId:any;
  servicesAmount:any;
  ownerAccountId:any;
  amount: any = 0;
  isSettlement:boolean=false;

  isGenerateEntry: boolean = false;
  settlementMaster: SettlementsVM = {
    tenantId: 0,
    contractDuration: 0,
    contractId: 0,
    id: 0,
    isGenerateEntry: this.isGenerateEntry,
    operationDate: "",
    settlementPeriod: 0,
    valueForCustomer: 0,
    valueForOwner: 0,
    settlmentamount: 0,
    settelmentDate: "",
    settelmentServiceAccId:0,
    sttelmentServiceAmount:0,
    isMonthlySettlement:false
  };




//
//constructor
  constructor(
    private tenantService: TenantsService,
    private accountService:AccountService,
    private dateService:DateCalculation,
    private router: Router,
     private route: ActivatedRoute,
     private rentContractSettlementService: RentContractSettlementService,
     private RentContractsService:RentContractsService,
     private modalService: NgbModal,
     private SharedServices: SharedService,
     private translate: TranslatePipe


  ) { }
//
//Oninit
  ngOnInit(): void {
    this.SharedServices.changeButton({ action: 'Index' } as ToolbarData);
     //this.SharedServices.changeToolbarPath(this.toolbarPathData);
    this.settelmentDate = this.dateService.getCurrentDate();
    this.operationDate = this.dateService.getCurrentDate();
    this.getLanguage();
    if(this.lang=='en')
    {
      this.contractName = localStorage.getItem("contractEnName")!;

    }
    else
    {
      this.contractName = localStorage.getItem("contractArName")!;

    }
    this.getTenants();
    this.getOwnerAccounts();

    this.queryParams = this.route.queryParams.subscribe(params => {

      if (params['settingid'] != null) {
        this.settingId = params['settingid'];
      }


    })

    this.sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          this.contractid=this.id;
          this.getContractById(this.id);
         this.doCalculate();

        }
      }

    })



  }
  //
  //methods

  doCalculate() {
    this.valueForClient = 0;
    this.valueForOwner = 0;
    this.insert == 0

    let d = this.dateService.getDateForInsert(this.settelmentDate);
    if (this.insert == 0) {
      d = this.dateService.getDateForInsert(this.settelmentDate);
    }
    this.rentContractSettlementService.calculateContractSettelment(this.contractid, d).subscribe(a => {
      this.SettlementList = a;

      this.contractNumber = this.SettlementList[0].contractNumber;

      this.settelmentPeriod = this.SettlementList[0].toSettelmentPeriod;
      this.contractPeriod = this.SettlementList[0].contractPeriod;
      this.tenantId = this.SettlementList[0].tenantId;

      this.SettlementList.forEach(x => {
        // if (this.isCalcSettelmentToOperationDate == true) {
        //   if (x.dueName != 'Insurance') {
        //     this.valueForClient += (x.settelmentRemainValue < 0 ? -x.settelmentRemainValue : 0);
        //     this.valueForOwner += (x.settelmentRemainValue > 0 ? x.settelmentRemainValue : 0);
        //   }

        // }
        // else {
          this.valueForClient += (x.totalRemainValue < 0 ? -x.totalRemainValue : 0);
          this.valueForOwner += (x.totalRemainValue > 0 ? x.totalRemainValue : 0);
      //  }

      });

      let insurance = this.SettlementList.find(x => x.typeId == 2)
      let paidInsurance = insurance == null || insurance == undefined ? 0 : insurance.totalPaid;


      this.valueForClient = this.valueForClient + paidInsurance;

      // this.SettlementList.forEach(element => {
      //   if (element.dueName == "Insurance") {
      //     this.totalStaticAmount = element.totalAmount;
      //   }
      // })
    });






  }
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getTenants() {

    const promise = new Promise<void>((resolve, reject) => {
      this.tenantService.getAll("GetAll").subscribe({
        next: (res: any) => {
            this.tenants = res.data.map((res: Tenants[]) => {
              return res
            });
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
  getOwnerAccounts() {

    const promise = new Promise<void>((resolve, reject) => {
      this.accountService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.ownerAccount = res.data.filter(x => x.accountType == accountType.Owner).map((res: Accounts[]) => {
            return res
          });
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
  setMasterSettlment(data: SettelmentDetailsVM[]) {
    this.masterSettelmentItems = data;
  }

  setExtSettlment(data: SettelmentDetailsVM[]) {
    this.extSettelmentItems = data;
  }

  getTotalDue(due)
  {
    this.totalCustomerDueAmount = due+this.serviceAmount;
  }
   getDate(e: { year: number, day: number, month: number }) {
    this.settelmentDate = e;
  }
  getOpDate(e: { year: number, day: number, month: number }) {
    this.operationDate = e;
  }
  doCalculateAndCreate()
  {
    let d = this.dateService.getDateForInsert(this.settelmentDate);
    let opDate = this.dateService.getDateForInsert(this.operationDate);
    if (this.insert == 0) {
      d = this.dateService.getDateForInsert(this.settelmentDate);
      opDate = this.dateService.getDateForInsert(this.operationDate);
    }


    d = this.dateService.getDateForInsert(this.settelmentDate);
    this.settlementMaster = {
      tenantId: this.tenantId,
      contractDuration: this.contractPeriod,
      contractId: this.contractid,
      id: 0,
      isGenerateEntry: this.isGenerateEntry == true ? true : false,
      isMonthlySettlement: this.isMonthlySettlement != null ? this.isMonthlySettlement : false,

      operationDate: opDate,
      settlementPeriod: this.settelmentPeriod,
      valueForOwner: this.valueForOwner,
      valueForCustomer: this.valueForClient,
      settlmentamount: this.amount,
      settelmentDate: d,
      settelmentServiceAccId:this.ownerAccountId,
      sttelmentServiceAmount:this.serviceAmount
    };

    let settlmentItems: SettlementItems[] = [];
    this.masterSettelmentItems.forEach(s => {
      settlmentItems.push({
        dueId: s.dueId,
        amount:s.settelmentRemainValue,
        discountAmount:s.totalAmount-s.settelmentForPeriod

      })
    });

    this.extSettelmentItems.forEach(s => {
      settlmentItems.push({
        dueId: s.dueId,
        amount:s.settelmentRemainValue,
        discountAmount:s.totalAmount-s.settelmentForPeriod

      })
    });

    let newSettlment: SettlementDetailsNewVM = {
      settlementItems: settlmentItems,
      contractSettlements: this.settlementMaster
    }

    this.rentContractSettlementService.addWithUrl("createContractSettlement",newSettlment).subscribe(result => {
      if (result != null) {
        this.router.navigate(['/control-panel/definitions/rent-contracts-list'],{ queryParams: { settingid: this.settingId } });
      }
    },
      error => console.error(error));
  }
  showConfirmDeleteMessage(e: Event) {
    e.preventDefault();
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform(
      'messages.confirm-delete'
    );
    modalRef.componentInstance.title =
      this.translate.transform('messages.delete');
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      if (rs == "Confirm") {
        this.deleteSett(e);
      }
    })

  }
  deleteSett(e: Event) {

    e.preventDefault();
     this.rentContractSettlementService.deleteWithUrl("deleteContractSettelment?id="+this.id).subscribe(result => {
      //  if (result != false)
     this.router.navigate(['/control-panel/definitions/rent-contracts-list'],{ queryParams: { settingid: this.settingId } });
     });

  }
  getContractById(id: any) {

    const promise = new Promise<void>((resolve, reject) => {
      this.RentContractsService.getByIdWithUrl("GetById?id="+id).subscribe({
        next: (res: any) => {

         this.tenantId=res.data.tenantId;
         this.ownerAccountId=res.data.ownerAccountId;
        if(res.data.contractStatus==3 || res.data.contractStatus==4)
        {
          this.isSettlement=true
        }
        else
        {
          this.isSettlement=false

        }

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
  selectGenerateEntry(event)
  {
    if(event.target.checked)
    {
       this.isGenerateEntry=true
    }
    else
    {
      this.isGenerateEntry=false

    }
  }

}

