import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { Tenants } from 'src/app/core/models/tenants';
import { Realestate } from 'src/app/core/models/realestates';
import { Building } from 'src/app/core/models/buildings';
import { Unit } from 'src/app/core/models/units';
import { ContractsSettings } from 'src/app/core/models/contracts-settings';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { DateCalculation } from 'src/app/core/services/local-services/date-services/date-calc.service';
import { ActivatedRoute, Router } from '@angular/router';
import { accountType, AlertTypes, CalendarTypesArEnum, CalendarTypesEnum, contractTypesEnum, convertEnumToArray, PermissionType, pursposeTypeEnum, SalesBuyContractDuesEnum, ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { Subscription } from 'rxjs';
import { DateModel } from 'src/app/core/view-models/date-model';
import { SystemSettings } from '../../../../core/models/system-settings';
import { Contract } from 'src/app/core/models/contract';
import { Accounts } from 'src/app/core/models/accounts';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { SalesBuyContractUnit } from 'src/app/core/models/sales-buy-contract-unit';
import { SalesBuyContractsService } from 'src/app/core/services/backend-services/sales-contracts.service';
import { ContractSettingsRolePermissions } from 'src/app/core/models/contract-settings-role-permissions';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ContractSettingsUsersPermissionsService } from 'src/app/core/services/backend-services/contract-settings-users-permissions.service';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NewCode } from 'src/app/core/view-models/new-code';
import { SalesBuyContracts } from 'src/app/core/models/sales-buy-contracts';
import { SalesBuyContractDue } from 'src/app/core/models/sales-buy-contract-due';
import { Owner } from 'src/app/core/models/owners';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from 'src/app/shared/message-modal/message-modal.component';
import { Office } from 'src/app/core/models/offices';
import { checkRequiredFormFields } from 'src/app/helper/helper';



