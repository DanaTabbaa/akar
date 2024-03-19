import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { VoucherDetail } from 'src/app/core/models/voucher-detail';
import { Subscription } from 'rxjs';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { Unit } from 'src/app/core/models/units';
import { Store } from '@ngrx/store';
import { Accounts } from 'src/app/core/models/accounts';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { VoucherDetailsService } from 'src/app/core/services/backend-services/voucher-details.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { AccIntegrationTypeEnum, AccountStateEnum } from 'src/app/core/constants/enumrators/enums';
import { GeneralIntegrationSettings } from 'src/app/core/models/general-integration-settings';

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.component.html',
  styleUrls: ['./voucher-details.component.scss'],
})
export class VoucherDetailsComponent implements OnInit, OnDestroy, OnChanges {
  voucherDetails: VoucherDetail[] = [];
  @Input() voucherDetialsForUpdate:VoucherDetail[]=[];
  //selectedAcc?: Account;
  selectedVoucherDetails: VoucherDetail = new VoucherDetail();
  //accounts: Accounts[] = [];
  units: Unit[] = [];
  errorMessage = '';
  errorClass = ''
  @Output() onVoucherDetailsChange: EventEmitter<VoucherDetail[]> =
    new EventEmitter();
  @Input() id: any;
  @Input() ownerId: any;
  @Input() buildingId: any;
  @Input() kindId: any = 1;
  @Input() contractKindId: any;
  @Input() accounts:Accounts[]=[];

  generalAccountIntegration!: GeneralIntegrationSettings | null;
  subsList: Subscription[] = [];
  constructor(
    private searchDialog: SearchDialogService,
    private store: Store<any>,
    private voucherDetailsServices: VoucherDetailsService,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,
    private managerService:ManagerService

  ) { }

  lang:string = "";
  ngOnInit(): void {

    this.lang = localStorage.getItem("language")??"ar";
    Promise.all([
      //this.managerService.loadGeneralAccountIntegrationSetting(),
      this.managerService.loadAccounts(),
      this.managerService.loadUnits()
    ]).then(a=>{
      //this.accounts = this.managerService.getAccounts().filter(x=>x.accState == AccountStateEnum.Sub && !x.deActivate);
      //console.log("Account General Integraion Settings", a[0]);
      // this.generalAccountIntegration = a[0];
      // if (this.generalAccountIntegration) //General Account Integration 
      // {

      //   if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Resort) {
      //     this.getResortAccounts();
      //   }
      //   else if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Web) {
      //     this.getWebAccounts();
      //   }

      // }
      this.units = this.managerService.getUnits();
    });
  }

  // getResortAccounts() {
  //   this.accounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
   
  // }


  // getWebAccounts() {
  //   this.accounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    
  // }


  // getResortAccountsByOwner(ownerId: any) {
  //   this.accounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && x.ownerId == ownerId);
   
  // }


