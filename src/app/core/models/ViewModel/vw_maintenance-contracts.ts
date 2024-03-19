export class VwMaintenancecontracts
{
    id:any;
    maintenanceContractSettingId:any;
    supplierId:any;
    maintenanceServiceId:any;
    date!:Date;
    startDate!:Date;
    endDate!:Date;
    paymentsCount!:number;
    periodBetweenPayments!:number;
    timeType!:number;
    firstDueDate!:Date;
    supplierNameAr!:string;
    supplierNameEn!:string;
    serviceNameAr!:string;
    serviceNameEn!:string;
    supplierAccountId: any;
    expenseAccountId: any;
    taxAccountId: any;
    totalBeforeTax: any;
    totalTax: any;
    totalAfterTax: any;
    userId:any;
    contractStatus!:number;
    contractStatusArName!:string;
    contractStatusEnName!:string;
}