@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, AfterViewInit, OnDestroy {

  selectedSalesBuyContractUnits: SalesBuyContractUnit[] = [];
  //salesBuyContractDueList: SalesBuyContractDue[] = [];
  selectedSearchSalesBuyContractUnit: SalesBuyContractUnit = new SalesBuyContractUnit();
  systemSettings: SystemSettings = new SystemSettings();
  sellers: Tenants[] = [];
  buyers: Tenants[] = [];
  offices: Office[] = [];
  subsList: Subscription[] = [];
  contractUnitsTotalForm!: FormGroup;
  //totalArea: number = 0;
  //averagePriceOfMeter: number = 0;
  //totalBeforeTax: number = 0;
  //totalTaxes: number = 0;
  totalWithTax: number = 0;
  //firstPaymentAmount: number = 0;
  //lastPaymentAmount: number = 0;
  //numberOfPayments: number = 0;
  //paymentPerTime: number = 0;
  //periodBetweenAmountPerMonth: number = 0;
  contractUnit: SalesBuyContractUnit[] = [];
  lang: string = '';
  contractData: string = '';
  errorMessage = '';
  errorClass = '';
  sub: any;
  ownerAccountId: any;
  purchaserAccountId: any;
  taxAccountId: any;
  deferredRevenueAccountId: any;
  accuredRevenueAccountId: any;
  contractForm!: FormGroup;

  contractDate!: DateModel;
  firstDueDate!: DateModel;
  //startContractDate!: DateModel;
  //endContractDate!: DateModel;
  calendarTypes: ICustomEnum[] = [];
  owners: Owner[] = [];
  tenants: Tenants[] = [];
  units: Unit[] = [];
  realestates: Realestate[] = [];
  buildings: Building[] = [];
  contractSettings: ContractsSettings = new ContractsSettings();
  ownerAccounts: Accounts[] = [];
  oppositeAccounts: Accounts[] = [];
  taxAccounts: Accounts[] = [];
  deferredRevenueAccounts: Accounts[] = [];
  accuredRevenueAccounts: Accounts[] = [];

  salesBuyContractDues: SalesBuyContractDue[] = [];

  contract: Contract = new Contract();
  settingId: any;
  typeId: any;
  dateType: any = 1;
  id: any = 0;
  currnetUrl;
  addUrl: string = '/control-panel/definitions/add-contract';
  updateUrl: string = '/control-panel/definitions/update-contract/';
  listUrl: string = '/control-panel/definitions/contracts-list';

  // toolbarPathData: ToolbarPath = {
  //   listPath: '',
  //   updatePath: this.updateUrl,
  //   addPath: this.addUrl,
  //   componentList: "component-names.contracts",
  //   componentAdd: "component-names.add-contract",
  // };

  toolbarPathData: ToolbarPath = {
    listPath: '',
    addPath: '',
    updatePath: '',
    componentList: 'component-names.list-contracts',
    componentAdd: '',

  };
  contractSetting?: ContractsSettings;

  constructor(

    private AlertsService: NotificationsAlertsService,
    private dateService: DateCalculation,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private sharedServices: SharedService,
    private salesBuyContractService: SalesBuyContractsService,
    private contractSettingsUserPermisionsService: ContractSettingsUsersPermissionsService,
    private systemSettingsService: SystemSettingsService,
    private translate: TranslatePipe,
    private managerService: ManagerService,
    private route: ActivatedRoute,
    private searchDialog: SearchDialogService,
    private modalService: NgbModal,
  ) {
    this.createContractForm();
  }

  ngOnDestroy(): void {
    this.subsList.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    })
  }
  //
  //oninit
  ngOnInit(): void {
    this.sharedServices.setPermissionsStatus({ permissionStatus: PermissionType.Contract });

    //this.startContractDate = this.dateService.getCurrentDate();
    //this.endContractDate = this.dateService.getCurrentDate();
    this.firstDueDate = this.dateService.getCurrentDate();
    this.contractDate = this.dateService.getCurrentDate();
    this.spinner.show();
    Promise.all([
      this.getLanguage(),
      this.managerService.loadSystemSettings(),
      this.managerService.loadOwners(),
      this.managerService.loadTenantsByRole("1,2"), //عملاء البيع والشراء
      this.managerService.loadUnitsByPurpose("2,4"), //وحدات البيع والشراء
      this.managerService.loadOffices(),
      this.managerService.loadVendors(),
      this.managerService.loadRealestate(),
      this.managerService.loadBuildings(),
      this.managerService.loadContractSettings(),
      this.managerService.loadOffices(),
      this.managerService.loadAccounts(),
      this.managerService.loadCurrentRoleAndPermission()

    ]).then(a => {
       
      this.getCalendarTypes();
      this.realestates = this.managerService.getRealestates();
      this.owners = this.managerService.getOwners();
      this.sellers = this.managerService.getTenants().filter(x => x.recordRole.includes("1"))
      this.buyers = this.managerService.getTenants().filter(x => x.recordRole.includes("2"))
      this.offices = this.managerService.getOffices();
      this.getAccounts();
      this.getSystemSettings();
      this.getRouteData();
      this.changePath();
      this.listenToClickedButton();
    });


  }

  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }


  getRouteData() {
    let sub = this.route.queryParams.subscribe(params => {
       
      if (params['settingId'] || params['settingid']) {
        this.settingId = params['settingId'] ?? params['settingid'];

        this.contractForm.controls["contractSettingId"].setValue(this.settingId);
        this.contractSetting = this.managerService.getContractSettings().find(x => x.id == this.settingId);


        if (this.contractSetting) {
          this.setToolbarComponentData();
          console.log("نمط العقد -------------------------", this.contractSetting);
          if (this.contractSetting?.contractTypeId == contractTypesEnum.Sell) {
            // this.spinner.show();
            // this.managerService.loadUnitsByPurpose("2").then(a=>{
            //   this.spinner.hide();
            // });
            this.setDynamicValidation("buyerId", true);
            this.setDynamicValidation("sellerId", false);
            this.units = this.managerService.getUnits().filter(x => x.purposeType.includes("2"));
          }
          else if (this.contractSetting?.contractTypeId == contractTypesEnum.Purchase) {
            this.setDynamicValidation("buyerId", false);
            this.setDynamicValidation("sellerId", true);
            // this.spinner.show();
            // this.managerService.loadUnitsByPurpose("4").then(a=>{
            //   this.spinner.hide();
            // });
            this.units = this.managerService.getUnits().filter(x => x.purposeType.includes("4"));
          }




          if (this.managerService.getCurrentRole()) {
            let perm = this.managerService.getCurrentRole()?.contractSettingsRolesPermissions.find(x => x.contractSettingId == this.settingId);
            if (perm) {
              this.sharedServices.setContractPermissions(perm);
            }

          }

        }
      }
      // else {
      //   this.settingId = localStorage.getItem("ContractSettingId")
      // }

      // this.loadContractPermission(this.settingId).then(a => {
      if (params['contractId']) {
        this.id = +params['contractId'];

        if (this.id) {
          localStorage.setItem("RecordId", params["id"]);

          this.getContractById(this.id).then(a => {
            this.spinner.hide();
            if (params['issue'] == 1) {
              this.sharedServices.changeButton({ action: 'Issue' } as ToolbarData);
            }
            else {
              this.sharedServices.changeButton({ action: 'Update' } as ToolbarData);
            }

            // this.listenToClickedButton();

          }).catch(e => {
            this.spinner.hide();
          });

          // let contractEnName = localStorage.getItem("contractEnName")!;
          // let contractArName = localStorage.getItem("contractArName")!;

        } else {
          this.spinner.hide();
          this.sharedServices.changeButton({ action: "New" } as ToolbarData);
          //this.listenToClickedButton();
        }

      }
      else {

        this.getNewCode().then(newCode => {

          this.spinner.hide();
          this.contractForm.controls['code'].setValue(newCode);
          this.sharedServices.changeButton({ action: "New" } as ToolbarData);
          //this.listenToClickedButton();

        }).catch(e => {
          this.spinner.hide();
        })

      }








      this.setRouteUrl(this.settingId, this.id)
      // }).catch(e => {
      //   this.spinner.hide();
      // });

    });
    this.subsList.push(sub);
  }

  onChangeOwner(ownerId: any) {

  }

  // setRouteUrl(settingId, contractId) {
  //   let queryParams = "";
  //   if (settingId) {
  //     queryParams += "settingId=" + settingId
  //   }
  //   if (contractId) {
  //     queryParams += "contractId=" + contractId;
  //   }


  //   if (queryParams) {
  //     queryParams = "?" + queryParams;
  //   }

  //   this.listUrl = '/control-panel/definitions/contracts-list' + queryParams;
  //   this.addUrl = '/control-panel/definitions/add-contract' + queryParams;
  //   this.updateUrl = '/control-panel/definitions/update-contract' + queryParams;
  //   this.toolbarPathData = {
  //     listPath: this.listUrl,
  //     updatePath: this.updateUrl,
  //     addPath: this.addUrl,
  //     componentList: 'component-names.list-contracts',
  //     componentAdd: 'component-names.add-contract',
  //   };
  // }

  setRouteUrl(settingId, contractId) {
     
    let queryParams = "";
    if (settingId) {
      queryParams += "settingId=" + settingId
    }
    if (contractId) {
      queryParams += "contractId=" + contractId;
    }



    this.listUrl = '/control-panel/definitions/contracts-list' + queryParams;
    this.addUrl = '/control-panel/definitions/add-contract' + queryParams;
    this.updateUrl = '/control-panel/definitions/update-contract' + queryParams;
    this.toolbarPathData = {
      listPath: this.listUrl,
      updatePath: this.updateUrl,
      addPath: this.addUrl,
      componentList: 'component-names.list-contracts',
      componentAdd: 'component-names.add-contract',
    };
  }
  ngAfterViewInit(): void {

    // this.endContractDate = this.dateService.calculateEndDateForGregrion(1, 2, this.dateService.getCurrentDate(), 0)
    // this.endContractDate = this.dateService.getDateForCalender(this.endContractDate.month + 1 + "/" + this.endContractDate.day + "/" + this.endContractDate.year);
  }
  getLanguage() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.sharedServices.getLanguage().subscribe(res => {
        resolve();
        this.lang = res
      });

      this.subsList.push(sub);
    })

  }
  //#region Permissions
  pagePermission!: ContractSettingsRolePermissions;
  userPermissions!: UserPermission;
  getPagePermissions() {
    const promise = new Promise<void>((resolve, reject) => {
      this.contractSettingsUserPermisionsService.getAll("GetContractSettingsUsersPermissionsOfCurrentUser").subscribe({
        next: (res: any) => {
          let permissions: ContractSettingsRolePermissions[] = JSON.parse(JSON.stringify(res.data));
          this.pagePermission = permissions.find(x => x.contractSettingId == Number(this.settingId))!
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

  // getEndDate() {
  //   this.endContractDate = this.dateService.getDateForCalender(this.startContractDate.month + 1 + "/" + this.startContractDate.day + "/" + (this.startContractDate.year + 1));

  // }
  // cleanControlls() {
  //   this.contractDate = this.dateService.getCurrentDate();
  //   this.startContractDate = this.dateService.getCurrentDate();
  //   // if(this.ContractForm.value.calendarType=='' || this.ContractForm.value.calendarType==1)
  //   // {

  //   this.endContractDate = this.dateService.calculateEndDateForGregrion(1, 2, this.dateService.getCurrentDate(), 0)


  //   //   this.endContractDate= new Date(starttempdate.setMonth(Number.parseInt(starttempdate.getMonth().toString()) + Number.parseInt(period.toString())));


  //   this.endContractDate = this.dateService.getDateForCalender(this.endContractDate.month + 1 + "/" + this.endContractDate.day + "/" + this.endContractDate.year);
  //   // }
  //   // else if(this.ContractForm.value.calendarType==2)
  //   // {
  //   //   this.endContractDate =this.dateService.calculateEndDateForHijri(1,2,this.dateService.getCurrentDate(),0)

  //   // }
  //   // (this.startContractDate.month + 1) + "/" + this.startContractDate.day + "/" + this.startContractDate.year;
  //   //this.dateService.getCurrentDate();
  //   this.firstDueDate = this.dateService.getCurrentDate();








  //   this.contractForm.value.endContractDate = this.endContractDate;
  //   //this.annualIncreaseChecked=1;
  //   this.contractForm.value.annualIncreaseChecked = 1


  //   // this.contractUnitsForm = this.fb.group({
  //   //   unitId: ['', Validators.compose([Validators.required])],
  //   //   unitNameAr: '',
  //   //   unitNameEn: '',
  //   //   areaSize: ['', Validators.compose([Validators.required])],
  //   //   pricePerMeter: ['', Validators.compose([Validators.required])],
  //   //   total: { value: '', disabled: true },

  //   //   taxRatio: '',
  //   //   taxesAmount: '',
  //   //   totalWithTax: { value: '', disabled: true },
  //   //   totalBeforeTax: '',
  //   //   totalTaxes: '',


  //   // })



  // }

  createContractForm() {
    this.contractForm = this.fb.group({
      // createDate: '',
      // startContractDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      //endContractDate: [this.endContractDate, Validators.compose([Validators.required])],
      id: 0,
      contractSettingId: '',
      code: ['', Validators.compose([Validators.required])],
      contractStatus: 0,
      contractDate: [this.dateService.getCurrentDate(), Validators.compose([Validators.required])],
      ownerId: ['', Validators.compose([Validators.required])],
      sellerId: [''],
      buyerId: [''],
      ownerAccountId: '',
      oppositeAccountId: '',
      taxAccountId: '',
      realestateId: '',
      buildingId: ['', Validators.compose([Validators.required])],
      totalTaxes: 0,
      calendarType: [1, Validators.compose([Validators.required])],
      firstPaymentAmount: 0,
      lastPaymentAmount: 0,
      notes: '',
      firstDueDate: [this.dateService.getCurrentDate()],
      totalArea: 0,
      averagePriceOfMeter: 0,
      totalWithTax: '',
      amountPerTime: 0,
      periodBetweenAmountPerMonth: 1,
      numberOfPayments: 0,
      deferredRevenueAccountId: '',
      accuredRevenueAccountId: '',
      remainingAmount: 0,
      totalBeforeTax: 0,


      salesBuyContractsUnits: [],
      salesBuyContractsDues: [],




      prepaidAmount: 0,
      officeId: '',



    });

  }

  //

  //Methods

  // getContractById(id: any) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.salesBuyContractService
  //       .getWithResponse<Contract>(
  //         'GetByFieldName?fieldName=Id&fieldValue=' + id
  //       )
  //       .subscribe({
  //         next: (res) => {
  //           if (res.success) {
  //             this.contract = JSON.parse(JSON.stringify(res.data));
  //             this.ownerAccountId = this.contract.ownerAccountId;
  //             this.purchaserAccountId = this.contract.purchaserAccountId;
  //             this.taxAccountId = this.contract.taxAccountId;
  //             this.deferredRevenueAccountId = this.contract.deferredRevenueAccountId;
  //             this.accuredRevenueAccountId = this.contract.accuredRevenueAccountId;

  //             this.setFormValue();
  //             resolve();
  //           }
  //         },
  //         error: (err: any) => {
  //           this.spinner.hide();
  //           reject(err);
  //         },
  //         complete: () => { },
  //       });
  //     this.subsList.push(sub);
  //   });

  // }
  getCalendarTypes() {

    if (this.lang == 'ar') {
      this.calendarTypes = convertEnumToArray(CalendarTypesArEnum);

    }
    else {
      this.calendarTypes = convertEnumToArray(CalendarTypesEnum);

    }
  }


  getContractById(id: any) {
    return new Promise<void>((resolve, reject) => {
      let sub = this.salesBuyContractService.getWithResponse<SalesBuyContracts>(`GetById?Id=${id}&includes=SalesBuyContractsUnits,SalesBuyContractsDues`).subscribe({
        next: (res: ResponseResult<SalesBuyContracts>) => {
          resolve();
          if (res.data) {
            console.log("Contract Data===============", res.data);
            this.onChangeRealestate(res.data.realestateId);
            this.onChangeBuilding(res.data.buildingId);

            res.data.salesBuyContractsUnits.forEach(a => {
              let unit = this.units.find(x => x.id == a.unitId)
              a.unitNameAr = unit?.unitNameAr ?? "";
              a.unitNameEn = unit?.unitNameEn ?? "";


            })

            this.selectedSalesBuyContractUnits = res.data.salesBuyContractsUnits ?? [];
            this.contractForm.patchValue({
              ...res.data
            });

            this.totalWithTax = res.data.totalWithTax;            


            this.salesBuyContractDues = res.data.salesBuyContractsDues;



            this.contractDate = this.dateService.getDateForCalender(res.data.contractDate);
            // this.startContractDate = this.dateService.getDateForCalender(res.data.startContractDate);
            // this.endContractDate = this.dateService.getDateForCalender(res.data.endContractDate);

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

  onChangeRealestate(realestateId) {

    this.contractForm.controls['buildingId'].setValue('');
    this.buildings = this.managerService.getBuildings().filter(x => x.realestateId == realestateId);
  }
  onChangeBuilding(buildingId) {
    this.units = this.managerService.getUnits().filter(x => x.buildingId == buildingId);
  }




  getAccounts() {
    this.ownerAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Owner);
    this.taxAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tax);
    this.oppositeAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Purchases);
    this.deferredRevenueAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Deferred Revenue']);
    this.accuredRevenueAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Accured Revenue']);
  }



  getBuildings() {

    if (this.contractForm.value.ownerId && this.contractForm.value.realestateId) {
      this.buildings = this.managerService.getBuildings().filter(x => x.ownerId == this.contractForm.value.ownerId && x.realestateId == this.contractForm.value.realestateId);
    }

    else if (this.contractForm.value.realestateId) {
      this.buildings = this.managerService.getBuildings().filter(x => x.subRealestateId == this.contractForm.value.realestateId);
    }
    else if (this.contractForm.value.ownerId) {
      this.buildings = this.managerService.getBuildings().filter(x => x.ownerId == this.contractForm.value.ownerId);
    }
  }
  // getUnits(buildingId: any) {
  //   return new Promise<void>((resolve, reject) => {
  //     let sub = this.store.select(UnitSelectors.selectors.getListSelector).subscribe({
  //       next: (res: UnitsModel) => {

  //         if (buildingId != null && buildingId != '') {

  //           this.units = res.list.filter(x => x.buildingId == buildingId && (x.purposeType == pursposeTypeEnum['For Sell'] || x.purposeType == pursposeTypeEnum['For Sell and Rent']));
  //         }

  //         resolve();

  //       },
  //       error: (err: any) => {
  //         resolve();
  //       },
  //       complete: () => {
  //         resolve();
  //       },
  //     });
  //     this.subsList.push(sub);
  //   });

  // }

  showResponseMessage(responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      this.AlertsService.showSuccess(message, this.translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning == alertType) {
      this.AlertsService.showWarning(message, this.translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info == alertType) {
      this.AlertsService.showInfo(message, this.translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error == alertType) {
      this.AlertsService.showError(message, this.translate.transform("messageTitle.error"));
    }
    else if (responseStatus == true && AlertTypes.issue == alertType) {
      this.AlertsService.showSuccess(message, this.translate.transform("messageTitle.done"));

    }
  }
  getMonthDifference(startDate, endDate) {

    // startDate='01-01-2022'
    // endDate='01-01-2023'
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }


  get f(): { [key: string]: AbstractControl } {
    return this.contractForm.controls;
  }





  navigateUrl(urlroute: string) {
    this.router.navigate([urlroute]);
  }

  getContractDate(selectedDate: DateModel) {
    this.contractDate = selectedDate;
    // this.contractForm.value.contractDate=selectedDate;
  }
  // getStartContractDate(selectedDate: DateModel) {
  //    
  //   this.startContractDate = selectedDate;
  //   // this.contractForm.value.startContractDate=selectedDate;

  //   this.getEndDate();
  // }
  // getEndContractDate(selectedDate: DateModel) {
  //   this.endContractDate = selectedDate;
  //   // this.contractForm.value.endContractDate=selectedDate;

  // }
  getFirstDueDate(selectedDate: DateModel) {
    this.firstDueDate = selectedDate;
  }

  // getEndContractDateByPeriod() {
  //   if (this.contractForm.value.period != null && this.contractForm.value.rentMethodType == 2) {

  //     let period = this.contractForm.value.period;
  //     this.endContractDate = this.dateService.getDateForCalender(this.startContractDate.month + 1 + "/" + this.startContractDate.day + "/" + (this.startContractDate.year + period));

  //   }
  // }

  // onBuldingChange(buildingId: any) {
  //   this.getUnits(buildingId);


  // }


  // viewUnitData(id: any) {

  // }

  // filterByOwner(ownerId: any) {

  //   this.purchasers = this.searchPurchasers.filter(x => x.ownerId == ownerId);
  //   this.searchRealestate = this.realestates.filter(x => x.ownerId == ownerId);

  //   this.filterBuildings();
  // }

  // filterByBuilding(buildingId: any, ownerId: any) {
  //   //getUnits();getMaintenanceUnits(ContractForm.value.buildingId)
  // }

  onChangeAmoutPerTime() {
    this.calculateContractTotals();

  }

  calculateAmountPerTime() {
     
    if (this.contractForm.value.numberOfPayments) {
      let prepaidAmount = Number(this.contractForm.value.prepaidAmount)
      let firstPaymentAmount = Number(this.contractForm.value.firstPaymentAmount);
      let lastPaymentAmount = Number(this.contractForm.value.lastPaymentAmount)
      let remainAmount = this.totalWithTax - prepaidAmount - firstPaymentAmount - (lastPaymentAmount);
      let countOfPayments = Number(this.contractForm.value.numberOfPayments)
      this.contractForm.controls["amountPerTime"].setValue(this.systemSettingsService.setDecimalNumberSetting(remainAmount / countOfPayments, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.calculateContractDues();
    }
  }

  calculateCountOfPayments() {
    let prepaidAmount = Number(this.contractForm.value.prepaidAmount)
    let firstPaymentAmount = Number(this.contractForm.value.firstPaymentAmount);
    let lastPaymentAmount = Number(this.contractForm.value.lastPaymentAmount)

    let remainAmount = this.totalWithTax - prepaidAmount - firstPaymentAmount - (lastPaymentAmount);
    console.log("Remain Amounts ------------------------ ", remainAmount);
    let amountPerTime = Number(this.contractForm.value.amountPerTime);
    if (amountPerTime == 0) {
      return;
    }
    let countOfPayment = Math.floor(remainAmount / Number(this.contractForm.value.amountPerTime));
    let difference = remainAmount - countOfPayment * amountPerTime;
    if (difference > 0) {
      countOfPayment = countOfPayment + 1;
    }

    console.log("-----------------Count of Payments --------------------");
    this.contractForm.controls['numberOfPayments'].setValue(countOfPayment);
    this.calculateContractDues();
  }

  onCahngeFirstOrLastPayment() {
    this.calculateAmountPerTime();
    this.calculateContractDues();
  }
  calculateContractDues() {

    this.calculateContractTotals();
    //let index: number = Number(this.contractForm.value.periodBetweenAmountPerMonth);
    let periodBetweenAmountPerMonth = Number(this.contractForm.value.periodBetweenAmountPerMonth);
    this.salesBuyContractDues = [];
    let numberOfPayments = Number(this.contractForm.value.numberOfPayments);
    let amountPerTime = Number(this.contractForm.value.amountPerTime);
    let firstPaymentAmount = Number(this.contractForm.value.firstPaymentAmount);
    let lastPaymentAmount = Number(this.contractForm.value.lastPaymentAmount);
    let calendarType = this.contractForm.controls['calendarType'].value;






    // if (numberOfPayments > 0) {
    //   this.paymentPerTime = this.setDecimalNumber(remainAmount / this.numberOfPayments);
    // }

    let accumulatedPeriod: number = 0;
    let contractPeriodsList: number[] = [];
    for (let k = 0; k < numberOfPayments; k++) {
      contractPeriodsList.push(periodBetweenAmountPerMonth);
    }
    if (firstPaymentAmount > 0) {
      contractPeriodsList.push(periodBetweenAmountPerMonth);
    }
    if (lastPaymentAmount > 0) {
      contractPeriodsList.push(periodBetweenAmountPerMonth);
    }
    let startCalcDate: { year: number, month: number, day: number } = {
      year: 0,
      month: 0,
      day: 0
    }
    let endCalcDate: { year: number, month: number, day: number } =
      { year: 0, month: 0, day: 0 };


    if (firstPaymentAmount > 0) {

      if (calendarType == CalendarTypesEnum.Gregorian) {
        //عقد ميلادي
        startCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.firstDueDate, 0);
        accumulatedPeriod += contractPeriodsList[0];
        endCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.firstDueDate, 1);
      }
      else {
        //عقد هجري
        startCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.firstDueDate, 0);
        accumulatedPeriod += contractPeriodsList[0];
        endCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.firstDueDate, 1);
      }

      this.salesBuyContractDues.push({
        contractId: 0,
        dueAmount: firstPaymentAmount,
        dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
        dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
        id: 0,
        isEntryGenerated: false,
        isInvoiced: false,
        notes: "",
        paid: 0,
        unitId: 0,
        typeId: SalesBuyContractDuesEnum.firstPayment,
        dueName: "",
        goundId: 0
      });
    }




    for (let i = 0; i < numberOfPayments; i++) {
      let k = i;
      if (firstPaymentAmount > 0) {
        k = i + 1;
      }


      if (calendarType == CalendarTypesEnum.Gregorian) {
        //عقد ميلادي
        startCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.firstDueDate, 0);
        accumulatedPeriod += contractPeriodsList[k];
        endCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.firstDueDate, 1);
      }
      else {
        //عقد هجري
        startCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.firstDueDate, 0);
        accumulatedPeriod += contractPeriodsList[k];
        endCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.firstDueDate, 1);
      }



      //index += ((k + 1) * periodBetweenAmountPerMonth);
      this.salesBuyContractDues.push({
        contractId: 0,
        dueAmount: amountPerTime,
        dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
        dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
        id: 0,
        isEntryGenerated: false,
        isInvoiced: false,
        notes: "",
        paid: 0,
        unitId: 0,
        typeId: SalesBuyContractDuesEnum.installment,
        dueName: "",
        goundId: 0

      })
    }
    if (lastPaymentAmount > 0) {

      if (calendarType == CalendarTypesEnum.Gregorian) {
        //عقد ميلادي
        startCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.firstDueDate, 0);
        accumulatedPeriod += contractPeriodsList[contractPeriodsList.length - 1];
        endCalcDate = this.dateService.calculateEndDateForGregrion(accumulatedPeriod, 1, this.firstDueDate, 1);
      }
      else {
        //عقد هجري
        startCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.firstDueDate, 0);
        accumulatedPeriod += contractPeriodsList[contractPeriodsList.length - 1];
        endCalcDate = this.dateService.calculateEndDateForHijri(accumulatedPeriod, 1, this.firstDueDate, 1);
      }

      this.salesBuyContractDues.push({
        contractId: 0,
        dueAmount: lastPaymentAmount,
        dueStartDate: (startCalcDate.month + 1) + "/" + startCalcDate.day + "/" + startCalcDate.year,
        dueEndDate: (endCalcDate.month + 1) + "/" + endCalcDate.day + "/" + endCalcDate.year,
        id: 0,
        isEntryGenerated: false,
        isInvoiced: false,
        notes: "",
        paid: 0,
        unitId: 0,
        typeId: SalesBuyContractDuesEnum.finalPayment,
        dueName: "",
        goundId: 0

      })
    }

  }

  // listenToClickedButton() {
  //   let sub = this.sharedServices.getClickedbutton().subscribe({
  //     next: (currentBtn: ToolbarData) => {
  //       if (currentBtn != null) {
  //         if (currentBtn.action == ToolbarActions.List) {
  //           this.setToolbarComponentData()
  //           this.router.navigate([this.listUrl], {
  //             queryParams: {
  //               "settingId": this.settingId,
  //               "typeId": this.typeId
  //             }
  //           });
  //         } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
  //           this.onSave();
  //         } else if (currentBtn.action == ToolbarActions.New) {
  //           this.setToolbarComponentData();
  //           this.router.navigate([this.addUrl], {
  //             queryParams: {
  //               "settingId": this.settingId,
  //               "typeId": this.typeId
  //             }
  //           });
  //           this.sharedServices.changeToolbarPath(this.toolbarPathData);
  //         } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
  //           this.onUpdate();
  //         }
  //         else if (currentBtn.action == ToolbarActions.Issue && currentBtn.submitMode) {
  //           this.ContractIssued();
  //         }
  //       }
  //     },
  //   });
  //   this.subsList.push(sub);
  // }

  listenToClickedButton() {
     

    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
         
        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate(['/control-panel/definitions/contracts-list'], { queryParams: { settingId: this.settingId } });
          } else if (currentBtn.action == ToolbarActions.Save && currentBtn.submitMode) {
             

            this.onSave();
          } else if (currentBtn.action == ToolbarActions.New) {

            this.toolbarPathData.componentAdd = "component-names.add-contracts";
            this.sharedServices.changeToolbarPath(this.toolbarPathData);
            //this.ownerForm.reset();
            this.router.navigate(['/control-panel/definitions/add-contract'], { queryParams: { settingId: this.settingId } });
          } else if (currentBtn.action == ToolbarActions.Update && currentBtn.submitMode) {
            this.onUpdate();
          }
          else if (currentBtn.action == ToolbarActions.Issue && currentBtn.submitMode) {
            this.onIssueContract();
          }
        }
      },
    });
    this.subsList.push(sub);
  }

  onIssueContract() {
    return new Promise<void>((resolve, reject) => {
      console.log("Contract Data", this.contractForm.value);
      let sub = this.salesBuyContractService.getWithResponse<Contract>("Issue?id=" + this.id).subscribe({
        next: (result: ResponseResult<Contract>) => {
          resolve();
          if (result.success) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.issue-success")
            );
            this.router.navigate(['/control-panel/definitions/contracts-list'], { queryParams: { settingid: this.settingId } });
          }
          else {
            if (result.status == 2) {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.issue-before")
              );
            }
            else {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.issue-failed")
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
  // setToolbarComponentData() {
  //   let contractEnName = localStorage.getItem("contractEnName")!;
  //   let contractArName = localStorage.getItem("contractArName")!;
  //   this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'اضافة' + ' ' + contractArName : 'Add' + ' ' + contractEnName
  //   this.toolbarPathData.componentList = this.lang == 'ar' ? contractArName : contractEnName
  //   this.contractData = this.lang == 'ar' ? 'بيانات' + ' ' + contractArName : contractEnName + ' ' + 'data'
  //   this.sharedServices.changeToolbarPath(this.toolbarPathData);

  // }

  setToolbarComponentData() {

    this.contractData = this.lang == "ar" ? (this.contractSetting?.contractArName ?? "") : (this.contractSetting?.contractEnName ?? "");
    this.toolbarPathData.componentAdd = this.lang == 'ar' ? 'تحديث' + ' ' + this.contractData : 'Update' + ' ' + this.contractData
    this.toolbarPathData.componentList = this.contractData
    this.contractData = this.lang == 'ar' ? 'بيانات' + ' ' + this.contractData : this.contractData + ' ' + 'data';
    this.sharedServices.changeToolbarPath(this.toolbarPathData);

  }


  // ContractIssued() {
  //    
  //   if (

  //     this.contract.purchaserAccountId == null ||
  //     this.contract.purchaserAccountId == undefined
  //   ) {
  //     this.errorMessage = this.translate.transform(
  //       'contract.purchaser-account-required'
  //     );
  //     this.errorClass = this.translate.transform('general.error-message');
  //     this.AlertsService.showError(
  //       this.errorMessage,
  //       this.translate.transform('general.error')
  //     );
  //     return;
  //   }
  //   if (
  //     this.contract.ownerAccountId == '' ||
  //     this.contract.ownerAccountId == null ||
  //     this.contract.ownerAccountId == undefined
  //   ) {
  //     this.errorMessage = this.translate.transform(
  //       'contract.seller-account-required'
  //     );
  //     this.errorClass = this.translate.transform('general.error-message');
  //     this.AlertsService.showError(
  //       this.errorMessage,
  //       this.translate.transform('general.error')
  //     );
  //     return;
  //   }
  //   if (

  //     this.contract.deferredRevenueAccountId == null ||
  //     this.contract.deferredRevenueAccountId == undefined
  //   ) {
  //     this.errorMessage = this.translate.transform(
  //       'general.deferred-revenue-account-required'
  //     );
  //     this.errorClass = this.translate.transform('general.error-message');
  //     this.AlertsService.showError(
  //       this.errorMessage,
  //       this.translate.transform('general.error')
  //     );
  //     return;
  //   }
  //   if (
  //     this.contract.accuredRevenueAccountId == null ||
  //     this.contract.accuredRevenueAccountId == undefined
  //   ) {
  //     this.errorMessage = this.translate.transform(
  //       'general.accured-revenue-account-required'
  //     );
  //     this.errorClass = this.translate.transform('general.error-message');
  //     this.AlertsService.showError(
  //       this.errorMessage,
  //       this.translate.transform('general.error')
  //     );
  //     return;
  //   }

  //   // if (this.isGenerateEntryWithCreateContract != true || (this.isGenerateEntryByDue != true && this.isGenerateEntryWithCreateContract != true)) {
  //   //   this.errorMessage = this.translate.transform(
  //   //     'contract.for-issue-choose-generate-entry'
  //   //   );
  //   //   this.errorClass = this.translate.transform('general.error-message');
  //   //   this.AlertsService.showError(
  //   //     this.errorMessage,
  //   //     this.translate.transform('general.error')
  //   //   );
  //   //   return;
  //   // }


  //   this.salesBuyContractService
  //     .generateEntry(this.contractForm.value.id)
  //     .subscribe({
  //       next: (res) => {
  //         if (res != null) {
  //         }
  //       },
  //     });



  //   this.salesBuyContractService
  //     .addWithUrl(
  //       "updateContractStatus",
  //       this.contractForm.value.id
  //     ).subscribe({
  //       next: (res) => {
  //          
  //         this.showResponseMessage(
  //           true, AlertTypes.issue,
  //           this.translate.transform('general.issued-successfully')
  //         ); this.router.navigate([this.listUrl], {
  //           queryParams: {
  //             "settingId": this.settingId,
  //             "typeId": this.typeId
  //           }
  //         });

  //       },
  //       error: (err) => {
  //         // this.spinner.hide();
  //       },
  //       complete: () => { }
  //     });

  // }
  onSave() {
    checkRequiredFormFields(this.contractForm);

    if (this.contractForm.valid) {
      this.contractForm.controls['contractDate'].setValue(this.dateService.getDateForInsert(this.contractDate));
      this.contractForm.controls['firstDueDate'].setValue(this.dateService.getDateForInsert(this.firstDueDate));
      this.contractForm.controls["salesBuyContractsUnits"].setValue([...this.selectedSalesBuyContractUnits]);
      
      this.contractForm.controls["salesBuyContractsDues"].setValue([...this.salesBuyContractDues]);

      //this.sharedServices.changeButtonStatus({ button: 'Save', disabled: true })
      //this.setInputData();
      this.spinner.show();
      this.confirmSave().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    }
    else {
      this.sharedServices.changeButtonStatus({ button: 'Save', disabled: false })
      this.errorMessage = this.translate.transform('messages.invalid-data');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return this.contractForm.markAllAsTouched();
    }

  }


  confirmSave() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.salesBuyContractService.addWithResponse<Contract>("AddWithCheck?uniques=Code", this.contractForm.value).subscribe({
        next: (result: ResponseResult<Contract>) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            this.router.navigate(['/control-panel/definitions/contracts-list'], { queryParams: { settingid: this.settingId } });
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
    if (this.contractForm.valid) {
     

      this.salesBuyContractDues.forEach(d => {
        d.id = 0;
      });

      this.contractForm.controls['contractDate'].setValue(this.dateService.getDateForInsert(this.contractDate));
      this.contractForm.controls['firstDueDate'].setValue(this.dateService.getDateForInsert(this.firstDueDate));
      this.contractForm.controls["salesBuyContractsUnits"].setValue([...this.selectedSalesBuyContractUnits]);
      
      this.contractForm.controls["salesBuyContractsDues"].setValue([...this.salesBuyContractDues]);

      this.spinner.show();
      this.confirmUpdate().then(a => {
        this.spinner.hide();
      }).catch(e => {
        this.spinner.hide();
      });
    }
    else {
      this.errorMessage = this.translate.transform('messages.invalid-data');
      this.errorClass = this.translate.transform('general.error-message');
      this.AlertsService.showError(this.errorMessage, this.translate.transform('general.error'))
      return this.contractForm.markAllAsTouched();
    }
  }

  confirmUpdate() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.salesBuyContractService.updateWithUrl("UpdateWithCheck?uniques=Code", this.contractForm.value).subscribe({
        next: (result: ResponseResult<Contract>) => {
          resolve();
          if (result.success && !result.isFound) {
            this.showResponseMessage(
              result.success, AlertTypes.success, this.translate.transform("messages.add-success")
            );
            this.router.navigate(['/control-panel/definitions/contracts-list'], { queryParams: { settingid: this.settingId } });
          } else if (result.isFound) {
            this.showResponseMessage(
              result.success,
              AlertTypes.warning,
              this.translate.transform("messages.record-exsiting")
            );
          }
          else {
            if (result.status == 2) {
              this.showResponseMessage(
                result.success,
                AlertTypes.error,
                this.translate.transform("messages.can-not-update")
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
  setDecimalNumber(number: any) {
    return this.systemSettingsService.setDecimalNumber(number);
  }
  onDateTypeChange() {
    //((this.contractForm.controls['calendarType'].value);
    this.dateType = this.contractForm.controls['calendarType'].value;
  }

  // onContractUnitChange(contractUnits: SalesBuyContractUnit[]) {
  //   //((contractUnits);
  //   this.contractUnit = JSON.parse(JSON.stringify(contractUnits));
  //   this.totalArea = 0;
  //   this.totalBeforeTax = 0;
  //   this.totalWithTax = 0;
  //   this.totalTaxes = 0;

  //   contractUnits.forEach(u => {
  //     this.totalArea +=

  //       Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number.parseFloat((u.area ?? 0).toString())).toFixed(this.numberOfFraction)
  //         : Number.parseFloat((u.area ?? 0).toString()))
  //     this.totalBeforeTax +=
  //       Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number.parseFloat((u.total ?? 0).toString())).toFixed(this.numberOfFraction)
  //         : Number.parseFloat((u.total ?? 0).toString()))

  //     this.totalTaxes +=

  //       Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number.parseFloat((u.taxValue ?? 0).toString())).toFixed(this.numberOfFraction)
  //         : Number.parseFloat((u.taxValue ?? 0).toString()))
  //     this.totalWithTax +=
  //       Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (Number.parseFloat((u.totalWithTax ?? 0).toString())).toFixed(this.numberOfFraction)
  //         : Number.parseFloat((u.totalWithTax ?? 0).toString()))
  //   });

  //   this.averagePriceOfMeter =
  //     Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalBeforeTax / this.totalArea).toFixed(this.numberOfFraction)
  //       : this.totalBeforeTax / this.totalArea);
  //   this.contract.totalArea =
  //     Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.totalArea).toFixed(this.numberOfFraction)
  //       : this.totalArea);



  // }
  getFirstDueDateDate(e: DateModel) {
    this.firstDueDate = e;
    this.onCahngeFirstOrLastPayment();
  }

  // setInputData() {
  //   this.contract.id = this.contractForm.controls["id"].value;
  //   this.contract.salesBuyContractsUnits = this.contractUnit;
  //   this.contract.ownerId = this.contractForm.controls["ownerId"].value;
  //   //this.contract.purchaserId = this.contractForm.controls["purchaserId"].value;
  //   this.contract.buildingId = this.contractForm.controls["buildingId"].value;
  //   this.contract.calendarType = this.contractForm.controls["calendarType"].value;
  //   this.contract.totalTaxes = this.contractForm.controls["totalTaxes"].value;
  //   this.contract.realestateId = this.contractForm.controls["realestateId"].value ?? '';

  //   //  this.contract.contractDate = this.dateService.getDateForInsert(this.contractForm.controls["contractDate"].value);
  //   //  this.contract.startContractDate = this.dateService.getDateForInsert(this.contractForm.controls["startContractDate"].value);
  //   //  this.contract.endContractDate = this.dateService.getDateForInsert(this.contractForm.controls["endContractDate"].value);

  //   this.contract.contractDate = this.dateService.getDateForInsert(this.contractDate);
  //   // this.contract.startContractDate = this.dateService.getDateForInsert(this.startContractDate);
  //   // this.contract.endContractDate = this.dateService.getDateForInsert(this.endContractDate);

  //   this.contract.contractSettingId = this.settingId;
  //   this.contract.salesBuyContractsDues = this.salesBuyContractDues;
  //   //this.contract.averagePriceOfMeter = this.averagePriceOfMeter;
  //   //this.contract.firstPaymentAmount = this.firstPaymentAmount;
  //   this.contract.firstDueDate = this.dateService.getDateForInsert(this.firstDueDate);
  //   //this.contract.lastPaymentAmount = this.lastPaymentAmount;
  //   //this.contract.paymentPerTime = this.paymentPerTime;
  //   //this.contract.numberOfPayments = this.numberOfPayments;
  //   //this.contract.periodBetweenAmountPerMonth = this.periodBetweenAmountPerMonth;
  //   this.contract.totalWithTax = this.totalWithTax;
  //   this.contract.contractStatus = 0;
  //   this.contract.ownerAccountId = this.contractForm.controls["ownerAccountId"].value ?? '';
  //   //this.contract.purchaserAccountId = this.contractForm.controls["purchaserAccountId"].value ?? '';
  //   this.contract.taxAccountId = this.contractForm.controls["taxAccountId"].value ?? '';
  //   this.contract.deferredRevenueAccountId = this.contractForm.controls["deferredRevenueAccountId"].value ?? '';
  //   this.contract.accuredRevenueAccountId = this.contractForm.controls["accuredRevenueAccountId"].value ?? '';




  // }
  // setFormValue() {
  //   //this.filterByOwner(this.contract.ownerId);
  //   this.contractForm.setValue({
  //     id: this.contract.id,
  //     contractNumber: this.contract.contractNumber,
  //     period: '1',
  //     contractDate: this.dateService.getDateForCalender(
  //       this.contract.contractDate
  //     ),
  //     startContractDate: this.dateService.getDateForCalender(
  //       this.contract.startContractDate
  //     ),
  //     endContractDate: this.dateService.getDateForCalender(
  //       this.contract.endContractDate
  //     ),
  //     calendarType: this.contract.calendarType,
  //     paymentPerTime: this.contract.paymentPerTime,
  //     ownerId: this.contract.ownerId,
  //     purchaserId: this.contract.purchaserId,
  //     realestateId: this.contract.realestateId,
  //     buildingId: this.contract.buildingId,
  //     periodBetweenRemainAmount: '',
  //     purchaserAccountId: this.contract.purchaserAccountId,
  //     taxAccountId: this.contract.taxAccountId,
  //     ownerAccountId: this.contract.ownerAccountId,
  //     deferredRevenueAccountId: this.contract.deferredRevenueAccountId,
  //     accuredRevenueAccountId: this.contract.accuredRevenueAccountId,

  //     totalArea: this.contract.totalArea,
  //     totalTaxes: this.contract.totalTaxes,
  //     paidAmount: '',
  //     //this.contract.paidAmount,
  //     remainingAmount: '',
  //     // this.contract.remainingAmount,
  //     firstDueDate: this.dateService.getDateForCalender(
  //       this.contract.firstDueDate
  //     ),
  //     contractSettingId: this.contract.contractSettingId,

  //   });
  //   this.contractDate = this.dateService.getDateForCalender(
  //     this.contract.contractDate
  //   );
  //   this.startContractDate = this.dateService.getDateForCalender(
  //     this.contract.startContractDate
  //   );
  //   this.endContractDate = this.dateService.getDateForCalender(
  //     this.contract.endContractDate
  //   );
  //   this.firstDueDate = this.dateService.getDateForCalender(
  //     this.contract.firstDueDate
  //   );
  //   this.filterBuildings();
  //   this.totalArea = Number(this.contract.totalArea);
  //   this.averagePriceOfMeter = this.contract.averagePriceOfMeter;
  //   this.totalBeforeTax = Number(this.contract.totalArea) * Number(this.contract.averagePriceOfMeter);
  //   this.totalTaxes = Number(this.contract.totalWithTax) - this.totalBeforeTax;
  //   this.totalWithTax = Number(this.contract.totalWithTax);


  //   this.firstPaymentAmount = this.contract.firstPaymentAmount
  //   this.lastPaymentAmount = this.contract.lastPaymentAmount
  //   this.firstDueDate = this.dateService.getDateForCalender(
  //     this.contract.firstDueDate
  //   );
  //   this.periodBetweenAmountPerMonth = this.contract.periodBetweenAmountPerMonth
  //   this.paymentPerTime = Number(this.contract.paymentPerTime)
  //   this.numberOfPayments = Number(this.contract.numberOfPayments)




  // }


  getSystemSettings() {
    if (this.managerService.getSystemSettings()?.length) {
      this.systemSettings = this.managerService.getSystemSettings()[0];
    }
  }


  getNewCode() {
    return new Promise<string>((resolve, reject) => {
      let sub = this.salesBuyContractService.getWithResponse<NewCode[]>("GetNewCode?typeId=" + this.settingId).subscribe({
        next: (res) => {
          console.log("New Code", res);

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


  openUnitSearchDialog(i) {
    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedSearchSalesBuyContractUnit?.unitNameAr ?? '';
    } else {
      searchTxt = ''
      // this.selectedRentContractUnits[i].unitNameAr!;
    }

    let data = this.units.filter((x) => {
      return (
        (x.unitNameAr + ' ' + x.unitNameEn).toLowerCase().includes(searchTxt) ||
        (x.unitNameAr + ' ' + x.unitNameEn).toUpperCase().includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectedSearchSalesBuyContractUnit!.unitNameAr = data[0].unitNameAr;
        this.selectedSearchSalesBuyContractUnit!.unitId = data[0].id;
        this.selectedSearchSalesBuyContractUnit!.unitNameAr = data[0].unitNameAr;
        this.selectedSearchSalesBuyContractUnit!.areaSize = data[0].sellAreaSize;
        this.selectedSearchSalesBuyContractUnit!.pricePerMeter = data[0].sellMeterPrice;
        this.selectedSearchSalesBuyContractUnit!.taxRatio = data[0].taxRatio;
        this.calculateUnitTotals(this.selectedSearchSalesBuyContractUnit!);
      } else {
        this.selectedSalesBuyContractUnits[i].unitNameAr = data[0].unitNameAr;
        this.selectedSalesBuyContractUnits[i].unitId = data[0].id;
        this.selectedSalesBuyContractUnits[i].areaSize = data[0].sellAreaSize;
        this.selectedSalesBuyContractUnits[i].pricePerMeter = data[0].sellMeterPrice;
        this.selectedSalesBuyContractUnits[i].taxRatio = data[0].taxRatio;
        this.calculateUnitTotals(this.selectedSalesBuyContractUnits[i]);

      }

    } else {
      let lables = ['الكود', 'الاسم', 'الاسم الانجليزى'];
      let names = ['unitCode', 'unitNameAr', 'unitNameEn'];
      let title = 'بحث عن الوحدة';
      let sub = this.searchDialog
        .showDialog(lables, names, this.units, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {

              this.selectedSearchSalesBuyContractUnit!.unitNameAr = d.unitNameAr;
              this.selectedSearchSalesBuyContractUnit!.unitId = d.id;
              this.selectedSearchSalesBuyContractUnit!.unitNameAr = d.unitNameAr;
              this.selectedSearchSalesBuyContractUnit!.areaSize = d.sellAreaSize;
              this.selectedSearchSalesBuyContractUnit!.pricePerMeter = d.sellMeterPrice;
              this.selectedSearchSalesBuyContractUnit!.taxRatio = d.taxRatio;
              this.calculateUnitTotals(this.selectedSearchSalesBuyContractUnit!);


            } else {
              this.selectedSalesBuyContractUnits[i].unitNameAr = d.unitNameAr;
              this.selectedSalesBuyContractUnits[i].unitId = d.id;
              this.selectedSalesBuyContractUnits[i].unitNameAr = d.unitNameAr;
              this.selectedSalesBuyContractUnits[i].areaSize = d.sellAreaSize;
              this.selectedSalesBuyContractUnits[i].pricePerMeter = d.sellMeterPrice;

              this.selectedSalesBuyContractUnits[i].taxRatio = d.taxRatio;
              this.calculateUnitTotals(this.selectedSalesBuyContractUnits[i]);
            }
          }
        });
      this.subsList.push(sub);
    }

  }


  clearSelectedUnitData() {
    this.selectedSearchSalesBuyContractUnit = {
      id: 0,
      unitId: 0,
      areaSize: 0,
      pricePerMeter: 0,
      groundId: 0,
      taxRatio: 0,
      taxesAmount: 0,
      unitNameAr: '',
      unitNameEn: '',
      contractId: 0,
      notes: '',
      groundNameAr: '',
      groundNameEn: '',
      total: 0,
      totalWithTax: 0
    };
  }


  calculateUnitTotals(item: SalesBuyContractUnit) {
    if (item.areaSize != 0 && item.pricePerMeter != 0) {
      item.total = this.systemSettingsService.setDecimalNumberSetting(item.areaSize * item.pricePerMeter, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      item.taxesAmount = this.systemSettingsService.setDecimalNumberSetting((item.areaSize * item.pricePerMeter) * (item.taxRatio / 100), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
       
      item.totalWithTax = this.systemSettingsService.setDecimalNumberSetting(Number(item.total) + Number(item.taxesAmount), this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
    }
    else {
      item.total = 0;
      item.taxesAmount = 0;
    }
    this.calculateContractTotals();
  }


  calculateContractTotals() {

    if (this.selectedSalesBuyContractUnits.length) {
      let totalArea: number = this.selectedSalesBuyContractUnits.map(x => x.areaSize).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);
      let totalBeforTax: number = this.selectedSalesBuyContractUnits.map(x => x.total).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);

      let totalTaxes: number = this.selectedSalesBuyContractUnits.map(x => x.taxesAmount).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);

      let totalWithTaxes: number = this.selectedSalesBuyContractUnits.map(x => x.totalWithTax).reduce((a, c) => {
        return Number(a) + Number(c);
      }, 0);


      let meterPriceAverage = 0;
      if (totalBeforTax) {
        meterPriceAverage = Number(totalBeforTax) / Number(totalArea);
      }

      this.totalWithTax = totalWithTaxes;

      this.contractForm.controls['totalArea'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalArea, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['averagePriceOfMeter'].setValue(this.systemSettingsService.setDecimalNumberSetting(meterPriceAverage, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['totalTaxes'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalTaxes, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));

      this.contractForm.controls['totalBeforeTax'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalBeforTax, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));
      this.contractForm.controls['totalWithTax'].setValue(this.systemSettingsService.setDecimalNumberSetting(totalWithTaxes, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction));

    } else {
      this.contractForm.controls['totalArea'].setValue(0);
      this.contractForm.controls['averagePriceOfMeter'].setValue(0);
      this.contractForm.controls['totalTaxes'].setValue(0);
      this.contractForm.controls['totalBeforeTax'].setValue(0);
      this.contractForm.controls['totalWithTax'].setValue(0);
    }

  }

  onChangeTotal(item: SalesBuyContractUnit) {
    if (item.areaSize) {
      item.pricePerMeter = this.systemSettingsService.setDecimalNumberSetting(item.total / item.areaSize, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
      this.calculateUnitTotals(item);
    }
    this.calculateContractTotals();
  }

  onChangeTaxRatio(item: SalesBuyContractUnit) {

    if (item.total) {
      item.taxesAmount = this.systemSettingsService.setDecimalNumberSetting(item.taxRatio * item.total / 100, this.systemSettings.showDecimalPoint, this.systemSettings.numberOfFraction);
    }
    this.calculateContractTotals();
  }


  showConfirmDeleteUnitAddedMessage(item) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.message = this.translate.transform("rent-contracts.confirm-delete-unit");
    modalRef.componentInstance.title = this.translate.transform("messages.delete");
    modalRef.componentInstance.isYesNo = true;
    modalRef.result.then(rs => {
      if (rs == "Confirm") {
        this.deleteContractUnit(item);

      }
    })



  }

  deleteContractUnit(item: SalesBuyContractUnit) {
    if (item != null) {
      const index: number = this.selectedSalesBuyContractUnits.indexOf(item);
      if (index !== -1) {
        let unitId = this.selectedSalesBuyContractUnits[index].unitId;
        this.selectedSalesBuyContractUnits.splice(index, 1);


        this.calculateContractTotals();

      }
    }
  }

  addContractUnit() {
    if (this.selectedSearchSalesBuyContractUnit.unitId) {
      if (this.selectedSalesBuyContractUnits.find(x => x.unitId == this.selectedSearchSalesBuyContractUnit.unitId)) {
        this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.selectedUnitExist"));
        return;
      }
      this.selectedSalesBuyContractUnits.push({ ...this.selectedSearchSalesBuyContractUnit });

      this.selectedSearchSalesBuyContractUnit = new SalesBuyContractUnit();
    } else {
      this.showResponseMessage(false, AlertTypes.error, this.translate.transform("messages.selectUnit"));
    }
    this.calculateContractTotals();
    this.calculateContractDues();
  }


  clearSelectedUnit() {
    this.selectedSearchSalesBuyContractUnit = new SalesBuyContractUnit();
  }

  // oppsiteAccounts:Accounts[]=[];
  // ownerDeferredRevenueAccounts:Accounts[]=[];
  // ownerAccurredRevenueAccounts:Accounts[]=[];
  // taxAccounts:Accounts[]=[];


  // getAccounts() {
  //   this.oppsiteAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tenant);
  //   this.ownerAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Owner);
  //   this.ownerDeferredRevenueAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Deferred Revenue']);
  //   this.ownerAccurredRevenueAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType['Accured Revenue']);
  //   this.taxAccounts = this.managerService.getAccounts().filter(x => x.accountType == accountType.Tax);
  // }


  setDynamicValidation(controlName: string, isRequired: boolean) {
    let control = this.contractForm.get(controlName);
    if(control){
      if (isRequired) {
        control?.setValidators(Validators.compose([Validators.required]));
      }
      else {
        control?.clearValidators();
        control?.updateValueAndValidity();
      }
    }
  }

}
