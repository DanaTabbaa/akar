
export class ProductsReceipt {
    id: any;
    maintenanceRequestId!: any;
    date!: Date;
    tenantId:any;
    TenantNameAr!:string;
    TenantNameEn!:string;
    technicianId:any;
    technicianNameAr!:string;
    technicianNameEn!:string;
    maintenanceCostOn:any;
    notes!: string;
    totalWithInstallationPriceBeforeTax:any;
    totalTax:any;
    totalAfterTax:any;
}