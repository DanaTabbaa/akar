import { SelectedVoucherModel, VoucherModel } from "../store.model.ts/vouchers.store.model";
import { BaseSelector } from "./base.selector";

export class VoucherSelectors extends BaseSelector<VoucherModel, SelectedVoucherModel>{
    public static readonly selectors:VoucherSelectors = new VoucherSelectors();

    constructor(){
        super("vouchers", "selectedVoucher", "selectedVoucherList");
    }
}