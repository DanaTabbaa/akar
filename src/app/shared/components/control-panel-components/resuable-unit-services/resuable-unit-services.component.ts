import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { UnitServices } from 'src/app/core/models/unit-services';
import { Unit } from 'src/app/core/models/units';
import { ContractUnitsServicesAccountsEnum, convertEnumToArray, PaymentsMethodsInRentContractEnum, pursposeTypeEnum,pursposeTypeArEnum, PaymentsMethodsInRentContractArEnum, ContractUnitsServicesAccountsArEnum } from 'src/app/core/constants/enumrators/enums';
import { ICustomEnum } from 'src/app/core/interfaces/ICustom-enum';
import { SelectedUnit } from 'src/app/core/models/offer-unit-details';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { OfferUnitServiceDetails } from 'src/app/core/models/offers-units-details';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-resuable-unit-services',
  templateUrl: './resuable-unit-services.component.html',
  styleUrls: ['./resuable-unit-services.component.scss']
})
export class ResuableUnitServicesComponent implements OnInit {
  //#region reusable variables
  @Input('selecedUnit') selecedUnit: SelectedUnit = new SelectedUnit();
  @Input('ownerId') ownerId;
  //#endregion

  //#region Main Declarations
  lang: string = '';
  UnitsServiceForm!: FormGroup;
  unitServices: UnitServices[] = [];
  units: Unit[] = [];
  paymentsMethods: ICustomEnum[] = [];
  fromServiceAccount: ICustomEnum[] = [];
  toServiceAccount: ICustomEnum[] = [];
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number
  totalAmountOfService: number = 0;
  totalServiceTaxes: number = 0;
  contractValueTotal: number = 0;
  paidAmount: number = 0;
  remainingAmount: number = 0;
  calculateMethods: ICustomEnum[] = [];
  selectedUnitServiceDetails: OfferUnitServiceDetails[] = [];
  selectedUnitServices: OfferUnitServiceDetails[] = [];

  //#endregion main variables declarationss

