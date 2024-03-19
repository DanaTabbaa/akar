export class MaintenancePurchaseBills {
    id: any;
    purchaseOrderId: any;
    maintenanceOfferId: any;
    date!: Date;
    warehouseId: any;
    supplierId: any;
    supplierBillNo!: string;
    notes!: string;
    handling!: string;
    totalBeforeTax: any;
    totalTax: any;
    totalAfterTax: any;
    purchaseAccountId: any;
    valueAddedTaxAccountId: any;
    supplierAccountId: any;
}