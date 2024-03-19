import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Unit } from '../../../../core/models/units';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseResult } from 'src/app/core/models/ResponseResult';
import { UserRegisterations } from 'src/app/core/models/user-registerations';
import { UnitsService } from 'src/app/core/services/backend-services/units.service';
import { pursposeTypeEnum, UnitStatusEnum } from 'src/app/core/constants/enumrators/enums';
import { SystemSettingsService } from 'src/app/core/services/backend-services/system-settings.service';
import { SelectedUnit } from '../../../../core/models/offer-unit-details';
import { UnitReusableTotals } from '../../../../core/view-models/unit-resuable-totals';
import { REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';
import { SearchDialogService } from 'src/app/shared/services/search-dialog.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-reusable-unit',
  templateUrl: './reusable-unit.component.html',
  styleUrls: ['./reusable-unit.component.scss']
})
export class ReusableUnitComponent implements OnInit {

  @Input('ownerId') ownerId
  @Input('purposeType') purposeType
  @Input('buildingId') buildingId
  @Input('selecedUnitsDetails') selecedUnitsDetails: SelectedUnit[];

 // @Output() onRentContractUnitChange: EventEmitter<SelectedUnit[]> =
   // new EventEmitter();
  @Output() onSelect: EventEmitter<Unit[]> = new EventEmitter();
  @Output() onSelecedtUnit: EventEmitter<SelectedUnit[]> = new EventEmitter();
  @Output() onSelectUnitCalculateTotals: EventEmitter<UnitReusableTotals> = new EventEmitter();
  //#region Main Declarations
  UnitForm!: FormGroup;
  units: Unit[] = [];
  selectedUnits: SelectedUnit[] = []
  showDecimalPoint!: boolean;
  showThousandsComma!: boolean;
  showRoundingFractions!: boolean;
  numberOfFraction!: number
  Response!: ResponseResult<UserRegisterations>;
  unitTotals!: UnitReusableTotals;
  unitObj!:SelectedUnit;

  rentContractUnits:SelectedUnit[]=[];
  selectedRentContractUnits:SelectedUnit = new SelectedUnit();
  subsList: Subscription[] = [];

  //#endregion main variables declarationss

  //#region Constructor
  constructor(
    private fb: FormBuilder,
    private UnitServices: UnitsService,
    private spinner:NgxSpinnerService,
    private searchDialog: SearchDialogService,
    private SystemSettingsService: SystemSettingsService) {
    this.UnitForm = this.fb.group({
      unitId: '',
      unitNameAr: '',
      unitNameEn: '',
      areaSize: '',
      pricePerMeter: '',
      annualRent: { value: '', disabled: true },
      monthlyRent: { value: '', disabled: true },
      insuranceRatio: '',
      inssuranceAmount: '',
      taxRatio: '',
      taxesAmount: '',
      // totalAmount: { value: '', disabled: true }
    }),
      this.selecedUnitsDetails = [];
    this.unitTotals = new UnitReusableTotals();
  }

  //#endregion

  //#region ngOnInit
  ngOnInit(): void {
    this.getSystemSettings();


  }
  //#endregion

