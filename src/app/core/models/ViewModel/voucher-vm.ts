import { VoucherDetail } from "../voucher-detail";
import { VoucherDueDetails, VoucherRentDueDetailsVm } from "../voucher-due-details";

export class VoucherVm {
    id!: number;
    typeId!: number;
    code !: string;
    ownerId!: number;
    //ownerAccId!: number;
    officeId!: number;
    //officeAccId!: number;
    tenantId!: number;
    //tenantAccId!: number;
    purchaserId!: number;
    accId!:number;
    docDate: any;
    amount!: number;
    notes!: string;
    ownerNameAr!:string;
    ownerNameEn!:string;
    tenantNameAr!:string;
    tenantNameEn!:string;
}


export class VoucherData {
    id!: number;
    typeId!: number;
    code !: string;
    ownerId!: number;
    //ownerAccId!: number;
    officeId!: number;
    //officeAccId!: number;
    tenantId!: number;
    //tenantAccId!: number;
    purchaserId!: number;
    accId!:number;
    docDate: any;
    amount!: number;
    notes!: string;
    voucherDueDetails:VoucherRentDueDetailsVm[]=[];
    voucherDetails:VoucherDetail[]=[];
  
}