import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { accountClass, accountClassAr, AccountNatureArEnum, AccountNatureEnum, AccountStateArEnum, AccountStateEnum, accountType, accountTypeAr, AlertTypes, convertEnumToArray, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { navigateUrl } from 'src/app/core/helpers/helper';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { Accounts } from 'src/app/core/models/accounts';
import { AccountsTypes } from 'src/app/core/models/accounts-types';
import { Currencies } from 'src/app/core/models/currencies';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { AccountService } from 'src/app/core/services/backend-services/account.service';
import { CurrenciesService } from 'src/app/core/services/backend-services/currencies.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateModel } from 'src/app/core/view-models/date-model';
import { NewCode } from 'src/app/core/view-models/new-code';
import { SharedService } from 'src/app/shared/services/shared.service';

const PAGEID = 61;
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {
  //properties
  lang: string = '';
  errorMessage = '';
  errorClass = ''
  submited: boolean = false;
  isReadOnlyAccClass:boolean = false;
  //Response!: ResponseResult<Accounts>;
  accountStates: ICustomEnum[] = [];
  accountNature: ICustomEnum[] = [];
  accountTypes: ICustomEnum[] = [];
  currencies: Currencies[] = [];
  mainAccounts: Accounts[] = [];
  accountsTypes: AccountsTypes[] = [];
  accountsClassification: ICustomEnum[] = [];
  accountForm!: FormGroup;
  accDate!: DateModel;
  accCheckDate!: DateModel;
  id: any = 0;
  subsList: Subscription[] = [];
  addUrl: string = '/control-panel/accounting/add-account';
  updateUrl: string = '/control-panel/accounting/update-account/';
  listUrl: string = '/control-panel/accounting/accounts-list';
  toolbarPathData: ToolbarPath = {
    pageId: PAGEID,
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: "menu.accounts",
    componentAdd: '',
  };
  //
  //constructor
  constructor(private router: Router,
    private fb: FormBuilder, private currenciesService: CurrenciesService,
    private accountService: AccountService,
    // private accountsTypesService: AccountsTypesService,
    //private AccountsClassificationService: AccountsClassificationService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private translate: TranslatePipe,
    private alertsService: NotificationsAlertsService,
    //private rolesPerimssionsService: RolesPermissionsService,
    private dateService: DateCalculation,
    private store: Store<any>,
    private managerService: ManagerService,



  ) {

    this.createAccountsForm();
  }
  createAccountsForm() {
    this.accountForm = this.fb.group({
      id: 0,
      parentAccId: '',
      accCode: REQUIRED_VALIDATORS,
      accArName: REQUIRED_VALIDATORS,
      accEnName: REQUIRED_VALIDATORS,
      accDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      accCheckDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      accState: 1,
      accClassId: REQUIRED_VALIDATORS,
      accountType: REQUIRED_VALIDATORS,
      //accNature: REQUIRED_VALIDATORS,
      currencyId: REQUIRED_VALIDATORS,
      accDebit: '',
      accCredit: '',
      accRemarks: '',
      deActivate: false,
      regId: 0
    })
    this.accDate = this.dateService.getCurrentDate();
    this.accCheckDate = this.dateService.getCurrentDate();
  }


  //
  //oninit

  ngOnInit(): void {
    localStorage.setItem("PageId", PAGEID.toString());
    this.getAccountState();
    this.getAccountNature();
    this.getAccountTypes();
    this.getAccountClass();
    //this.getPagePermissions(PAGEID)
    this.spinner.show();
    Promise.all([
      this.managerService.loadPagePermissions(PAGEID),
      this.getLanguage(),
      this.managerService.loadCurrencies(),
      this.managerService.loadAccounts(),

    ]).then(a => {
      this.mainAccounts = this.managerService.getAccounts().filter(x => x.accState == AccountStateEnum.Main);
      this.currencies = this.managerService.getCurrencies();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();

    }).catch(e => {
      this.spinner.hide();

    });




  }

  getRouteData() {
    let sub = this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {
          localStorage.setItem("RecordId", params["id"]);
          this.getAccountById(this.id).then(a => {
            this.spinner.hide();
            this.sharedService.changeButton({ action: 'Update', submitMode: false } as ToolbarData);
            localStorage.setItem("RecordId", this.id);
          }).catch(err => {
            this.spinner.hide();
          });
        }
        else {
          this.sharedService.changeButton({ action: 'New' } as ToolbarData);
          this.spinner.hide();
        }
      }
      else {
        this.spinner.hide();
        this.sharedService.changeButton({ action: 'New' } as ToolbarData);
      }
    });
    this.subsList.push(sub);
  }

  changePath() {
    this.sharedService.changeToolbarPath(this.toolbarPathData);
  }


  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedService.getLanguage().subscribe(
        {
          next: (res) => {
            resolve();
            this.lang = res
          },
          error: (err) => {
            resolve();
            console.log(err);

          }
        });

      this.subsList.push(sub);
    });

  }
  //#region Permissions
  // rolePermission!: RolesPermissionsVm;
  // userPermissions!: UserPermission;
  // getPagePermissions(pageId) {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.rolesPerimssionsService.getAll("GetPagePermissionById?pageId=" + pageId).subscribe({
  //       next: (res: any) => {
  //         this.rolePermission = JSON.parse(JSON.stringify(res.data));
  //         this.userPermissions = JSON.parse(this.rolePermission.permissionJson);
  //         this.sharedService.setUserPermissions(this.userPermissions);
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       },
  //       complete: () => {

  //       },
  //     });
  //   });
  //   return promise;

  // }
  //#endregion
  //
  //#region ngOnDestory
  ngOnDestroy() {
    this.subsList.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });

    localStorage.removeItem("PageId");
    localStorage.removeItem("RecordId");
    this.managerService.destroy();
  }
  //
  //methods
  setDates() {
    this.accountForm.value.accDate = this.dateService.getDateForInsert(this.accountForm.controls["accDate"].value);
    this.accountForm.value.accCheckDate = this.dateService.getDateForInsert(this.accountForm.controls["accCheckDate"].value);
  }

  getAccountById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.accountService.getWithResponse<Accounts>("GetById?id=" + id).subscribe({
        next: (res: ResponseResult<Accounts>) => {
          resolve();
          if (res.data) {
            this.accountForm.setValue({
              id: res.data.id,
              parentAccId: res.data.parentAccId,
              accCode: res.data.accCode,
              accArName: res.data.accArName,
              accEnName: res.data.accEnName,
              accDate: this.dateService.getDateForCalender(res.data.accDate),
              accCheckDate: this.dateService.getDateForCalender(res.data.accCheckDate),
              accState: res.data.accState,
              accClassId: res.data.accClassId,
              accountType: res.data.accountType,
              currencyId: res.data.currencyId,
              accDebit: res.data.accDebit,
              accCredit: res.data.accCredit,
              accRemarks: res.data.accRemarks,
              deActivate: res.data.deActivate,
              regId: res.data.regId


            });
            if(res.data.parentAccId || res.data.accState == AccountStateEnum.Sub)
            {
              this.isReadOnlyAccClass = true;
            }
          }


        },
        error: (err: any) => {
          resolve();
          console.log(err);
        },
        complete: () => {

        },
      });
      this.subsList.push(sub);
    });

  }
  getAccountState() {
    if (this.lang == 'en') {
      this.accountStates = convertEnumToArray(AccountStateEnum);
    }
    else {
      this.accountStates = convertEnumToArray(AccountStateArEnum);

    }
  }
  getAccountTypes() {
    if (this.lang == 'en') {
      this.accountTypes = convertEnumToArray(accountType);
    }
    else {
      this.accountTypes = convertEnumToArray(accountTypeAr);

    }

  }

  getAccountClass() {
    if (this.lang == 'en') {
      this.accountsClassification = convertEnumToArray(accountClass);
    }
    else {
      this.accountsClassification = convertEnumToArray(accountClassAr);
    }

  }
  getAccountNature() {
    if (this.lang == 'en') {
      this.accountNature = convertEnumToArray(AccountNatureEnum);
    }
    else {
      this.accountNature = convertEnumToArray(AccountNatureArEnum);

    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.accountForm.controls;
  }
  // getMainAccounts() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.AccountService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.mainAccounts = res.data.filter(x => x.parentAccId == null || x.parentAccId == 0).map((res: Accounts[]) => {
  //           return res
  //         });
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {
  //         resolve();
  //       },
  //     });
  //   });
  //   return promise;
  // }

  // getAccountsTypes() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.AccountsTypesService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.accountsTypes = res.data.map((res: AccountsTypes[]) => {
  //           return res
  //         });
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {
  //         resolve();
  //       },
  //     });
  //   });
  //   return promise;


  // }
  // getAccountsClassification() {
  //   const promise = new Promise<void>((resolve, reject) => {
  //     this.AccountsClassificationService.getAll("GetAll").subscribe({
  //       next: (res: any) => {
  //         this.accountsClassification = res.data.map((res: AccountsClassification[]) => {
  //           return res
  //         });
  //         resolve();

  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {
  //         resolve();
  //       },
  //     });
  //   });
  //   return promise;


  // }
  getAccountDate(selectedDate: DateModel) {
    this.accDate = selectedDate;
  }
  getCheckAccountDate(selectedDate: DateModel) {
    this.accCheckDate = selectedDate;
  }
  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }
  onSave() {

    this.submited = true;
    if (this.accountForm.valid) {
      this.accountForm.value.id = 0;
      this.setDates();
      if (this.accountForm.value.accState == AccountStateEnum.Sub && !this.accountForm.value.parentAccId) {
        this.showResponseMessage(false, AlertTypes.warning, this.translate.transform("validation-messages.main-acc-required"));
        return;
      }
      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    } else {
      this.spinner.hide();
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.accountForm.markAllAsTouched();
    }

  }

  confirmSave() {




    return new Promise<void>((resolve, reject) => {
      let sub = this.accountService.addWithResponse<Accounts>('AddWithCheck?uniques=AccCode',
        this.accountForm.value).subscribe({
          next: (result: ResponseResult<Accounts>) => {
            resolve();
            if (result.success && !result.isFound) {
              this.showResponseMessage(
                result.success, AlertTypes.success, this.translate.transform("messages.add-success")
              );
              navigateUrl(this.listUrl, this.router);
            } else if (result.isFound) {
              this.showResponseMessage(
                result.success,
                AlertTypes.warning,
                this.translate.transform("messages.record-exsiting")
              );
            }
            else {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.add-failed")
              );
            }
          },
          error: (error) => {
            this.showResponseMessage(
              false,
              AlertTypes.error,
              this.translate.transform("messages.connection-error")
            );
            resolve();
            console.error(error)
          }
        });
      this.subsList.push(sub);
    });
  }

  onUpdate() {

    this.submited = true;
    if (this.accountForm.valid) {
      if (this.accountForm != null) {
        this.accountForm.value.id = this.id;
        this.setDates();
        if (this.accountForm.value.accState == AccountStateEnum.Sub && !this.accountForm.value.parentAccId) {
          this.showResponseMessage(false, AlertTypes.warning, this.translate.transform("validation-messages.main-acc-required"));
          return;
        }
        this.spinner.show();
        this.confirmUpdate().then(a => {
          this.spinner.hide();
        }).catch(e => {
          this.spinner.hide();
        });
      }
    }
    else {
      this.spinner.hide();
      this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.accountForm.markAllAsTouched();
    }
  }


  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.accountService.updateWithUrl("UpdateWithCheck?uniques=AccCode", this.accountForm.value).subscribe({
        next: (result: ResponseResult<Accounts>) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.success,
              this.translate.transform("messages.update-success")
            );
            navigateUrl(this.listUrl, this.router);

          } else if (result.isFound) {

            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          } else {
            this.showResponseMessage(
              result.success,
              AlertTypes.error,
              this.translate.transform("messages."+result.message)
            );

          }
        },
        error: (err: any) => {
          this.showResponseMessage(
            false,
            AlertTypes.error,
            this.translate.transform("messages.connection-error")
          );
          //reject(err);
          resolve();
        },
        complete: () => {
        },
      });
      this.subsList.push(sub);
    });
  }


  listenToClickedButton() {
    let sub = this.sharedService.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedService.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "accounts.add-account";
            this.createAccountsForm();
            this.router.navigate([this.addUrl]);
            this.sharedService.changeToolbarPath(this.toolbarPathData);
          } else if (
            currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.onUpdate();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
  }
  //


  onChangeMainAcc(parentAccId:any)
  {
    if(parentAccId)
    {
      let mainAcc = this.mainAccounts.find(x=>x.id == parentAccId );
      if(mainAcc){
        this.accountForm.controls['accClassId'].setValue(mainAcc.accClassId);
        this.accountForm.controls['currencyId'].setValue(mainAcc.currencyId);
        this.accountForm.controls['accountType'].setValue(mainAcc.accountType);        

        this.isReadOnlyAccClass = true;
        this.spinner.show();
        this.getAccountCode(parentAccId).then(code=>{
          this.spinner.hide();
          this.accountForm.controls["accCode"].setValue(code);
         
        }).catch(e=>{
          this.spinner.hide();
        })

      }
    }
    else{
      this.isReadOnlyAccClass = false;
    }
  }

  getAccountCode(parentAccId:any)
  {
    return new Promise<string>((resolve,reject)=>{
      let sub = this.accountService.getWithResponse<NewCode[]>("GetAccountCode?parentAccId="+parentAccId).subscribe({
        next:(res)=>{
          let accCode:string = "";
          if(res.data && res.data.length)
          {
            accCode = res.data[0].code??""
          }
          
          resolve(accCode);
        },
        error:(err)=>{
          resolve("");
        },
        complete:()=>{}
      });
      this.subsList.push(sub);
    });
    
  }
}