  //#region ngOnDestroy
  ngOnDestroy() {

  }
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
  ///Geting form dropdown list data
  ngOnChanges() {
    this.getUnits();
  }
  getUnits()
  {
    const promise = new Promise<void>((resolve, reject) => {
      this.UnitServices.getAll("GetAll").subscribe({
        next: (res: any) => {

          if (this.ownerId != null || this.purposeType ==  pursposeTypeEnum['For Rent']) {
            this.units = res.data.filter(x => x.ownerId == this.ownerId && x.purposeType ==  pursposeTypeEnum['For Rent'] && x.unitStatus!=UnitStatusEnum['hasOffer']).map((res: Unit[]) => {
              return res
            });
          } else if (this.ownerId != null || this.purposeType ==  pursposeTypeEnum['For Sell']) {
            this.units = res.data.filter(x => x.ownerId == this.ownerId && x.purposeType ==  pursposeTypeEnum['For Sell']  && x.unitStatus!=UnitStatusEnum['hasOffer']).map((res: Unit[]) => {
              return res
            });

          }
          else if (this.ownerId != null || this.purposeType ==  pursposeTypeEnum['For Sell and Rent']) {
            this.units = res.data.filter(x => x.ownerId == this.ownerId && x.purposeType ==  pursposeTypeEnum['For Sell and Rent']  && x.unitStatus!=UnitStatusEnum['hasOffer']).map((res: Unit[]) => {
              return res
            });

          }
           else {
            this.units = res.data.filter(x=>x.unitStatus!=UnitStatusEnum['hasOffer']).map((res: Unit[]) => {
              return res
            });
          }
          this.onSelect.emit(this.units);

          resolve();

        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    this.selectedUnits = this.selecedUnitsDetails;
    return promise;
  }
  getSelectedUnits()
  {
    const promise = new Promise<void>((resolve, reject) => {
      this.UnitServices.getAll("GetAll").subscribe({
        next: (res: any) => {


            this.units = res.data.map((res: Unit[]) => {
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
    this.selectedUnits = this.selecedUnitsDetails;
    return promise;
  }
  createUnitForm()
  {
    this.UnitForm = this.fb.group({
      unitId: REQUIRED_VALIDATORS,
      unitNameAr: '',
      unitNameEn: '',
      areaSize: '',
      pricePerMeter: '',
      annualRent: '',
      monthlyRent: '',
      insuranceRatio: '',
      inssuranceAmount: '',
      taxRatio: '',
      taxesAmount: ''
    })
  }
  clearSelectedItemData()
  {
    this.selectedRentContractUnits={
      id:0,
      unitId:0,
      areaSize:0,
      meterPrice:0,
      annualRent:0,
      monthlyRent:0,
      insuranceRatio:0,
      inssuranceAmount:0,
      taxRatio:0,
      taxesAmount:0,
      unitNameAr:'',
      unitNameEn:''


    }
  }
  setInputData(unitId)
  {

    this.UnitForm.setValue({
      unitId: unitId,
      unitNameAr: this.unit.unitNameAr != null ? this.unit.unitNameAr : '',
      unitNameEn: this.unit.unitNameAr != null ? this.unit.unitNameEn : '',
      areaSize:
      this.unit.rentAreaSize != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentAreaSize).toFixed(this.numberOfFraction)
            : this.unit.rentAreaSize)):'',

      pricePerMeter:
      this.unit.rentMeterPrice != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentMeterPrice).toFixed(this.numberOfFraction)
            : this.unit.rentMeterPrice)):'',


      annualRent:
      this.unit.rentPrice != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentPrice).toFixed(this.numberOfFraction)
            : this.unit.rentPrice)):'',

      monthlyRent:

      this.unit.rentPrice != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentPrice/12).toFixed(this.numberOfFraction)
            : this.unit.rentPrice/12)):'',

      insuranceRatio:
      this.unit.insurranceRatio != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.insurranceRatio).toFixed(this.numberOfFraction)
      : this.unit.insurranceRatio)):'',

