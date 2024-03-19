export class MaintenanceContracts {
    id: any;
    contractNumber: any;
    maintenanceContractSettingId: any;
    supplierId: any;
    maintenanceServiceId: any;
    date!: Date;
    startDate!: Date;
    endDate!: Date;
    paymentsCount!: number;
    periodBetweenPayments!: number;
    periodType!: number;
    firstDueDate!: Date;
    period!: number;
    paymentMethodType!: number;
    supplierAccountId: any;
    expenseAccountId: any;
    taxAccountId: any;
    totalBeforeTax: any;
    totalTax: any;
    totalAfterTax: any;
    contractStatus!:number;
    contractStatusArName!:string;
    contractStatusEnName!:string;

}