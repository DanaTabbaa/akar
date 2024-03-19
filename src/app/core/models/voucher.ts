import {VoucherDetail} from './voucher-detail';
import {VoucherDueDetails} from './voucher-due-details';
export class Voucher {
    id!: number;
    typeId!: number;
    code !: string;
    ownerId!: number;
    //ownerAccId!: number;
    officeId!: number;
    //officeAccId!: number;
    tenantId!: number;
    purchaserId!: number;
    //tenantAccId!: number;
    docDate: any;
    amount!: number;
    notes!: string;
    accId!:number;
    voucherDetails:VoucherDetail[]=[];
    voucherDueDetails:VoucherDueDetails[] = [];

}