  // getWebAccountsByOwner(ownerId) {
  //   this.accounts = this.managerService.getAccounts().filter(x => x.extAccId && x.ownerId == ownerId);
    
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ownerId) {
      
      //this.getUnits();
      this.units = this.managerService.getUnits().filter(x=>x.ownerId == this.ownerId);

    }
    else{
      this.units = this.managerService.getUnits();
    }
    
    if (this.id > 0) {
     // this.getVoucherDetailsById(this.id)
     this.voucherDetialsForUpdate.forEach(d=>{
      let account = this.accounts.find(x=>x.id == d.accId);
      let unit = this.units.find(x=>x.id == d.unitId);
      //let accName:string = "";
      d.accName = this.lang=="ar"?(account?.accArName??""):(account?.accEnName??"");
      d.unitName = this.lang=="ar"?(unit?.unitNameAr??""):(unit?.unitNameEn??"");
      
     })
     this.voucherDetails = [...this.voucherDetialsForUpdate];

    }
  }

  // getAccounts() {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store
  //       .select(AccountsSelectors.selectors.getListSelector)
  //       .subscribe({
  //         next: (res: AccountsModel) => {
  //           this.accounts = JSON.parse(JSON.stringify(res.list));
  //           resolve();
  //         },
  //         error: (err) => {
  //           resolve();
  //         },
  //       });
  //     this.subsList.push(sub);
  //   });
  // }

  // getUnits() {
  //    
  //   let purposeType;

  //   if(this.contractKindId==1)
  //   {
  //     purposeType=1;
  //   }
  //   else if (this.contractKindId==2 || this.contractKindId==3)
  //   {
  //     purposeType=2;

  //   }
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store
  //       .select(UnitSelectors.selectors.getListSelector)
  //       .subscribe({
  //         next: (res: UnitsModel) => {
  //           this.units = JSON.parse(
  //             JSON.stringify(
  //               res.list.filter(
  //                 (x) =>
  //                   x.ownerId == this.ownerId && x.purposeType==purposeType
  //                 //&& x.buildingId == this.buildingId
  //               )
  //             )
  //           );
  //           resolve();
  //         },
  //         error: (err) => {
  //           //((err);
  //           resolve();
  //         },
  //       });
  //     this.subsList.push(sub);
  //   });
  // }

  openAccSearchDialog(i = -1) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedVoucherDetails?.accName ?? '';
    } else {
      searchTxt = this.voucherDetails[i].accName;
    }
    //accounts dropdown
    let data = this.accounts.filter((x) => {
      return (
        (x.accArName + ' ' + x.accArName + ' ' + x.accCode)
          .toLowerCase()
          .includes(searchTxt) ||
        (x.accArName + ' ' + x.accArName + ' ' + x.accCode)
          .toUpperCase()
          .includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectedVoucherDetails!.accName = data[0].accArName;
        this.selectedVoucherDetails!.accId = data[0].id;
      } else {
        this.voucherDetails[i].accName = data[0].accArName;
        this.voucherDetails[i].accId = data[0].id;
      }
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم انجليزى'];
      let names = ['accCode', 'accArName', 'accEnName'];
      let title = 'بحث عن الحساب';

      let sub = this.searchDialog
        .showDialog(lables, names, this.accounts, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {
              this.selectedVoucherDetails.accName = d.accArName;
              this.selectedVoucherDetails.accId = d.id;
            } else {
              this.voucherDetails[i].accName = d.accArName;
              this.voucherDetails[i].accId = d.id;
            }
          }
        });
      this.subsList.push(sub);
    }
    this.onVoucherDetailsChange.emit(this.voucherDetails);
  }

  openUnitSearchDialog(i = -1) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedVoucherDetails?.unitName ?? '';
    } else {
      searchTxt = this.voucherDetails[i].unitName;
    }

    

    let data = this.units.filter((x) => {
      return (
        (x.unitNameAr + ' ' + x.unitNameEn).toLowerCase().includes(searchTxt) ||
        (x.unitNameAr + ' ' + x.unitNameEn).toUpperCase().includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectedVoucherDetails!.unitName = data[0].unitNameAr;
        this.selectedVoucherDetails!.unitId = data[0].id;
      } else {
        this.voucherDetails[i].unitName = data[0].unitNameAr;
        this.voucherDetails[i].accId = data[0].id;
      }
    } else {
      let lables = ['الكود', 'الاسم', 'الاسم انجليزى'];
      let names = ['unitCode', 'unitNameAr', 'unitNameEn'];
      let title = 'بحث عن الوحدة';

      let sub = this.searchDialog
        .showDialog(lables, names, this.units, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {
              this.selectedVoucherDetails!.unitName = d.unitNameAr;
              this.selectedVoucherDetails!.unitId = d.id;
            } else {
              this.voucherDetails[i].unitName = d.unitNameAr;
              this.voucherDetails[i].unitId = d.id;
            }
          }
        });
      this.subsList.push(sub);
    }
    this.onVoucherDetailsChange.emit(this.voucherDetails);
  }

  calculateTotal(i = -1) {
    // if (i == -1) {
    //   if (this.selectedAcc) {
    //     this.selectedItemRequest.amount = this.selectedItemRequest.quantity * this.selectedItemRequest.currencyAmount * this.selectedItemRequest.currencyRate;
    //     this.selectedItemRequest.totalWithVat = (this.selectedItemRequest.amount * this.selectedItemRequest.vatPercent / 100) + this.selectedItemRequest.amount;
    //   }
    // }
    // else {
    //   this.requestItemData[i].amount = this.requestItemData[i].currencyAmount * this.requestItemData[i].quantity * this.requestItemData[i].currencyRate;
    //   this.requestItemData[i].totalWithVat = (this.requestItemData[i].amount * this.requestItemData[i].vatPercent / 100) + this.requestItemData[i].amount;
    // }

    this.onVoucherDetailsChange.emit(this.voucherDetails);
  }

  ngOnDestroy(): void {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  deleteItem(index) {
    if (this.voucherDetails.length) {
      if (this.voucherDetails.length == 1) {
        this.voucherDetails = [];
      } else {
        this.voucherDetails.splice(index, 1);
      }
    }
    this.onVoucherDetailsChange.emit(this.voucherDetails);
  }

  addItem() {
     
    if (this.kindId == 1 || this.kindId == 4) {
      if (this.selectedVoucherDetails?.credit <= 0 || this.selectedVoucherDetails?.credit == null || this.selectedVoucherDetails?.credit == undefined) {
        this.errorMessage = this.translate.transform('voucher-details.credit-in-details-required');
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
        return;
      }

    }

    else if (this.kindId == 2 || this.kindId == 3) {
      if (this.selectedVoucherDetails?.debit <= 0 || this.selectedVoucherDetails?.debit == null || this.selectedVoucherDetails?.debit == undefined) {
        this.errorMessage = this.translate.transform('voucher-details.debit-in-details-required');
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
        return;
      }
    }
    if (this.selectedVoucherDetails?.accId == 0 || this.selectedVoucherDetails?.accId == null || this.selectedVoucherDetails?.accId == undefined) {
      this.errorMessage = this.translate.transform('voucher-details.account-in-details-required');
      this.errorClass = this.translate.transform('general.error-message');
      this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return;
    }
    this.voucherDetails.push({
      id: 0,
      accId: this.selectedVoucherDetails?.accId ?? 0,
      accName: this.selectedVoucherDetails?.accName ?? '',
      credit: this.selectedVoucherDetails?.credit ?? 0,
      debit: this.selectedVoucherDetails?.debit ?? 0,
      notes: this.selectedVoucherDetails?.notes ?? '',
      parentId: this.selectedVoucherDetails?.parentId ?? 0,
      unitId: this.selectedVoucherDetails?.unitId ?? null,
      unitName: this.selectedVoucherDetails?.unitName ?? '',
    });
    this.onVoucherDetailsChange.emit(this.voucherDetails);

    this.clearSelectedItemData();
  }

  clearSelectedItemData() {
    this.selectedVoucherDetails = {
      accId: 0,
      accName: '',
      credit: 0,
      debit: 0,
      id: 0,
      notes: '',
      parentId: 0,
      unitId: 0,
      unitName: '',
    };
  }
  getVoucherDetailsById(parentId: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.voucherDetailsServices.getWithResponse<VoucherDetail[]>("GetListByFieldNameVM?fieldName=Parent_Id&fieldValue=" + parentId).subscribe({
        next: (res: ResponseResult<VoucherDetail[]>) => {
          if (res.success) {
            //this.onVoucherDetailsChange = JSON.parse(JSON.stringify(res.data));
            
            this.voucherDetails = JSON.parse(JSON.stringify(res.data));
            this.onVoucherDetailsChange.emit(this.voucherDetails);

            //   this.voucherDetails.forEach(element => {
            //
            //     this._voucherDetails.debit=element.debit
            //     this._voucherDetails.credit=element.credit
            //     this._voucherDetails.accId=element.accId
            //     this._voucherDetails.unitId=element.unitId
            //     this._voucherDetails.notes=element.notes

            //     this.voucher.voucherDetails.push(this._voucherDetails);
            //  //   this.onVoucherDetailsChange.emit(this.voucher.voucherDetails);

            //   });

          }
          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });

      this.subsList.push(sub);
    });

  }
}
