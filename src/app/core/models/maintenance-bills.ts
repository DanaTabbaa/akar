export class MaintenanceBills {
    id: any;
    date!: Date;
    tenantId: any;
    unitId: any;
    maintenanceRequestId: any;
    maintenanceCostOn: any;
    notes!: string;
    specialDiscount!: number;
    ownerServicesAccountId: any;
    taxAccountId: any;
    tenantAccountId: any;
    totalBeforeTax!:number;
    totalBeforeTaxWithInstallationPrice!:number;
    totalTax!:number;
    totalAfterTax!:number;

}