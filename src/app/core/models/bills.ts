import { BillsDues } from "./bills-dues";

export class Bills{
    id:any
    code!:string;
    billDate!:any;
    ownerId:any;
    ownerAccId:any;
    tenantId:any;
    tenantAccId:any;
    taxAccId:any;
    officeId:any;
    purchaserId:any;
    purchaserAccId:any;
    sellerId:any
    sellerAccId:any;
    revenueAccId:any;
    supplierId:any;
    supplierAccountId:any;
    expenseAccountId:any;
    notes!:string;
    billTypeId:any;
    billTotal!:number;
    BillsDues:BillsDues[]= [];
}
