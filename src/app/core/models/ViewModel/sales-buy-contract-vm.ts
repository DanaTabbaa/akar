export class SalesBuyContractVm{
    id: any;
  contractNumber?: string;
  contractSettingId:any;  
  createDate: any;
  calendarType?: number;  
  ownerId: any;  
  tenantId: any;
  realestateId: any;  
  firstPaymentAmount: any;
  lastPaymentAmount:any;  
  ownerAccountId:any;  
  tenantAccountId?: number;
  taxAccountId: any;    
  totalTaxes: any;
  notes?: string;  
  buildingId: any;
  firstDueDate: any;
  contractDate: any;
  totalArea: any;
  averagePriceOfMeter: any;
  totalWithTax: any;   
  amountPerTime?:number;
  periodBetweenAmountPerMonth!:number;

  ownerNameAr !:string;
  ownerNameEn !:string;
  tenantNameAr !:string;
  tenantNameEn !:string;
  buildingNameAr !:string;
  buildingNameEn !:string;
}