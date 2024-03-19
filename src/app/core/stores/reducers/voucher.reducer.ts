import { Voucher } from "../../models/voucher";
import { VoucherActions } from "../actions/voucher.action";
import { BaseReducer } from "./base.reducer";

export class VoucherReducers extends BaseReducer<Voucher>{
    public static readonly reducers:VoucherReducers = new VoucherReducers();
    constructor(){
        super(VoucherActions.actions);
    }
}