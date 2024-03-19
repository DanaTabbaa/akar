import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AccIntegrationTypeEnum, AccountStateEnum, accountType, AlertTypes, PermissionType, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Voucher } from '../../../../core/models/voucher';
import { VouchersService } from '../../../../core/services/backend-services/vouchers.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { DateModel } from 'src/app/core/view-models/date-model';
import { DateConverterService } from 'src/app/core/services/local-services/date-services/date-converter.service';
import { Tenants } from 'src/app/core/models/tenants';
import { Office } from 'src/app/core/models/offices';
import { Owner } from 'src/app/core/models/owners';
import { NgxSpinnerService } from 'ngx-spinner';
import { VoucherDetail } from 'src/app/core/models/voucher-detail';
import { EntryType } from 'src/app/core/models/entry-type';
import { Accounts } from 'src/app/core/models/accounts';
import { VoucherDueDetails, VoucherRentDueDetailsVm } from 'src/app/core/models/voucher-due-details';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { VoucherData, VoucherVm } from 'src/app/core/models/ViewModel/voucher-vm';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { Purchasers } from 'src/app/core/models/purchasers';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NewCode } from 'src/app/core/view-models/new-code';
import { SystemSettings } from 'src/app/core/models/system-settings';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { RentContractDuesService } from 'src/app/core/services/backend-services/rent-contract-dues.service';
import { GeneralIntegrationSettings } from 'src/app/core/models/general-integration-settings';
// from pages table in database seeding table
@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit, AfterViewInit, OnDestroy {
  voucher: Voucher = new Voucher();
  voucherDetails: VoucherDetail[] = [];
  //_voucherDetails: VoucherDetail = new VoucherDetail();
  purchasers: Purchasers[] = [];
  errorMessage = '';
  errorClass = ''
  totalDebit: number = 0;
  totalCredit: number = 0;
  voucherDueAmount: number = 0;
  entryType?: EntryType;
  subsList: Subscription[] = [];
  voucherForm: FormGroup = new FormGroup({});
  voucherDate!: DateModel;
  code: any;
  tenants: Tenants[] = [];
  offices: Office[] = [];
  owners: Owner[] = [];
  accounts: Accounts[] = [];
  id: any = 0;
  lang: string = '';
  voucherData: string = '';
  currnetUrl;
  addUrl: string = '/control-panel/accounting/voucher';
  updateUrl: string = '/control-panel/accounting/update-voucher/';
  listUrl: string = '/control-panel/accounting/voucher-list';
  typeId: any;
  contractTypeId: any;
  contractKindId: any;
  isGenerateEntry: boolean = false;
  systemSettings: SystemSettings = new SystemSettings();
  entryTypeData: string = '';
  contractsSettings: ContractsSettings[] = [];
  selectedContractSettings: ContractsSettings[] = [];
  voucherRentContractDues: VoucherRentDueDetailsVm[] = [];
  selectedOwnerId: any;
  selectedTenantId: any;
  selectedOfficeId: any;

  generalAccountIntegration!: GeneralIntegrationSettings | null;


  constructor(private voucherServices: VouchersService,
    private sharedServices: SharedService,
    private router: Router,
    private fb: FormBuilder,
    private dateConverterService: DateConverterService,
    private alertsService: NotificationsAlertsService,

    private translate: TranslatePipe,
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private spinner: NgxSpinnerService,
    private rentContractDueService: RentContractDuesService) {
    this.createForm();
  }

  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList: '',
    componentAdd: '',
  };



  ngOnInit(): void {
    this.sharedServices.setPermissionsStatus({ permissionStatus: PermissionType.Voucher });
    this.voucherDate = this.dateConverterService.getCurrentDate();
    this.spinner.show();
    Promise.all([
      this.managerService.loadGeneralAccountIntegrationSetting(),
      this.getLanguage(),
      this.managerService.loadEntryTypes(),
      this.managerService.loadOffices(),
      this.managerService.loadOwners(),
      this.managerService.loadTenants(),
      this.managerService.loadPurchasers(),
      this.managerService.loadAccounts(),
      this.managerService.loadSystemSettings(),
      this.managerService.loadCurrentRoleAndPermission(),
      this.managerService.loadContractSettings()
    ]).then(a => {

      console.log("Account General Integraion Settings", a[0]);
      this.generalAccountIntegration = a[0];
      if (this.generalAccountIntegration) //General Account Integration 
      {

        if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Resort) {
          this.getResortAccounts();
        }
        else if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.Web) {
          this.getWebAccounts();
        }

      }
      this.getSystemSettings();

      this.owners = this.managerService.getOwners();
      this.purchasers = this.managerService.getPurchasers();
      this.offices = this.managerService.getOffices();
      this.getRouteData();
    }).catch(e => {
      this.spinner.hide();
    });

  }


  getResortAccounts() {
    this.accounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && !x.ownerId);
   
  }


  getWebAccounts() {
    this.accounts = this.managerService.getAccounts().filter(x => x.extAccId && !x.ownerId);
    
  }


  getResortAccountsByOwner(ownerId: any) {
    this.accounts = this.managerService.getAccounts().filter(x => x.resortAccGuid && x.ownerId == ownerId);
   
  }


  getWebAccountsByOwner(ownerId) {
    this.accounts = this.managerService.getAccounts().filter(x => x.extAccId && x.ownerId == ownerId);
    
  }




  getRouteData() {
    let sub = this.route.queryParams.subscribe(
      {
        next: (params) => {

           
          if (params['typeId']) {
            this.typeId = params['typeId'];

            this.voucherForm.controls["typeId"].setValue(this.typeId);
            this.entryType = this.managerService.getEntryTypes().find(x => x.id == this.typeId);

            if (this.entryType) {
              // this.entryTypeData = this.lang == "ar" ? this.entryType.entryNameAr : this.entryType.entryNameEn;
              // this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.entryTypeData : 'Update' + ' ' + this.entryTypeData
              // this.toolbarPathData.componentList = this.lang == 'ar' ? this.entryTypeData : this.entryTypeData
              // this.entryTypeData = this.lang == 'ar' ? 'بيانات' + ' ' + this.entryTypeData : this.entryTypeData + ' ' + 'data';
              this.contractKindId = this.entryType.contractKindId;

              //this.sharedServices.changeToolbarPath(this.toolbarPathData);
              this.setToolbarComponentData();



              if (this.managerService.getCurrentRole()) {
                let perm = this.managerService.getCurrentRole()?.entryTypeRolesPermissions.find(x => x.entryTypeId == this.typeId);
                if (perm) {
                  this.sharedServices.setEntryTypePermissions(perm);
                }

              }

              (this.entryType.contractTypeIds + "").split(',').forEach(c => {
                let contract = this.managerService.getContractSettings().find(x => x.id == c);
                if (contract) {
                  this.contractsSettings.push(contract);
                }
              });

            }
          }
          if (params['voucherId']) {
            this.id = +params['voucherId'];

            if (this.id > 0) {
              localStorage.setItem("RecordId", params["voucherId"]);

              this.getVoucherById(this.id).then(a => {
                this.spinner.hide();

                this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
                this.listenToClickedButton();

              }).catch(e => {
                this.spinner.hide();
              });

              // let contractEnName = localStorage.getItem("contractEnName")!;
              // let contractArName = localStorage.getItem("contractArName")!;

            } else {
              this.spinner.hide();
              this.sharedServices.changeButton({ action: "New" } as ToolbarData);
              this.listenToClickedButton();
            }

          }
          else {
            this.voucherForm.controls['accId'].setValue(this.entryType?.defaultAccId);
            this.spinner.hide();
            Promise.all([this.getNewCode(this.typeId), this.getRentContactVoucherDuesForInsert(this.getContractSettingIds(), 0, 0)])
              .then(newCode => {


                this.voucherForm.controls['code'].setValue(newCode[0]);
                this.sharedServices.changeButton({ action: "New" } as ToolbarData);
                this.listenToClickedButton();
              }).catch(e => {
                this.spinner.hide();
              });

          }
        }
      });
    this.subsList.push(sub);
  }

  getSystemSettings() {
    if (this.managerService.getSystemSettings()?.length) {
      this.systemSettings = this.managerService.getSystemSettings()[0];
    }
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


  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe({
        next: res => {
          resolve();
          this.lang = res
        },
        error: (err) => {
          resolve();
        },
        complete: () => {
          resolve();
        }

      });

      this.subsList.push(sub);
    });

  }
  onSelectVoucherDate(e: DateModel) {
    this.voucherDate = e;
  }

  createForm() {
    this.voucherForm = this.fb.group({
      id: 0,
      typeId: null,
      code: ['', Validators.compose([Validators.required])],
      ownerId: '',
      officeId: '',
      tenantId: '',
      accId: null,
      purchaserId: '',
      //tenantAccId: '',
      //docDate: '',
      amount: '',
      notes: ''

    })
  }

  get f() {
    return this.voucherForm.controls;
  }
  setToolbarComponentData() {
    let entryNameAr = localStorage.getItem("entryNameAr")!;
    let entryNameEn = localStorage.getItem("entryNameEn")!;
    this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'اضافة' + ' ' + entryNameAr : 'Add' + ' ' + entryNameEn
    this.toolbarPathData.componentList = this.lang == 'ar' ? entryNameAr : entryNameEn
    this.voucherData = this.lang == 'ar' ? 'بيانات' + ' ' + entryNameAr : entryNameEn + ' ' + 'data'
    this.sharedServices.changeToolbarPath(this.toolbarPathData);

  }



  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
             
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate(['/control-panel/accounting/voucher-list'], { queryParams: { typeId: this.typeId } });
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {

            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {

            this.toolbarPathData.componentAdd = "component-names.add-voucher";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.ownerForm.reset();
            this.router.navigate(['/control-panel/accounting/add-voucher'], { queryParams: { typeId: this.typeId } });
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
             
            this.onUpdate();
          }

        }
      },
    });
    this.subsList.push(sub);
  }



  onSave() {

    // if (this.contractKindId == 1) {
    //   if (this.voucherForm.value.ownerId == '' || this.voucherForm.value.ownerId == null || this.voucherForm.value.ownerId == undefined) {
    //     this.errorMessage = this.translate.transform("voucher.owner-required");
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    //   if (this.voucherForm.value.tenantId == '' || this.voucherForm.value.tenantId == null || this.voucherForm.value.tenantId == undefined) {
    //     this.errorMessage = this.translate.transform("voucher.tenant-required");
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    // }
    // else if (this.contractKindId == 2 || this.contractKindId == 3) {
    //   if (this.voucherForm.value.ownerId == '' || this.voucherForm.value.ownerId == null || this.voucherForm.value.ownerId == undefined) {
    //     if (this.contractKindId == 2) {
    //       this.errorMessage = this.translate.transform("general.seller-required");
    //     }
    //     else if (this.contractKindId == 3) {
    //       this.errorMessage = this.translate.transform("general.purchaser-required");

    //     }
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    //   if (this.voucherForm.value.purchaserId == '' || this.voucherForm.value.purchaserId == null || this.voucherForm.value.purchaserId == undefined) {
    //     if (this.contractKindId == 2) {
    //       this.errorMessage = this.translate.transform("general.purchaser-required");
    //     }
    //     else if (this.contractKindId == 3) {
    //       this.errorMessage = this.translate.transform("general.seller-required");

    //     }
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    // }
    // if (this.isGenerateEntry == true) {
    //   if (this.contractKindId == 1 || this.contractKindId == 2 || this.contractKindId == 3) {

    //     if (this.voucherForm.value.ownerAccId == '' || this.voucherForm.value.ownerAccId == null || this.voucherForm.value.ownerAccId == undefined) {
    //       this.errorMessage = this.translate.transform("voucher.owner-acc-required");
    //       this.errorClass = 'errorMessage';
    //       this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //       return;
    //     }
    //   }
    // }
     
    if (!this.voucherForm.controls['accId'].value && this.entryType?.isGenerateEntry) {

      this.alertsService.showError(this.translate.transform("messages.voucher-acc-required"), this.translate.transform("message-title.wrong"));
      return;
    }
    if (this.voucher.voucherDetails.length == 0) {
      this.errorMessage = this.translate.transform("voucher.voucher-details-required");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return;
    }
    // if (this.voucher.VoucherDueDetails.length == 0) {
    //   this.errorMessage = this.translate.transform("voucher.voucher-dues-required");
    //   this.errorClass = 'errorMessage';
    //   this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //   return;
    // }

    if (this.entryType?.kindId == 1 || this.entryType?.kindId == 4) {

      if (this.voucherForm.controls["amount"].value != this.totalCredit) {
        this.errorMessage = this.translate.transform("voucher.total-detail-equal-amount");
        this.errorClass = 'errorMessage';
        this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
        return;
      }
    }

    if (this.entryType?.kindId == 2 || this.entryType?.kindId == 3) {
      if (this.voucherForm.controls["amount"].value != this.totalDebit) {
        this.errorMessage = this.translate.transform("voucher.total-detail-equal-amount");
        this.errorClass = 'errorMessage';
        this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
        return;
      }
    }
    this.voucherDueAmount = 0;
    this.voucher.voucherDueDetails.forEach(e => {
      this.voucherDueAmount = Number(this.voucherDueAmount) + Number(e.amount ?? 0)
    }
    )

    if (this.voucherDueAmount != this.voucherForm.controls["amount"].value && this.voucher.voucherDueDetails.length) {
      this.errorMessage = this.translate.transform("voucher.total-dues-equal-amount");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return;
    }
    if (this.voucherForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })      
      this.setInputData();
      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    }
    else {
      return this.voucherForm.markAllAsTouched();

    }
  }


  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.voucherServices.addWithResponse<Voucher>("AddWithCheck?uniques=Code", this.voucher).subscribe({
        next: (result: ResponseResult<Voucher>) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            this.router.navigate(['/control-panel/accounting/voucher-list'], { queryParams: { typeId: this.typeId } });
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
        error: (err) => {
          resolve();
        },
        complete: () => {

        }
      });

      this.subsList.push(sub);
    });
  }
  onUpdate() {
    // if (this.contractKindId == 1) {
    //   if (this.voucherForm.value.ownerId == '' || this.voucherForm.value.ownerId == null || this.voucherForm.value.ownerId == undefined) {
    //     this.errorMessage = this.translate.transform("voucher.owner-required");
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    //   if (this.voucherForm.value.tenantId == '' || this.voucherForm.value.tenantId == null || this.voucherForm.value.tenantId == undefined) {
    //     this.errorMessage = this.translate.transform("voucher.tenant-required");
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    // }
    // else if (this.contractKindId == 2 || this.contractKindId == 3) {
    //   if (this.voucherForm.value.ownerId == '' || this.voucherForm.value.ownerId == null || this.voucherForm.value.ownerId == undefined) {
    //     if (this.contractKindId == 2) {
    //       this.errorMessage = this.translate.transform("general.seller-required");
    //     }
    //     else if (this.contractKindId == 3) {
    //       this.errorMessage = this.translate.transform("general.purchaser-required");

    //     }
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    //   if (this.voucherForm.value.purchaserId == '' || this.voucherForm.value.purchaserId == null || this.voucherForm.value.purchaserId == undefined) {
    //     if (this.contractKindId == 2) {
    //       this.errorMessage = this.translate.transform("general.purchaser-required");
    //     }
    //     else if (this.contractKindId == 3) {
    //       this.errorMessage = this.translate.transform("general.seller-required");

    //     }
    //     this.errorClass = 'errorMessage';
    //     this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //     return;
    //   }
    // }
     
    if (!this.voucherForm.controls['accId'].value && this.entryType?.isGenerateEntry) {

      this.alertsService.showError(this.translate.transform("messages.voucher-acc-required"), this.translate.transform("message-title.wrong"));
      return;
    }
    if (this.voucher.voucherDetails.length == 0) {
      this.errorMessage = this.translate.transform("voucher.voucher-details-required");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return;
    }
    // if (this.voucher.VoucherDueDetails.length == 0) {
    //   this.errorMessage = this.translate.transform("voucher.voucher-dues-required");
    //   this.errorClass = 'errorMessage';
    //   this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
    //   return;
    // }

    if (this.entryType?.kindId == 1 || this.entryType?.kindId == 4) {

      if (this.voucherForm.controls["amount"].value != this.totalCredit) {
        this.errorMessage = this.translate.transform("voucher.total-detail-equal-amount");
        this.errorClass = 'errorMessage';
        this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
        return;
      }
    }

    if (this.entryType?.kindId == 2 || this.entryType?.kindId == 3) {
      if (this.voucherForm.controls["amount"].value != this.totalDebit) {
        this.errorMessage = this.translate.transform("voucher.total-detail-equal-amount");
        this.errorClass = 'errorMessage';
        this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
        return;
      }
    }
    this.voucherDueAmount = 0;
    this.voucher.voucherDueDetails.forEach(e => {
      this.voucherDueAmount = Number(this.voucherDueAmount) + Number(e.amount ?? 0)
    }
    )

    if (this.voucherDueAmount != this.voucherForm.controls["amount"].value && this.voucher.voucherDueDetails.length) {
      this.errorMessage = this.translate.transform("voucher.total-dues-equal-amount");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return;
    }
    if (this.voucherForm.valid) {
      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })      
      this.setInputData();

      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      });
    }
    else {
      return this.voucherForm.markAllAsTouched();

    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.voucherServices.updateWithUrl("UpdateWithCheck?uniques=Code", this.voucher).subscribe({
        next: (result) => {
          resolve();

          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            this.router.navigate(['/control-panel/accounting/voucher-list'], { queryParams: { typeId: this.typeId } });
          } else if (result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else {
            if (result.status == -100) {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.voucher-acc-required")
              );
            }
            else if (result.status == -2) {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.voucher-acc-required")
              );
            }
            else {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.update-failed")
              );
            }

          }
        },
        error: (err) => {
          resolve();
        },
        complete: () => {

        }
      });

      this.subsList.push(sub);
    });
  }

  setInputData() {
    this.voucher = {
      amount: this.voucherForm.controls["amount"].value,
      code: this.voucherForm.controls["code"].value,
      docDate: this.dateConverterService.getDateForInsertISO_Format(this.voucherDate),
      id: this.id,
      notes: this.voucherForm.controls["notes"].value,
      accId: this.voucherForm.controls["accId"].value,
      officeId: this.voucherForm.controls["officeId"].value,
      ownerId: this.voucherForm.controls["ownerId"].value,
      tenantId: this.voucherForm.controls["tenantId"].value,
      purchaserId: this.voucherForm.controls["purchaserId"].value,
      typeId: this.typeId,
      voucherDetails: this.voucher.voucherDetails ?? [],
      voucherDueDetails: this.voucher.voucherDueDetails ?? [],

    };


  }







  getAccounts() {


    this.accounts = this.managerService.getAccounts().filter(x => !x.deActivate && x.accState == AccountStateEnum.Sub);

  }

  // onChangeOwner(ownerId: any) {

  //   if (ownerId) {
  //     this.tenants = this.searchTenants.filter(x => x.ownerId == ownerId);
  //     this.purchasers = this.searchPurchasers.filter(x => x.ownerId == ownerId);

  //   }
  //   else {
  //     this.tenants = [];
  //     this.purchasers = [];

  //   }
  //   this.getSearchOwners();

  // }

  // getOfficeAccounts(officeId: any) {
  //   return this.accounts.filter(x => true);
  // }


  // getOwnerAccounts(ownerId: any) {
  //   return this.accounts.filter(x => true);
  // }


  // getTenantAccounts(tenantId: any) {
  //   return this.accounts.filter(x => true);
  // }

  onVoucherDetailsChange(voucherDetails: VoucherDetail[]) {

    this.voucher!.voucherDetails = voucherDetails;
    this.totalDebit = 0;
    this.totalCredit = 0;

    voucherDetails.forEach(v => {
      this.totalDebit += (v.debit ?? 0);
      this.totalCredit += (v.credit ?? 0);

    })

    if (this.entryType) {
      if (this.entryType.kindId == 1 || this.entryType.kindId == 4) {
        this.voucherForm.controls["amount"].setValue(this.totalCredit)
      }

      else if (this.entryType.kindId == 2 || this.entryType.kindId == 3) {
        this.voucherForm.controls["amount"].setValue(this.totalDebit)
      }
    }
  }
  voucherDataForUpdate!: VoucherData;
  voucherObj!: Voucher;
  getVoucherById(voucherId: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.voucherServices.getWithResponse<VoucherData>("GetVoucherData?id=" + voucherId).subscribe({
        next: (res: ResponseResult<VoucherData>) => {
          console.log("Voucher Data --------------", res);
          resolve();
          if (res.success && res.data) {
            this.voucherDataForUpdate = JSON.parse(JSON.stringify(res.data));
            this.voucherObj = {
              accId: res.data.accId,
              amount: res.data.amount,
              code: res.data.code,
              docDate: res.data.docDate,
              id: res.data.id,
              notes: res.data.notes,
              officeId: res.data.officeId,
              ownerId: res.data.ownerId,
              purchaserId: res.data.purchaserId,
              tenantId: res.data.tenantId,
              typeId: res.data.typeId,
              voucherDetails: res.data.voucherDetails,
              voucherDueDetails: []

            };
            if (this.voucherObj.ownerId) {
              this.tenants = this.managerService.getTenants().filter(x => x.ownerId == this.voucherObj.ownerId);
            }

            if (this.voucherObj ?? null) {
              this.voucherForm.patchValue({ ...this.voucherObj });
            }
            this.voucherRentContractDues = res.data?.voucherDueDetails ?? [];
            this.voucherDetails = res.data?.voucherDetails ?? [];
            this.voucher.voucherDetails = [...this.voucherDetails];

            this.voucher.voucherDueDetails = res.data.voucherDueDetails.map(a => {
              let d: VoucherDueDetails = {
                id: a.id,
                amount: a.amount,
                creditNoteVoucherAmount: a.creditNoteVoucherAmount,
                debitNoteVoucherAmount: a.debitNoteVoucherAmount,
                dueId: a.dueId,
                notes: a.notes,
                parentId: res.data!.id,
                payVoucherAmount: a.payVoucherAmount,
                recieveVoucherAmount: a.recieveVoucherAmount,
                settlementAmount: a.settlementAmount,
                settlementDiscount: a.settlementDiscount
              };
              return d;
            });
            this.onVoucherDetailsChange(res.data.voucherDetails);


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

  onChangeOwner(ownerId: any) {
     
    if (this.id && this.voucher.voucherDueDetails.length) {
      return;
    }
    else {
      this.selectedOwnerId = ownerId;
      if (!ownerId) {
        this.selectedTenantId = 0;
      }

      this.tenants = this.managerService.getTenants().filter(x => x.ownerId == ownerId);
      let owner = this.owners.find(x => x.id == ownerId);
      if (!this.generalAccountIntegration) {
        if (owner?.ownerIntegrationSettings) {
          if (owner.ownerIntegrationSettings.accIntegrationType == AccIntegrationTypeEnum.Resort) {
            this.getResortAccountsByOwner(owner.id);
          }
          else if (owner.ownerIntegrationSettings.accIntegrationType == AccIntegrationTypeEnum.Web) {
            this.getWebAccountsByOwner(owner.id);
          }
          else {

            this.getAccounts();
          }
        }
        else {
          this.getAccounts();
        }
      }
      else {
        if (this.generalAccountIntegration.accIntegrationType == AccIntegrationTypeEnum.None) {
          this.getAccounts();
        }
      }
      this.spinner.show();
      this.getRentContactVoucherDuesForInsert(this.getContractSettingIds(), this.selectedTenantId ?? 0, this.selectedOwnerId ?? 0).then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });

    }



  }

  onChangeTenant(tenantId: any) {
    if (!this.id) {
      this.selectedTenantId = tenantId ?? 0;
      this.spinner.show();
      this.getRentContactVoucherDuesForInsert(this.getContractSettingIds(), this.selectedTenantId ?? 0, this.selectedOwnerId ?? 0).then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });

    }

  }

  getContractSettingIds() {
    let contractSettingIds = '';
    if (this.selectedContractSettings && this.selectedContractSettings.length) {
      this.selectedContractSettings.forEach(c => {
        contractSettingIds += c.id + ",";
      });

      if (contractSettingIds.length) {
        contractSettingIds = contractSettingIds.slice(0, contractSettingIds.length - 1);
      }
    }
    else {
      this.contractsSettings.forEach(c => {
        contractSettingIds += c.id + ",";
      });

      if (contractSettingIds.length) {
        contractSettingIds = contractSettingIds.slice(0, contractSettingIds.length - 1);
      }
    }

    console.log("--------------------------------------------", contractSettingIds);

    return contractSettingIds;
  }



  onVoucherDueChange(e: VoucherDueDetails[]) {
    this.voucher.voucherDueDetails = [...e];
    console.log("voucher Dues", e);
  }
  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.alertsService.showSuccess(
        message,
        this.translate.transform('messages.done')
      );
    } else if (responseStatus == true && AlertTypes.warning) {
      this.alertsService.showWarning(
        message,
        this.translate.transform('messages.alert')
      );
    } else if (responseStatus == true && AlertTypes.info) {
      this.alertsService.showInfo(
        message,
        this.translate.transform('messages.info')
      );
    } else if (responseStatus == false && AlertTypes.error) {
      this.alertsService.showError(
        message,
        this.translate.transform('messages.error')
      );
    }
  }


  // getLastVoucherCode(typeId: any) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.voucherServices.getWithResponse<Voucher>("getLastVoucherCode?typeId=" + typeId).subscribe({
  //       next: (res) => {
  //         this.voucherForm.value.code = JSON.parse(JSON.stringify(res.data));
  //         this.code = JSON.parse(JSON.stringify(res.data));

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


  getNewCode(typeId: any) {
    return new Promise<string>((resolve, reject) => {
      let sub = this.voucherServices.getWithResponse<NewCode[]>("GetNewCode?typeId=" + typeId).subscribe({
        next: (res) => {

          let newCode: string = "";
          if (res.data && res.data.length) {
            newCode = res.data[0].code;
          }
          resolve(newCode);


        },
        error: (err) => {
          resolve('');
        },
        complete: () => { }
      });
      this.subsList.push(sub);
    });

  }

  onChangeContractSetting(e) {
    console.log(e);
  }

  getRentContactVoucherDuesForInsert(contractsSettigsIds: string, tenantId: number, ownerId: number) {
    return new Promise<void>((resolve, reject) => {
       
      if (!this.entryType?.contractTypeIds) {
        resolve();
        return;
      }

      let sub = this.rentContractDueService
        .getWithResponse<VoucherRentDueDetailsVm[]>(`GetRentContractDuesForVouchers?contractSettingIds=${contractsSettigsIds}&ownerId=${ownerId}&tenantId=${tenantId}`).subscribe({
          next: (res) => {
            console.log(res);
            resolve();
            if (res.success) {
              this.voucherRentContractDues = res.data ?? [];
            }
          },
          error: (err) => {
            resolve();
          },
          complete: () => {
            resolve();
          }
        });

      this.subsList.push(sub);
    });

  }

  onChangeContracts() {
    if (this.id && this.voucher.voucherDueDetails.length) {
      return;
    } else {

      this.getRentContactVoucherDuesForInsert(this.getContractSettingIds(), this.selectedTenantId ?? 0, this.selectedOwnerId ?? 0).then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    }
  }

  checkMode() {
    if (this.id && this.voucher.voucherDueDetails.length) {
      return true;
    }
    return false;
  }





}