      inssuranceAmount:
      this.unit.insurranceAmount != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.insurranceAmount).toFixed(this.numberOfFraction)
      : this.unit.insurranceAmount)):'',

      taxRatio:
      this.unit.taxRatio != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.taxRatio).toFixed(this.numberOfFraction)
      : this.unit.taxRatio)):'',

      taxesAmount:
      this.unit.taxAmount != null ?
      (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.taxAmount).toFixed(this.numberOfFraction)
      : this.unit.taxAmount)):'',


    });

    this.selectedRentContractUnits.unitId = unitId;
    this.selectedRentContractUnits.unitNameAr = this.unit.unitNameAr;
    this.selectedRentContractUnits.unitNameEn = this.unit.unitNameEn;
    this.selectedRentContractUnits.areaSize =this.unit.rentAreaSize != null ?
    (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentAreaSize).toFixed(this.numberOfFraction)
          : this.unit.rentAreaSize)):'';
    this.selectedRentContractUnits.meterPrice =  this.unit.rentMeterPrice != null ?
    (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentMeterPrice).toFixed(this.numberOfFraction)
          : this.unit.rentMeterPrice)):'';
    this.selectedRentContractUnits.annualRent = this.unit.rentPrice != null ?
    (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentPrice).toFixed(this.numberOfFraction)
          : this.unit.rentPrice)):'';
    this.selectedRentContractUnits.monthlyRent = this.unit.rentPrice != null ?
    (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.unit.rentPrice/12).toFixed(this.numberOfFraction)
          : this.unit.rentPrice/12)):'';
    this.selectedRentContractUnits.insuranceRatio = this.unit.insurranceRatio;
    this.selectedRentContractUnits.inssuranceAmount =this.unit.insurranceAmount;
    this.selectedRentContractUnits.taxRatio = this.unit.taxRatio;
    this.selectedRentContractUnits.taxesAmount = this.unit.taxAmount;
    console.log("this.UnitForm:",this.UnitForm)
  }
  unit:Unit = new Unit();

  getUnitData(unitId: any) {

    const promise = new Promise<void>((resolve, reject) => {
      if (unitId != null) {
        this.UnitServices.getByIdWithUrl("GetById?id="+unitId).subscribe({
          next: (res: any) => {

            //this.createUnitForm();//delete
            this.unit=JSON.parse(JSON.stringify(res.data));
            this.setInputData(unitId);

            resolve();

          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      }
      else {
       // this.createUnitForm();//delete
      }
    });
    return promise;

  }
  getUnitDataForUpdate(unitId: any,i:any) {

    const promise = new Promise<void>((resolve, reject) => {
      if (unitId != null) {
        this.UnitServices.getByIdWithUrl("GetById?id="+unitId).subscribe({
          next: (res: any) => {

            //this.createUnitForm();//delete
            this.unit=JSON.parse(JSON.stringify(res.data));
            this.selectedUnits[i].unitId = unitId;
            this.selectedUnits[i].unitNameAr = res.data.unitNameAr;
            this.selectedUnits[i].unitNameEn = res.data.unitNameEn;
            this.selectedUnits[i].areaSize =
            res.data.rentAreaSize != null ?
             (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (res.data.rentAreaSize).toFixed(this.numberOfFraction)
          : res.data.rentAreaSize)):'';
            this.selectedUnits[i].meterPrice =
            res.data.rentMeterPrice != null ?
            (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (res.data.rentMeterPrice).toFixed(this.numberOfFraction)
         : res.data.rentMeterPrice)):'';
            this.selectedUnits[i].annualRent =
            this.unit.rentPrice != null ?
            (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (res.data.rentPrice).toFixed(this.numberOfFraction)
         : res.data.rentPrice)):'';
            this.selectedUnits[i].monthlyRent =
            this.unit.rentPrice != null ?
            (Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (res.data.rentPrice/12).toFixed(this.numberOfFraction)
         : res.data.rentPrice/12)):'';

            this.selectedUnits[i].insuranceRatio = res.data.insurranceRatio;
            this.selectedUnits[i].inssuranceAmount = res.data.insurranceAmount;
            this.selectedUnits[i].taxRatio = res.data.taxRatio;
            this.selectedUnits[i].taxesAmount = res.data.taxAmount;

            resolve();

          },
         error: (err: any) => {
            this.spinner.hide();
            reject(err);
          },
          complete: () => {

          },
        });
      }
      else {
       // this.createUnitForm();//delete
      }
    });
    return promise;

  }
  isRepeatedUnit:boolean=false;
  checkUnits(unitId)
  {
    let unit = this.selectedUnits.find(x=>x.unitId==unitId);
    if(unit??false)
    {
     this.isRepeatedUnit=true;
    }else{
      this.isRepeatedUnit=false;
    }
  }
  cancelEdit()
  {
    this.createUnitForm();
    this.isUpdate=false;

  }

  getUnitDetails() {

    if (this.UnitForm.value.areaSize != '' && this.UnitForm.value.pricePerMeter != '') {
      // this.UnitForm.setValue({
      //   unitId: this.UnitForm.value.unitId,
      //   unitNameAr: this.UnitForm.value.unitNameAr,
      //   unitNameEn: this.UnitForm.value.unitNameEn,
      //   areaSize: this.UnitForm.value.areaSize,
      //   pricePerMeter: this.UnitForm.value.pricePerMeter,
      //   annualRent: this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter,
      //   monthlyRent: (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter) / 12,
      //   insuranceRatio: this.UnitForm.value.insuranceRatio,
      //   inssuranceAmount: (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter) * (this.UnitForm.value.insuranceRatio / 100),
      //   taxRatio: this.UnitForm.value.taxRatio,
      //   taxesAmount: (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter) * (this.UnitForm.value.taxRatio / 100)
      // })


      this.selectedRentContractUnits.unitId = this.UnitForm.value.unitId;
        this.selectedRentContractUnits.unitNameAr = this.units.find(x => x.id == this.UnitForm.value.unitId)?.unitNameAr;
        this.selectedRentContractUnits.unitNameEn =this.units.find(x => x.id == this.UnitForm.value.unitId)?.unitNameEn;
        this.selectedRentContractUnits.areaSize =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? this.UnitForm.value.areaSize.toFixed(this.numberOfFraction)
            : this.UnitForm.value.areaSize),
        this.selectedRentContractUnits.meterPrice =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? this.UnitForm.value.pricePerMeter.toFixed(this.numberOfFraction)
        : this.UnitForm.value.pricePerMeter),
        this.selectedRentContractUnits.annualRent =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter).toFixed(this.numberOfFraction)
        :  this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter),

        this.selectedRentContractUnits.monthlyRent =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ((this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter)/12).toFixed(this.numberOfFraction)
        :  (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter)/12),
        this.selectedRentContractUnits.insuranceRatio =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? this.UnitForm.value.insuranceRatio.toFixed(this.numberOfFraction)
        :  this.UnitForm.value.insuranceRatio),
        this.selectedRentContractUnits.inssuranceAmount =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ((this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter) * (this.UnitForm.value.insuranceRatio / 100)).toFixed(this.numberOfFraction)
        :  (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter) * (this.UnitForm.value.insuranceRatio / 100)),

        this.selectedRentContractUnits.taxRatio =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? this.UnitForm.value.taxRatio.toFixed(this.numberOfFraction)
        :  this.UnitForm.value.taxRatio),

        this.selectedRentContractUnits.taxesAmount =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ( (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter) * (this.UnitForm.value.taxRatio / 100)).toFixed(this.numberOfFraction)
        :   (this.UnitForm.value.areaSize * this.UnitForm.value.pricePerMeter) * (this.UnitForm.value.taxRatio / 100))

    }
  }
  getAddedUnitDetails(item:SelectedUnit) {

    if (item.areaSize != '' && item.meterPrice != '') {

      item.unitId = item.unitId,
        item.unitNameAr = item.unitNameAr,
        item.unitNameEn = item.unitNameEn,
        item.areaSize =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (item.areaSize).toFixed(this.numberOfFraction)
        : item.areaSize),
        item.meterPrice =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (item.meterPrice).toFixed(this.numberOfFraction)
        : item.meterPrice),
        item.annualRent =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (item.areaSize * item.meterPrice).toFixed(this.numberOfFraction)
        : item.areaSize * item.meterPrice),

        item.monthlyRent =  Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ((item.areaSize * item.meterPrice)/12).toFixed(this.numberOfFraction)
        : (item.areaSize * item.meterPrice)/12),
        item.insuranceRatio =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (item.insuranceRatio).toFixed(this.numberOfFraction)
        : item.insuranceRatio),
        item.inssuranceAmount =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ((item.areaSize * item.meterPrice) * (item.insuranceRatio / 100)).toFixed(this.numberOfFraction)
        : (item.areaSize * item.meterPrice) * (item.insuranceRatio / 100)),
        item.taxRatio =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? (item.taxRatio).toFixed(this.numberOfFraction)
        : item.taxRatio),
        item.taxesAmount =
        Number(this.showDecimalPoint == true && this.numberOfFraction > 0 ? ((item.areaSize * item.meterPrice) * (item.taxRatio / 100)).toFixed(this.numberOfFraction)
        : (item.areaSize * item.meterPrice) * (item.taxRatio / 100))


    }
  }
  calculateUnitsTotals()
  {
    this.unitTotals.totalAreaSize = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
       (Number(this.unitTotals.totalAreaSize) + this.UnitForm.value.areaSize).toFixed(this.numberOfFraction)
    : Number(this.unitTotals.totalAreaSize) + this.UnitForm.value.areaSize
  this.unitTotals.averagePriceOfMeter = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
       (Number(this.unitTotals.averagePriceOfMeter) + this.UnitForm.value.pricePerMeter).toFixed(this.numberOfFraction)
    : Number(this.unitTotals.averagePriceOfMeter) + this.UnitForm.value.pricePerMeter
  this.unitTotals.totalRentAmount = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
       (Number(this.unitTotals.totalRentAmount) + this.UnitForm.value.annualRent).toFixed(this.numberOfFraction)
    : Number(this.unitTotals.totalRentAmount) + this.UnitForm.value.annualRent
  this.unitTotals.totalInsuranceAmount = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
       (Number(this.unitTotals.totalInsuranceAmount) + this.UnitForm.value.inssuranceAmount).toFixed(this.numberOfFraction)
    : Number(this.unitTotals.totalInsuranceAmount) + this.UnitForm.value.inssuranceAmount
  this.unitTotals.totalTaxes = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
       (Number(this.unitTotals.totalTaxes) + this.UnitForm.value.taxesAmount).toFixed(this.numberOfFraction)
    : Number(this.unitTotals.totalTaxes) + this.UnitForm.value.taxesAmount
  this.unitTotals.totalWithTaxesAndInsurrance = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
       (Number(this.unitTotals.totalWithTaxesAndInsurrance) + Number(this.UnitForm.value.annualRent) + Number(this.UnitForm.value.inssuranceAmount) + Number(this.UnitForm.value.taxesAmount)).toFixed(this.numberOfFraction) :
    Number(this.unitTotals.totalWithTaxesAndInsurrance) + Number(this.UnitForm.value.annualRent) + Number(this.UnitForm.value.inssuranceAmount) + this.UnitForm.value.taxesAmount
  this.unitTotals.totalRentAmount = Number(this.unitTotals.totalRentAmount);
  this.onSelectUnitCalculateTotals.emit(this.unitTotals)
  }

  isInvalidData:boolean=false;
  addUnitData() {

    if(this.UnitForm.valid){
    this.isInvalidData=false;
    this.UnitForm.controls['annualRent'].enable();
    this.UnitForm.controls['monthlyRent'].enable();

    this.selectedUnits.push(
      {
        id:0,
        unitId: this.selectedRentContractUnits.unitId,
        unitNameAr: this.selectedRentContractUnits.unitNameAr,
        unitNameEn: this.selectedRentContractUnits.unitNameEn,
        areaSize: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.selectedRentContractUnits.areaSize).toFixed(this.numberOfFraction) : this.selectedRentContractUnits.areaSize,
        meterPrice: this.selectedRentContractUnits.meterPrice,
        annualRent: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.selectedRentContractUnits.annualRent).toFixed(this.numberOfFraction) : this.selectedRentContractUnits.annualRent,
        monthlyRent: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.selectedRentContractUnits.monthlyRent).toFixed(this.numberOfFraction) : this.selectedRentContractUnits.monthlyRent,
        insuranceRatio: this.selectedRentContractUnits.insuranceRatio,
        inssuranceAmount: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.selectedRentContractUnits.inssuranceAmount).toFixed(this.numberOfFraction) : this.selectedRentContractUnits.inssuranceAmount,
        taxRatio: this.selectedRentContractUnits.taxRatio,
        taxesAmount: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (this.selectedRentContractUnits.taxesAmount).toFixed(this.numberOfFraction) : this.selectedRentContractUnits.taxesAmount,
      }
    )

    this.calculateUnitsTotals();
    this.onSelecedtUnit.emit(this.selectedUnits);
     
    this.createUnitForm();//
    this.clearSelectedItemData();
    }else{
      this.isInvalidData=true;
    }


  }

  addUnitDataForUpdate(item:SelectedUnit) {

   // if(this.UnitForm.valid){
    this.isInvalidData=false;
    this.UnitForm.controls['annualRent'].enable();
    this.UnitForm.controls['monthlyRent'].enable();

    this.selectedUnits.push(
      {
        id:0,
        unitId: item.unitId,
        unitNameAr: item.unitNameAr,
        unitNameEn: item.unitNameEn,
        areaSize: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (item.areaSize).toFixed(this.numberOfFraction) : item.areaSize,
        meterPrice: item.meterPrice,
        annualRent: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (item.annualRent).toFixed(this.numberOfFraction) : item.annualRent,
        monthlyRent: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (item.monthlyRent).toFixed(this.numberOfFraction) : item.monthlyRent,
        insuranceRatio: item.insuranceRatio,
        inssuranceAmount: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (item.inssuranceAmount).toFixed(this.numberOfFraction) : item.inssuranceAmount,
        taxRatio: item.taxRatio,
        taxesAmount: this.showDecimalPoint == true && this.numberOfFraction > 0 ?    (item.taxesAmount).toFixed(this.numberOfFraction) : item.taxesAmount,
      }
    )

    //this.calculateUnitsTotals();
    this.onSelecedtUnit.emit(this.selectedUnits);
    this.selectedUnits.forEach(item=>
      {
        this.unitTotals.totalAreaSize = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
           (Number(this.unitTotals.totalAreaSize) + item.areaSize).toFixed(this.numberOfFraction)
        : Number(this.unitTotals.totalAreaSize) + item.areaSize
      this.unitTotals.averagePriceOfMeter = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
           (Number(this.unitTotals.averagePriceOfMeter) + item.meterPrice).toFixed(this.numberOfFraction)
        : Number(this.unitTotals.averagePriceOfMeter) + item.meterPrice
      this.unitTotals.totalRentAmount = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
           (Number(this.unitTotals.totalRentAmount) + item.annualRent).toFixed(this.numberOfFraction)
        : Number(this.unitTotals.totalRentAmount) + item.annualRent
      this.unitTotals.totalInsuranceAmount = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
           (Number(this.unitTotals.totalInsuranceAmount) + item.inssuranceAmount).toFixed(this.numberOfFraction)
        : Number(this.unitTotals.totalInsuranceAmount) + item.inssuranceAmount
      this.unitTotals.totalTaxes = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
           (Number(this.unitTotals.totalTaxes) + item.taxesAmount).toFixed(this.numberOfFraction)
        : Number(this.unitTotals.totalTaxes) + item.taxesAmount
      this.unitTotals.totalWithTaxesAndInsurrance = this.showDecimalPoint == true && this.numberOfFraction > 0 ?
           (Number(this.unitTotals.totalWithTaxesAndInsurrance) + Number(item.annualRent) + Number(item.inssuranceAmount) + Number(item.taxesAmount)).toFixed(this.numberOfFraction) :
        Number(this.unitTotals.totalWithTaxesAndInsurrance) + Number(item.annualRent) + Number(item.inssuranceAmount) + item.taxesAmount
      this.unitTotals.totalRentAmount = Number(this.unitTotals.totalRentAmount);
      }
    )

  this.onSelectUnitCalculateTotals.emit(this.unitTotals)
    //this.createUnitForm();//delete
    this.clearSelectedItemData();
    // }else{
    //   this.isInvalidData=true;
    // }


  }

  updateUnitData(item: SelectedUnit) {

    if(this.selectedUnits.length>0)
    {
      this.deletetUnitForUpdate(item);
      //  let seletedUnitIndex = this.selectedUnits.findIndex(x=>x.unitId==item.unitId);
      //   this.selectedUnits.splice(seletedUnitIndex,1);
        this.addUnitDataForUpdate(item);
      //  this.isUpdate = false;//delete

    }



  }
  isAdd:boolean=false;
  isUpdate:boolean=false;
  editUnit(unitItem:SelectedUnit)
  {
  this.isUpdate = true

  let unit= this.selectedUnits.find(x=>x.id==unitItem.id);
  this.getSelectedUnits();
  this.UnitForm.setValue({
      unitId: unit?.unitId,
      unitNameAr: unit?.unitNameAr != null ? unit.unitNameAr : '',
      unitNameEn: unit?.unitNameAr != null ? unit.unitNameEn : '',
      areaSize:   unit?.areaSize != null ?   unit.areaSize : '',
      pricePerMeter: unit?.meterPrice != null ?unit.meterPrice : '',
      annualRent: unit?.annualRent != null ? unit.annualRent : '',
      monthlyRent:unit?.monthlyRent != null ? unit?.monthlyRent : '',
      insuranceRatio: unit?.insuranceRatio != null ? unit.insuranceRatio : '',
      inssuranceAmount: unit?.inssuranceAmount != null ?  unit?.inssuranceAmount  : '',
      taxRatio: unit?.taxRatio != null ? unit?.taxRatio : '',
      taxesAmount: unit?.taxesAmount != null ?  unit?.taxesAmount : '',

  });
  }



  //#endregion

  //#region CRUD Operations


  deletetUnit(item: SelectedUnit) {

    if (item != null) {
      const index: number = this.selectedUnits.indexOf(item);
      if (index !== -1) {
        this.selectedUnits.splice(index, 1);
        this.unitTotals.totalAreaSize = this.unitTotals.totalAreaSize - item.areaSize
        this.unitTotals.averagePriceOfMeter = this.unitTotals.averagePriceOfMeter - item.meterPrice
        this.unitTotals.totalRentAmount = this.unitTotals.totalRentAmount - item.annualRent;
       // this.getUnitById(item.unitId);

      }
      this.onSelectUnitCalculateTotals.emit(this.unitTotals);
      this.onSelecedtUnit.emit(this.selectedUnits);

    }
  }
  deletetUnitForUpdate(item: SelectedUnit) {

        if (item != null) {
          const index: number = this.selectedUnits.indexOf(item);
          if (index !== -1) {
            this.selectedUnits.splice(index, 1);
            this.unitTotals.totalAreaSize = 0
            this.unitTotals.averagePriceOfMeter = 0
            this.unitTotals.totalRentAmount = 0
           // this.getUnitById(item.unitId);

          }
          this.onSelectUnitCalculateTotals.emit(this.unitTotals);
          this.onSelecedtUnit.emit(this.selectedUnits);

        }
      }

  //#endregion

  //#region Helper Functions

  getUnitById(unitId) {

    return new Promise<void>((resolve, reject) => {
      this.UnitServices.getByIdWithUrl("GetById?id="+unitId).subscribe({
        next: (res: any) => {
          //(("result data", res.data);
          res.data.unitstatus = 1;
           this.unit =res.data;
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });

    }).then(a=>{
      this.updateUnitStatus(this.unit)
    });

  }
  updateUnitStatus(item:Unit) {
    const promise = new Promise<void>((resolve, reject) => {
      this.UnitServices.updateWithUrl("Update",item).subscribe({
        next: (res: any) => {
          //(("result updateUnitStatus", res.data);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });

    }).then(a=>{
      this.getUnits()
    });
    return promise;
  }

  getSystemSettings() {
    const promise = new Promise<void>((resolve, reject) => {
      this.SystemSettingsService.getAll("GetAll").subscribe({
        next: (res: any) => {
          //(("result data", res.data);
          this.showDecimalPoint = res.data[0].showDecimalPoint;
          this.showThousandsComma = res.data[0].showThousandsComma;
          this.showRoundingFractions = res.data[0].showRoundingFractions;
          this.numberOfFraction = res.data[0].numberOfFraction;

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

  openUnitSearchDialog(i = -1) {

    let searchTxt = '';
    if (i == -1) {
      searchTxt = this.selectedRentContractUnits?.unitNameAr ?? '';
    } else {
      searchTxt =''
      // this.rentContractUnits[i].unitNameAr!;
    }

    let data = this.units.filter((x) => {
      return (
        (x.unitNameAr + ' ' + x.unitNameEn).toLowerCase().includes(searchTxt) ||
        (x.unitNameAr + ' ' + x.unitNameEn).toUpperCase().includes(searchTxt)
      );
    });

    if (data.length == 1) {
      if (i == -1) {
        this.selectedRentContractUnits!.unitNameAr = data[0].unitNameAr;
        this.selectedRentContractUnits!.unitId = data[0].id;
      } else {
        this.rentContractUnits[i].unitNameAr = data[0].unitNameAr;
        this.rentContractUnits[i].unitId = data[0].id;
      }
    } else {
      let lables = ['الكود', ' الاسم', 'الاسم الانجليزى'];
      let names = ['unitCode', 'unitNameAr', 'unitNameEn'];
      let title = 'بحث عن الوحدة';

      let sub = this.searchDialog
        .showDialog(lables, names, this.units, title, searchTxt)
        .subscribe((d) => {
          if (d) {
            if (i == -1) {
              this.selectedRentContractUnits!.unitNameAr = d.unitNameAr;
              this.selectedRentContractUnits!.unitId = d.id;

             // this.getUnitData(this.selectedRentContractUnits!.unitId)
            } else {
              this.rentContractUnits[i].unitNameAr = d.unitNameAr;
              this.rentContractUnits[i].unitId = d.id;
            }
          }
        });
      this.subsList.push(sub);
    }
    this.onSelecedtUnit.emit(this.rentContractUnits);
  }




}