  //#region Constructor
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private unitServicesService: UnitsService,
    private UnitsService: UnitsService,
    private SystemSettingsService: SystemSettingsService,
    private SharedServices: SharedService,

  ) {
    this.createUnitServicesForm();
    this.selecedUnit = new SelectedUnit();
  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getLanguage();
  }

  //#endregion
  getLanguage()
  {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }   
  //#region ngOnDestroy

  //#endregion

  //#region Authentications
  //
  //
  //#endregion

  //#region Manage State
  //#endregion

  //#region Permissions
  //
  //#endregion

  //#region Basic Data
  loadData() {
    this.getUnitservices();
    this.getUnits()
  }
  createUnitServicesForm() {
    this.UnitsServiceForm = this.fb.group({
      id: 0,
      unitId: '',
      serviceId: '',
      payOnTimeId: '',
      calcMethodType: '',
      countofservice: '',
      ratio: '',
      amount: '',
      totalTaxes: '',
      amountWithTax: '',
      fromAccount: '',
      toAccount: ''

    })
  }

  getUnitservices() {

    return  new Promise<void>((resolve, reject) => {
      this.unitServicesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.unitServices = res.data.map((res: UnitServices[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.UnitsService", this.unitServices);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });



  }

  getUnits(buildingId?: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.UnitsService.getAll("GetAll").subscribe({
        next: (res: any) => {

          if (buildingId != null && buildingId != '') {

            this.units = res.data.filter(x => x.buildingId == buildingId
               && 
               (x.purposeType ==  pursposeTypeEnum['For Rent']
               || x.purposeType== pursposeTypeEnum['For Sell and Rent'])).map((res: Unit[]) => {
              return res
            });
          } else {
            this.units = res.data.map((res: Unit[]) => {
              return res
            });
          }

          resolve();
          //(("res", res);
          //((" this.units", this.units);
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
  //getPaymentsMethods
  getPaymentsMethodsInRentContract() {
    if(this.lang=='en')
    {
    this.paymentsMethods = convertEnumToArray(PaymentsMethodsInRentContractEnum);
    }
    else
    {
      this.paymentsMethods = convertEnumToArray(PaymentsMethodsInRentContractArEnum);

    }
  }
  //getContractUnitsServicesAccountsEnum
  getContractUnitsServicesAccountsEnum() {
    if(this.lang=='en')
    {
    this.fromServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsEnum);
    this.toServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsEnum);
    }
    else
    {
      this.fromServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsArEnum);
      this.toServiceAccount = convertEnumToArray(ContractUnitsServicesAccountsArEnum);
    }

  }

  //#endregion

  //#region CRUD Operations
  addUnitsServices() {
    var unit: any = ''
    var calcMethodTypeName: any = ''
    var unitService: any = ''
    var payOnTimeName: any = ''
    var fromAccount: any = ''
    var toAccount: any = ''
    if (this.UnitsServiceForm.value.unitId != '') {
      unit = this.units.filter(x => x.id = this.UnitsServiceForm.value.unitId)
    }
    if (this.UnitsServiceForm.value.serviceId != '') {
      unitService = this.unitServices.filter(x => x.id = this.UnitsServiceForm.value.serviceId)
    }
    if (this.UnitsServiceForm.value.payOnTimeId != '') {
      payOnTimeName = this.paymentsMethods.filter(x => x.id = this.UnitsServiceForm.value.payOnTimeId)
    }
    if (this.UnitsServiceForm.value.calcMethodType != '') {
      calcMethodTypeName = this.calculateMethods.filter(x => x.id = this.UnitsServiceForm.value.calcMethodType)
    }
    if (this.UnitsServiceForm.value.fromAccount != '') {
      fromAccount = this.fromServiceAccount.filter(x => x.id = this.UnitsServiceForm.value.fromAccount)
    }
    if (this.UnitsServiceForm.value.toAccount != '') {
      toAccount = this.toServiceAccount.filter(x => x.id = this.UnitsServiceForm.value.toAccount)
    }
    this.selectedUnitServiceDetails.push(
      {
        id: 0,
        masterOfferId: 0,
        serviceId: this.UnitsServiceForm.value.serviceId != '' ? this.UnitsServiceForm.value.serviceId : '',
        calculationMethod: this.UnitsServiceForm.value.calcMethodType != '' ? this.UnitsServiceForm.value.calcMethodType : '',
        calcMethodTypeName: this.UnitsServiceForm.value.calcMethodType != '' ? calcMethodTypeName[0].name! : '',
        serviceRatio: this.UnitsServiceForm.value.ratio,
        paymentMethod: this.UnitsServiceForm.value.payOnTimeId != '' ? this.UnitsServiceForm.value.payOnTimeId : '',
        payOnTimeName: this.UnitsServiceForm.value.payOnTimeId != '' ? payOnTimeName[0].name! : '',
        serviceAmount: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.UnitsServiceForm.value.amount).toFixed(this.numberOfFraction)
          : this.UnitsServiceForm.value.amount,
        fromAccount: this.UnitsServiceForm.value.fromAccount != '' ? this.UnitsServiceForm.value.fromAccount : '',
        fromAccountName: '',
        toAccount: this.UnitsServiceForm.value.toAccount != '' ? this.UnitsServiceForm.value.toAccount : '',
        toAccountName: '',
        serviceTax: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.UnitsServiceForm.value.totalTaxes).toFixed(this.numberOfFraction)
          : this.UnitsServiceForm.value.totalTaxes,
        amountAfterTax: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.UnitsServiceForm.value.amountWithTax).toFixed(this.numberOfFraction)
          : this.UnitsServiceForm.value.amountWithTax,
        unitId: this.UnitsServiceForm.value.unitId != '' ? this.UnitsServiceForm.value.unitId : '',
        unitNameAr: this.UnitsServiceForm.value.unitId != '' ? unit[0].unitNameAr : '',
        unitNameEn: this.UnitsServiceForm.value.unitId != '' ? unit[0].unitNameEn : '',
        annualIncreaseRate: 10,
        numberOfServices: this.UnitsServiceForm.value.countOfService,
        unitServiceNameAr: this.UnitsServiceForm.value.serviceId != '' ? unitService[0].unitServiceArName : '',
        unitServiceNameEn: this.UnitsServiceForm.value.serviceId != '' ? unitService[0].unitServiceEnName : ''
      }
    )




    this.createUnitServicesForm();


  }



  deletetUnitService(serviceId: any) {
    ;
    if (serviceId != null) {

      this.selectedUnitServiceDetails.forEach((_unitId, index) => {
        this.selectedUnitServiceDetails.splice(index, 1);
      });
    }
  }


  //#endregion

  //#region Operations Functions

  //changeCalcMethodsInRentContract
  changeCalcMethods(calcMethodId: any) {

    if (calcMethodId == 1) {


      this.UnitsServiceForm.controls['ratio'].enable();
      var amount: any = ''
      if (this.UnitsServiceForm.value.payOnTimeId == PaymentsMethodsInRentContractEnum['Amounts Pay In Month']) {
        amount = (this.selecedUnit.annualRent != null ? this.selecedUnit.annualRent : 1) * this.UnitsServiceForm.value.ratio / 1200
      }
      if (this.UnitsServiceForm.value.payOnTimeId == PaymentsMethodsInRentContractEnum.Quarterly) {
        amount = ((this.selecedUnit?.annualRent != null ? this.selecedUnit.annualRent : 1) * this.UnitsServiceForm.value.ratio) / 400
      }
      if (this.UnitsServiceForm.value.payOnTimeId == PaymentsMethodsInRentContractEnum['Mid Term']) {
        amount = ((this.selecedUnit?.annualRent != null ? this.selecedUnit.annualRent : 1) * this.UnitsServiceForm.value.ratio) / 200
      }
      if (this.UnitsServiceForm.value.payOnTimeId == PaymentsMethodsInRentContractEnum['Amounts Pay In Year']) {
        amount = ((this.selecedUnit?.annualRent != null ? this.selecedUnit.annualRent : 1) * this.UnitsServiceForm.value.ratio) / 100
      }
      if (this.UnitsServiceForm.value.payOnTimeId == PaymentsMethodsInRentContractEnum['Amounts Pay For Once Time']) {
        amount = ((this.selecedUnit?.annualRent != null ? this.selecedUnit.annualRent : 1) * this.UnitsServiceForm.value.ratio) / 100
      }

      this.UnitsServiceForm = this.fb.group({
        unitId: this.UnitsServiceForm.value.unitId,
        serviceId: this.UnitsServiceForm.value.serviceId,
        payOnTimeId: this.UnitsServiceForm.value.payOnTimeId,
        calcMethodType: this.UnitsServiceForm.value.calcMethodType,
        countofservice: { value: this.UnitsServiceForm.value.countofservice, disabled: true },
        ratio: this.UnitsServiceForm.value.ratio,
        amount: { value: (amount), disabled: true },
        totalTaxes: this.UnitsServiceForm.value.totalTaxes,
        amountWithTax: (amount) + ((amount) * this.UnitsServiceForm.value.totalTaxes / 100),
        fromAccount: this.UnitsServiceForm.value.fromAccount,
        toAccount: this.UnitsServiceForm.value.toAccount
      })

    }
    if (calcMethodId == 2) {
      this.UnitsServiceForm.controls['amount'].enable();
      var amount = this.UnitsServiceForm.value.amount
      this.UnitsServiceForm = this.fb.group({

        unitId: this.UnitsServiceForm.value.unitId,
        serviceId: this.UnitsServiceForm.value.serviceId,
        payOnTimeId: this.UnitsServiceForm.value.payOnTimeId,
        calcMethodType: this.UnitsServiceForm.value.calcMethodType,
        countofservice: { value: this.UnitsServiceForm.value.countofservice, disabled: true },
        ratio: { value: '', disabled: true },
        amount: amount,
        totalTaxes: this.UnitsServiceForm.value.totalTaxes,
        amountWithTax: (amount) + ((amount) * this.UnitsServiceForm.value.totalTaxes / 100),
        fromAccount: this.UnitsServiceForm.value.fromAccount,
        toAccount: this.UnitsServiceForm.value.toAccount

      })

    }
    if (calcMethodId == 3) {
      this.UnitsServiceForm.controls['countofservice'].enable();
      this.UnitsServiceForm.controls['amount'].enable();
      var amount = this.UnitsServiceForm.value.amount
      this.UnitsServiceForm = this.fb.group({

        unitId: this.UnitsServiceForm.value.unitId,
        serviceId: this.UnitsServiceForm.value.serviceId,
        payOnTimeId: this.UnitsServiceForm.value.payOnTimeId,
        calcMethodType: this.UnitsServiceForm.value.calcMethodType,
        countofservice: this.UnitsServiceForm.value.countofservice,
        ratio: { value: '', disabled: true },
        amount: amount,
        totalTaxes: this.UnitsServiceForm.value.totalTaxes,
        amountWithTax: (amount) + ((amount) * this.UnitsServiceForm.value.totalTaxes / 100),
        fromAccount: this.UnitsServiceForm.value.fromAccount,
        toAccount: this.UnitsServiceForm.value.toAccount

      })
    }

    this.UnitsServiceForm.value.calcMethodId = 0


  }
  //#endregion


  //#region Helper Functions
  getSystemSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.SystemSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          //(("result data", res.data);
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
  //#endregion

}
