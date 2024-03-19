export class OfferUnitServiceDetails {
    id!: number;
    masterOfferId!: number;
    unitId!: number | null;
    serviceId!: number | null;
    paymentMethod!: number | 0;
    calculationMethod!: number | 0;
    numberOfServices: any=0;
    serviceRatio!: number 
    serviceAmount!: number ;
    serviceTax:any;
    amountAfterTax!: number 
    annualIncreaseRate?: number ;
    fromAccount!: number ;
    toAccount!: number 
    calcMethodTypeName?:string;
    payOnTimeName?:string;
    fromAccountName!:any
    toAccountName!: any;
    unitNameAr!:string;
    unitNameEn!:string;
    unitServiceNameAr!:any
    unitServiceNameEn!:any

}