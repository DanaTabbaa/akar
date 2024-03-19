export interface SettelmentDetailsVM {
    transId: number | undefined;
    contractId: number;
    contractNumber: string;

    contractPeriod: number;
    dueNameEn: string;
    dueNameAr: string;

    endContractDate: Date
    perDayValue: number;
    startContractDate: Date;
    toSettelmentPeriod: number;
    totalAddedValue: number;
    totalAmount: number;
    totalDiscountValue: number;
    totalPaid: number;
    settelmentForPeriod: number;
    settelmentRemainValue: number;
    totalRemainValue: number;
    typeId: number;
    dueId: number;
    duePeriod: number;
    dueStartDate: any;
    dueEndDate: any;
    tenantId: any;
    perMonthValue: number;
    month: any;
    day: any;


}
export class Totals {
    totalDueAmount: number = 0;
    totalSettelmentDiscount: number = 0;
    totalDiscountValue: number = 0;
    totalAddedValue: number = 0;
    totalPaidValue: number = 0;
    totalSettelment: number = 0;
    totalRemainValue: number = 0;
}
export interface SettlementsVM {
    id: number;
    operationDate: any;
    tenantId?: number;
    contractId?: number;
    contractDuration?: number;
    settlementPeriod: number;
   // isCalculateToOpDate?: boolean;
    isGenerateEntry?: boolean;
   // notes: string;
   // valueFromInsurance?: number;
    valueForCustomer?: number;
    valueForOwner?: number;
    //isGenerateEntryOnRemain?: boolean;
    settlmentamount?: number;
    settelmentDate: any;
    settelmentServiceAccId: any;
    sttelmentServiceAmount?: number;
    isMonthlySettlement?: boolean;
}
export class SettlementDetailsNewVM {
    contractSettlements?: SettlementsVM
    settlementItems?: SettlementItems[];
}
export class SettlementItems
{
    dueId?:number;
    amount?:number;
    discountAmount?:number;
}