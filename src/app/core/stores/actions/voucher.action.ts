import { Voucher } from "../../models/voucher";
import { BaseAction } from "./base.action";

export class VoucherActions extends BaseAction<Voucher>{

    public static readonly actions:VoucherActions = new VoucherActions();
    constructor(){
        super("[VoucherActions]");
    }
}