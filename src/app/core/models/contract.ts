
import { SalesBuyContractDue } from "./sales-buy-contract-due";
import { SalesBuyContractUnit } from "./sales-buy-contract-unit";

export class Contract {
  id: any;
  code?: string;
  contractSettingId:any;  
  createDate: any;
  calendarType?: number;  
  ownerId: any;  
  buyerId: any;
  sellerId: any;
  realestateId: any;  
  firstPaymentAmount: any;
  lastPaymentAmount:any;
  ownerAccountId:any;  
  oppositeAccountId?: number;
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
  numberOfPayments!:number;
  deferredRevenueAccountId!:number;
  accuredRevenueAccountId!:number;
  contractStatus!:number;
  salesBuyContractsDues:SalesBuyContractDue[] = []
  salesBuyContractsUnits: SalesBuyContractUnit[] = [];  
  
}
