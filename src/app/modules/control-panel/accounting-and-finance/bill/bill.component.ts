import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BillType } from 'src/app/core/models/bill-type';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DateModel } from 'src/app/core/view-models/date-model';
import { Tenants } from 'src/app/core/models/tenants';
import { Office } from 'src/app/core/models/offices';
import { Owner } from 'src/app/core/models/owners';
import { Accounts } from 'src/app/core/models/accounts';
import { BillsService } from 'src/app/core/services/backend-services/bills.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { accountType, AlertTypes, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { TenantsSelectors } from 'src/app/core/stores/selectors/tenant.selectors';
import { TenantModel } from 'src/app/core/stores/store.model.ts/tenants.store.model';
import { OwnerSelectors } from 'src/app/core/stores/selectors/owners.selectors';
import { OwnersModel } from 'src/app/core/stores/store.model.ts/owner.store.model';
import { OfficeSelectors } from 'src/app/core/stores/selectors/office.selectors';
import { OfficeModel } from 'src/app/core/stores/store.model.ts/office.store.model';
import { AccountsSelectors } from 'src/app/core/stores/selectors/accounts.selectors';
import { AccountsModel } from 'src/app/core/stores/store.model.ts/accounts.store.model';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { PurchaserSelectors } from 'src/app/core/stores/selectors/purchaser.selectors';
import { PurchaserModel } from 'src/app/core/stores/store.model.ts/purchasers.store.model';
import { Purchasers } from 'src/app/core/models/purchasers';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { Bills } from 'src/app/core/models/bills';
import { BillsDues } from 'src/app/core/models/bills-dues';
import { SuppliersSelectors } from 'src/app/core/stores/selectors/suppliers.selectors';
import { SuppliersModel } from 'src/app/core/stores/store.model.ts/suppliers.store.model';
import { Suppliers } from 'src/app/core/models/suppliers';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { BillsDuesVM } from 'src/app/core/models/ViewModel/bills-dues-vm';
import { BillsDuesService } from 'src/app/core/services/backend-services/bills-dues.service';
import { BillTypeService } from 'src/app/core/services/backend-services/bill-type.service';
import { BillTypeUsersPermissionsService } from 'src/app/core/services/backend-services/bill-type-users-permissions.service';
import { BillTypeUsersPermissions } from 'src/app/core/models/bill-type-users-permissions';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, AfterViewInit, OnDestroy {
  private billDuesStore: BehaviorSubject<BillsDues[]> = new BehaviorSubject<BillsDues[]>([]);
  lang: string = '';
  billInfo: string = '';
  billData: Bills = new Bills();
  billtype: BillType = new BillType();
  subsList: Subscription[] = [];
  billForm: FormGroup = new FormGroup({});
  billDate!: DateModel;
  billsDues: BillsDues = new BillsDues();
  tenants: Tenants[] = [];
  searchTenants: Tenants[] = [];
  offices: Office[] = [];
  owners: Owner[] = [];
  purchasers: Purchasers[] = [];
  searchOwners: Owner[] = [];
  suppliers: Suppliers[] = [];
  accounts: Accounts[] = [];
  searchAccounts: Accounts[] = [];
  revenueAccounts: Accounts[] = [];
  tenantAccounts: Accounts[] = [];
  taxAccounts: Accounts[] = [];
  purchasersAccounts: Accounts[] = [];
  sellersAccounts: Accounts[] = [];
  suppliersAccounts: Accounts[] = [];
  expensesAccounts: Accounts[] = [];
  billDues: BillsDuesVM[] = [];
  submited: boolean = false;
  isGenerateEntry: boolean = false;
  errorMessage = '';
  errorClass = '';
  id: any = 0;
  code: any;
  currnetUrl;
  addUrl: string = '/control-panel/accounting/add-bill';
  updateUrl: string = '/control-panel/accounting/display-bill/';
  listUrl: string = '/control-panel/accounting/bill-list';
  typeId: any;
  sellers: Owner[] = [];
  billTotal: number = 0;
  kindId: any;
  contractTypeIds: any;
  showRent: boolean = false;
  showMaintenance: boolean = false;
  showSaleBuy: boolean = false;
  showAdd: boolean = false;
  showDisplay: boolean = false;
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number;
  constructor(private billService: BillsService,
    private billDuesService: BillsDuesService,
    private sharedServices: SharedService,
    private router: Router,
    private translate: TranslatePipe,
    private fb: FormBuilder,
    private dateConverterService: DateConverterService,
    private store: Store<any>,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private dateService: DateCalculation,
    private alertsService: NotificationsAlertsService,
    private billTypeService: BillTypeService,
    private billTypeUserPermisions: BillTypeUsersPermissionsService,
    private SystemSettingsService: SystemSettingsService,


  ) {

    this.billData.BillsDues = [];
  }

  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: this.translate.transform("menu.bills"),
    componentAdd: this.translate.transform("bill.add-bill"),
  };


  ngOnInit(): void {
    this.getSystemSettings();
    this.createForm();
    this.getPagePermissions();
    this.billDate = this.dateConverterService.getCurrentDate();
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        if (params["typeId"] != null) {
          this.typeId = params["typeId"]
        }
        else {
          this.typeId = localStorage.getItem("typeId")

        }
      }
    })

    this.listenToClickedButton();
    this.changePath();



  }
  ngAfterViewInit(): void {
    let typeNameAr = localStorage.getItem("typeNameAr")!;
    let typeNameEn = localStorage.getItem("typeNameEn")!;
    this.toolbarPathData.componentList = this.lang == 'ar' ? typeNameAr : typeNameEn
    this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'اضافة' + ' ' + typeNameAr : 'Add' + ' ' + typeNameEn
    this.billInfo = this.lang == 'ar' ? 'بيانات' + ' ' + typeNameAr : typeNameEn + ' ' + 'data'
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
    this.loadData();


  }
  public setBillDuesList(billDues: BillsDues[]) {

    this.billDuesStore.next(billDues);
  }
  public getBillDuesList(): Observable<any[]> {
    return this.billDuesStore.asObservable();
  }
  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }
  pagePermission!: BillTypeUsersPermissions;
  userPermissions!: UserPermission;
  getPagePermissions() {
    const promise = new Promise<void>((resolve, reject) => {
      this.billTypeUserPermisions.getAll("GetBillTypeUsersPermissionsOfCurrentUser").subscribe({
        next: (res: any) => {
          console.log("getPagePermissions res", res)
          let permissions: BillTypeUsersPermissions[] = JSON.parse(JSON.stringify(res.data));
          this.pagePermission = permissions.find(x => x.billTypeId == Number(this.typeId))!
          this.userPermissions = JSON.parse(this.pagePermission?.permissionsJson);
          this.sharedServices.setUserPermissions(this.userPermissions);
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
  loadData() {
    this.spinnerService.show();
    return Promise.all([
      this.getBillTypes(),
      this.getLanguage(),
      this.getOwners(),
      this.getTenants(),
      this.getPurchasers(),
      this.getSuppliers(),
      this.getAccounts()

    ]).then(a => {
      this.spinnerService.hide();
      let sub = this.activatedRoute.params.subscribe((params) => {
        if (params["id"]) {
          this.showAdd = true;
          this.showDisplay = true;
          this.getBill(params["id"]);
          this.getBillDues(params["id"]);
           

          this.id = params["id"];

        }
        else {
          this.getLastBillCode(this.typeId)
          this.showAdd = true;
        }
      });

      this.subsList.push(sub);
    }).catch((err) => {
      this.spinnerService.hide();
    })
  }
  onSelectBillDate(e: DateModel) {
    this.billDate = e;
  }

  createForm() {
    this.billForm = this.fb.group({
      id: 0,
      code: REQUIRED_VALIDATORS,
      billDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      ownerId: '',
      ownerAccId: '',
      tenantId: '',
      tenantAccId: '',
      taxAccId: '',
      officeId: '',
      purchaserId: '',
      purchaserAccId: '',
      sellerId: '',
      sellerAccId: '',
      revenueAccId: '',
      supplierId: '',
      supplierAccountId: '',
      expenseAccountId: '',
      notes: '',
      billTypeId: '',
      billTotal: 0

    })
  }
  getLastBillCode(typeId: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.billService.getWithResponse<Bills>("getLastBillCode?typeId=" + typeId).subscribe({
        next: (res) => {


          this.billForm.value.code = JSON.parse(JSON.stringify(res.data));
          this.code = JSON.parse(JSON.stringify(res.data));

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
  get f() {
    return this.billForm.controls;
  }

  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,

            } as ToolbarPath);
            this.router.navigate([this.listUrl], {
              queryParams: {
                "typeId": this.typeId
              }
            });
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {

            this.getLanguage();
            let typeNameAr = localStorage.getItem("typeNameAr")!;
            let typeNameEn = localStorage.getItem("typeNameEn")!;
            this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'اضافة' + ' ' + typeNameAr : 'Add' + ' ' + typeNameEn
            this.toolbarPathData.componentList = this.lang == 'ar' ? typeNameAr : typeNameEn
            this.billInfo = this.lang == 'ar' ? 'بيانات' + ' ' + typeNameAr : typeNameEn + ' ' + 'data'
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            this.router.navigate([this.addUrl], {
              queryParams: {
                "typeId": this.typeId
              }
            })
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.onSave();
          }
        }
      },
    });
    this.subsList.push(sub);
  }

  billsDuesListStore: BillsDues[] = [];
  getBillDuesFromStore() {
     
    let sub = this.getBillDuesList().subscribe({
      next: (billDues: BillsDues[]) => {
         
        //this.billData.BillsDues.push(billDues);
        billDues.forEach(element => {
          this.billData.BillsDues.push({
            amount: element.amount,
            id: 0,
            notes: '',
            billId: element.billId,
            dueId: element.dueId,
            dueTypeId: element.dueTypeId
          });
          //  this.billTotal = this.setDecimalNumber(Number(this.billTotal) + Number(element.amount));

        }


        )

         

      },
    });
    this.subsList.push(sub);
  }

  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }

  onSave() {

    this.submited = true;

    if (this.billForm.valid) {
      this.sharedServices.changeButtonStatus({button:'Save',disabled:true})
      if (this.isGenerateEntry == true) {
        if (this.billForm.value.taxAccId == null || this.billForm.value.taxAccId == '' || this.billForm.value.taxAccId == undefined) {
          this.errorMessage = this.translate.transform('general.tax-account-required');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }
        if (this.kindId == 1) {
          if (this.billForm.value.tenantAccId == null || this.billForm.value.tenantAccId == '' || this.billForm.value.tenantAccId == undefined) {
            this.errorMessage = this.translate.transform('general.tenant-account-required');
            this.errorClass = this.translate.transform('general.error-message');
            this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
            return
          }
          if (this.billForm.value.revenueAccId == null || this.billForm.value.revenueAccId == '' || this.billForm.value.revenueAccId == undefined) {
            this.errorMessage = this.translate.transform('general.revenue-account-required');
            this.errorClass = this.translate.transform('general.error-message');
            this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
            return
          }
        }
        else if (this.kindId == 2) {
          if (this.billForm.value.supplierAccountId == null || this.billForm.value.supplierAccountId == '' || this.billForm.value.supplierAccountId == undefined) {
            this.errorMessage = this.translate.transform('general.supplier-account-required');
            this.errorClass = this.translate.transform('general.error-message');
            this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
            return
          }
          if (this.billForm.value.expenseAccountId == null || this.billForm.value.expenseAccountId == '' || this.billForm.value.expenseAccountId == undefined) {
            this.errorMessage = this.translate.transform('general.expense-account-required');
            this.errorClass = this.translate.transform('general.error-message');
            this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
            return
          }
        }
        else if (this.kindId == 4 || this.kindId == 5) {
          if (this.billForm.value.sellerAccId == null || this.billForm.value.sellerAccId == '' || this.billForm.value.sellerAccId == undefined) {
            this.errorMessage = this.translate.transform('general.seller-account-required');
            this.errorClass = this.translate.transform('general.error-message');
            this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
            return
          }
          if (this.billForm.value.purchaserAccId == null || this.billForm.value.purchaserAccId == '' || this.billForm.value.purchaserAccId == undefined) {
            this.errorMessage = this.translate.transform('general.purchase-account-required');
            this.errorClass = this.translate.transform('general.error-message');
            this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
            return
          }
        }

      }
      if (this.id > 0) {
        this.getBillDuesFromStore();
      }

      if (this.billData.BillsDues == null) {
        this.errorMessage = this.translate.transform('general.bill-dues-required');
        this.errorClass = this.translate.transform('general.error-message');
        this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
        return
      }

      this.setInputData();

      this.spinnerService.show();
       
      this.billData.id = this.id;
      let sub = this.billService.addWithResponse<Bills>("AddBill?uniques=Code&uniques=TypeId&checkAll=true", this.billData).subscribe({
        next: (res) => {
          this.spinnerService.hide();
          if (res.success) {
            this.showResponseMessage(true, AlertTypes.success, this.translate.transform("messages.add-success"));
            this.router.navigate([this.listUrl], { queryParams: { typeId: this.typeId } });
          }
        },
        error: (err: any) => {
          this.spinnerService.hide();
        }

      });

      this.subsList.push(sub);
    }
    else {
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.billForm.markAllAsTouched();
    }

  }
  setValidateInputData() {
    if (this.isGenerateEntry == true) {
      if (this.kindId == 1) {
        if (this.billForm.value.tenantAccId == null || this.billForm.value.tenantAccId == '' || this.billForm.value.tenantAccId == undefined) {
          this.errorMessage = this.translate.transform('general.tenant-account-required');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }
        if (this.billForm.value.revenueAccId == null || this.billForm.value.revenueAccId == '' || this.billForm.value.revenueAccId == undefined) {
          this.errorMessage = this.translate.transform('general.revenue-account-required');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }
      }
      else if (this.kindId == 2) {
        if (this.billForm.value.supplierAccountId == null || this.billForm.value.supplierAccountId == '' || this.billForm.value.supplierAccountId == undefined) {
          this.errorMessage = this.translate.transform('general.supplier-account-required');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }
        if (this.billForm.value.expenseAccountId == null || this.billForm.value.expenseAccountId == '' || this.billForm.value.expenseAccountId == undefined) {
          this.errorMessage = this.translate.transform('general.expense-account-required');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }
      }
      else if (this.kindId == 4 || this.kindId == 5) {
        if (this.billForm.value.sellerAccId == null || this.billForm.value.sellerAccId == '' || this.billForm.value.sellerAccId == undefined) {
          this.errorMessage = this.translate.transform('general.seller-account-required');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }
        if (this.billForm.value.purchaseAccId == null || this.billForm.value.purchaseAccId == '' || this.billForm.value.purchaseAccId == undefined) {
          this.errorMessage = this.translate.transform('general.purchaser-account-required');
          this.errorClass = this.translate.transform('general.error-message');
          this.alertsService.showError(this.errorMessage, this.translate.transform('general.error'))
          return
        }
      }

    }
  }
  setInputData() {
    this.billData = {
      id: 0,
      code: this.billForm.controls["code"].value,
      billDate: this.dateConverterService.getDateForInsertISO_Format(this.billDate),
      ownerId: this.billForm.controls["ownerId"].value,
      ownerAccId: this.billForm.controls["ownerAccId"].value,
      tenantId: this.billForm.controls["tenantId"].value,
      tenantAccId: this.billForm.controls["tenantAccId"].value,
      taxAccId: this.billForm.controls["taxAccId"].value,
      officeId: this.billForm.controls["officeId"].value,
      purchaserId: this.billForm.controls["purchaserId"].value,
      purchaserAccId: this.billForm.controls["purchaserAccId"].value,
      sellerId: this.billForm.controls["sellerId"].value,
      sellerAccId: this.billForm.controls["sellerAccId"].value,
      revenueAccId: this.billForm.controls["revenueAccId"].value,
      supplierId: this.billForm.controls["supplierId"].value,
      supplierAccountId: this.billForm.controls["supplierAccountId"].value,
      expenseAccountId: this.billForm.controls["expenseAccountId"].value,
      notes: this.billForm.controls["notes"].value,
      billTypeId: this.typeId,
      billTotal: Number(this.setDecimalNumber(this.billForm.controls["billTotal"].value)),
      BillsDues: this.billData.BillsDues ?? [],

    };
     
    this.billData.billTotal = Number(this.setDecimalNumber(this.billTotal))
    // this.getBillDues(this.billData.id);

  }
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning == alertType) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info == alertType) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error == alertType) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }

  // onSelectChange(e: BillsDues[]) {
  //   ;
  //   this.billData.BillsDues = [];
  //   let rs = e.filter(x => x.isChecked == true);
  //   if (rs != null && rs != undefined) {
  //     this.billData.BillsDues = e.filter(x => x.isChecked == true);
  //   }
  //   this.totalValue = 0;
  //   this.discount = 0;//
  //   ;

  //   for (let i = 0; i < this.billData.BillsDues.length; i++) {
  //     ;
  //     //modified by mohamed fawzy 24-05-2022
  //     this.totalValue += Number(this.billData.BillsDues[i].amount);
  //     //- this.invoiceData.taxBillDetailsVM[i].discountAfterVat);
  //     this.discount += Number(this.invoiceData.taxBillDetailsVM[i].discountAfterVat);


  //   }
  //   this.totalValue = (this.totalValue).toFixed(3);
  //   this.discount = (this.discount).toFixed(3);
  //   this.netValue = (this.totalValue - this.discount).toFixed(3);



  // }
  onUpdate() { }


  getTenants() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(TenantsSelectors.selectors.getListSelector).subscribe({
        next: (res: TenantModel) => {
          this.tenants = JSON.parse(JSON.stringify(res.list));
          resolve();
        },
        error: (err) => {
          resolve();
        }
      });
      this.subsList.push(sub);
    });
  }
  getSuppliers() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(SuppliersSelectors.selectors.getListSelector).subscribe({
        next: (res: SuppliersModel) => {
          this.suppliers = JSON.parse(JSON.stringify(res.list));
          resolve();
        },
        error: (err) => {
          resolve();
        }
      });
      this.subsList.push(sub);
    });
  }
  getOwners() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(OwnerSelectors.selectors.getListSelector).subscribe({
        next: (res: OwnersModel) => {
          //this.owners = JSON.parse(JSON.stringify(res.list));
          this.sellers = JSON.parse(JSON.stringify(res.list));

          resolve();
        },
        error: (err) => {
          //((err);
          resolve();
        }
      });
      this.subsList.push(sub);
    });

  }

  getPurchasers() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(PurchaserSelectors.selectors.getListSelector).subscribe({
        next: (res: PurchaserModel) => {
          this.purchasers = JSON.parse(JSON.stringify(res.list));

          resolve();
        },
        error: (err) => {
          //((err);
          resolve();
        }
      });
      this.subsList.push(sub);
    });

  }




  getOffices() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(OfficeSelectors.selectors.getListSelector).subscribe({
        next: (res: OfficeModel) => {
          this.offices = JSON.parse(JSON.stringify(res.list));
          resolve();
        },
        error: (err) => {
          resolve();
        }
      });
      this.subsList.push(sub);
    });
  }

  getAccounts() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.store.select(AccountsSelectors.selectors.getListSelector).subscribe({
        next: (res: AccountsModel) => {
          this.revenueAccounts = JSON.parse(JSON.stringify(res.list)).filter(x => x.accountType == accountType.Owner).map((res: Accounts[]) => {
            return res
          });
          this.tenantAccounts = JSON.parse(JSON.stringify(res.list)).filter(x => x.accountType == accountType.Tenant).map((res: Accounts[]) => {
            return res
          });
          this.taxAccounts = JSON.parse(JSON.stringify(res.list)).filter(x => x.accountType == accountType.Tax).map((res: Accounts[]) => {
            return res
          });

          this.purchasersAccounts = JSON.parse(JSON.stringify(res.list)).filter(x => x.accountType == accountType.Purchases).map((res: Accounts[]) => {
            return res
          });

          this.sellersAccounts = JSON.parse(JSON.stringify(res.list)).filter(x => x.accountType == accountType.Sales).map((res: Accounts[]) => {
            return res
          });

          this.suppliersAccounts = JSON.parse(JSON.stringify(res.list)).filter(x => x.accountType == accountType.Supplier).map((res: Accounts[]) => {
            return res
          });

          this.expensesAccounts = JSON.parse(JSON.stringify(res.list)).filter(x => x.accountType == accountType.Expenses).map((res: Accounts[]) => {
            return res
          });
          // this.searchAccounts = JSON.parse(JSON.stringify(res.list));
          // this.accounts = this.searchAccounts.filter(x => true);
          resolve();
        },
        error: (err) => {
          //((err);
          resolve();
        }
      });
      this.subsList.push(sub);
    });
  }

  onChangeOwner(ownerId: any) {
    if (ownerId) {
      this.tenants = this.searchTenants.filter(x => x.ownerId == ownerId);
    }
    else {
      this.tenants = [];
    }

  }

  getOfficeAccounts(officeId: any) {
    return this.accounts.filter(x => true);
  }


  getOwnerAccounts(ownerId: any) {
    return this.accounts.filter(x => true);
  }


  getTenantAccounts(tenantId: any) {
    return this.accounts.filter(x => true);
  }

  // onBillItemsChange(billItems: BillItems[]) {
  //   this.bill!.billItems = billItems;
  //   let totalDebit = 0;
  //   let totalCredit = 0;




  // }

  getBillTypes() {

    return new Promise<void>((resolve, reject) => {
      let sub = this.billTypeService.getWithResponse<BillType[]>("GetAll").subscribe({
        next: (res) => {
          if (res.success) {

            this.billtype = JSON.parse(JSON.stringify(res.data?.find(x => x.id == this.typeId)));
            this.kindId = this.billtype.kindId;
            this.contractTypeIds = this.billtype.contractTypeIds;
            this.isGenerateEntry = this.billtype.isGenerateEntry;

            if (this.kindId == 1) {
              this.showRent = true;
            }
            if (this.kindId == 2) {
              this.showMaintenance = true;
            }
            if (this.kindId == 4 || this.kindId == 5) {
              this.showSaleBuy = true;
            }

            this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'اضافة' + ' ' + this.billtype.typeNameAr : 'Add' + ' ' + this.billtype.typeNameEn
            this.toolbarPathData.componentList = this.lang == 'ar' ? this.billtype.typeNameAr : this.billtype.typeNameEn
            this.billInfo = this.lang == 'ar' ? 'بيانات' + ' ' + this.billtype.typeNameAr : this.billtype.typeNameEn + ' ' + 'data'
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            localStorage.setItem("typeNameAr", this.billtype.typeNameAr);
            localStorage.setItem("typeNameEn", this.billtype.typeNameEn);
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
    // return new Promise<void>((resolve, reject) => {
    //   let sub = this.store.select(BillTypeSelectors.selectors.getListSelector).subscribe({
    //     next: (res: BillTypeModel) => {
    //       resolve();
    //       this.billtype = res.list.find(x => x.id == this.typeId) ?? new BillType();
    //       this.kindId = this.billtype.kindId;
    //       this.contractTypeIds = this.billtype.contractTypeIds;
    //       this.isGenerateEntry = this.billtype.isGenerateEntry;

    //       if (this.kindId == 1) {
    //         this.showRent = true;
    //       }
    //       if (this.kindId == 2) {
    //         this.showMaintenance = true;
    //       }
    //       if (this.kindId == 4 || this.kindId == 5) {
    //         this.showSaleBuy = true;
    //       }

    //       this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'اضافة' + ' ' + this.billtype.typeNameAr : 'Add' + ' ' + this.billtype.typeNameEn
    //       this.toolbarPathData.componentList = this.lang == 'ar' ? this.billtype.typeNameAr : this.billtype.typeNameEn
    //       this.billInfo = this.lang == 'ar' ? 'بيانات' + ' ' + this.billtype.typeNameAr : this.billtype.typeNameEn + ' ' + 'data'
    //       this.sharedServices.changeToolbarPath(this.toolbarPathData);
    //       localStorage.setItem("typeNameAr", this.billtype.typeNameAr);
    //       localStorage.setItem("typeNameEn", this.billtype.typeNameEn);


    //     },
    //     error: (err: any) => {
    //       resolve();
    //     }
    //   })

    //   this.subsList.push(sub);
    // })

  }

  onBillDuesChange(e: BillsDues[]) {
    this.billData.BillsDues = e
    if (this.id == 0) {
      this.billData.billTotal = 0;
      this.billTotal = 0;
    }


    e.forEach(element => {
       
      if (this.id == 0) {
        this.billData.billTotal += Number(this.SystemSettingsService.setDecimalNumber(element.amount));

        this.billTotal += Number(this.SystemSettingsService.setDecimalNumber(element.amount));

      }
      else {
        this.billData.billTotal = Number(this.billTotal) + Number(this.SystemSettingsService.setDecimalNumber(element.amount));

        this.billTotal = Number(this.billTotal) + Number(this.SystemSettingsService.setDecimalNumber(element.amount));

      }

    });
  }
  setDecimalNumber(number: any) {

    return this.SystemSettingsService.setDecimalNumber(number)
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
  getBill(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.billService.getWithResponse<Bills>("GetByFieldName?fieldName=Id&fieldValue=" + id).subscribe({
        next: (res) => {
          if (res.success) {
            this.billData = JSON.parse(JSON.stringify(res.data));
            this.billForm = this.fb.group({
              id: this.billData.id,
              code: this.billData.code,
              billDate: '',
              ownerId: this.billData.ownerId,
              ownerAccId: this.billData.ownerAccId,
              tenantId: this.billData.tenantId,
              tenantAccId: this.billData.tenantAccId,
              taxAccId: this.billData.taxAccId,
              officeId: this.billData.officeId,
              purchaserId: this.billData.purchaserId,
              purchaserAccId: this.billData.purchaserAccId,
              sellerId: this.billData.sellerId,
              sellerAccId: this.billData.sellerAccId,
              revenueAccId: this.billData.revenueAccId,
              supplierId: this.billData.supplierId,
              supplierAccountId: this.billData.supplierAccountId,
              expenseAccountId: this.billData.expenseAccountId,
              notes: this.billData.notes,
              billTypeId: this.billData.billTypeId,
              billTotal: Number(this.setDecimalNumber(this.billData.billTotal))
            })
            this.billTotal = Number(this.setDecimalNumber(this.billData.billTotal))
          }

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
  deleteBillDue(item: BillsDues) {

    if (item != null) {
      const index: number = this.billData.BillsDues.indexOf(item);
      if (index !== -1) {
        this.billData.BillsDues.splice(index, 1);
      }

    }

  }
  selectDues(item: BillsDuesVM, event) {
     
    // this.getBillDues(this.id);
    if (event.target.checked) {
      this.billData.BillsDues.push({
        amount: item.dueAmount,
        id: 0,
        notes: '',
        billId: 0,
        dueId: item.id,
        dueTypeId: item.typeId
      });
       
      this.billTotal = this.setDecimalNumber(Number(this.billTotal) + Number(item.dueAmount));

    }
    else {
       
      let removedItem = this.billData.BillsDues.find(x => x.dueId == item.dueId && x.dueTypeId == item.dueTypeId);
      const index = this.billData.BillsDues.indexOf(removedItem!);
      if (index > -1) {
         

        this.billData.BillsDues.splice(index, 1);
        this.billTotal = this.setDecimalNumber(Number(this.billTotal) - Number(item.dueAmount));


      }


    }


  }
  getBillDues(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.billDuesService.getWithResponse<BillsDuesVM[]>('GetBillDues?billId=' + id + '&kindId=' + this.kindId).subscribe({
        next: (res) => {
          if (res.success) {
            this.billDues = res.data!;
            this.billDues.forEach(element => {
               
              this.billsDues.id = 0;
              this.billsDues.billId = this.id;
              // this.billsDues.billDueId = element.billDueId;

              this.billsDues.dueId = element.dueId;
              this.billsDues.dueTypeId = element.dueTypeId;
              this.billsDues.amount = element.dueAmount;
              this.billsDues.notes = "";
              // this.billData.BillsDues = []
              this.billData.BillsDues.push(this.billsDues);
              this.setBillDuesList(this.billData.BillsDues);
              this.billTotal+=Number(this.setDecimalNumber(this.billsDues.amount));
              //this.billDues=[];

            });
             


          }

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
  getLanguage() {
    this.sharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }




}
