import { BillType } from "src/app/core/models/bill-type";
import { BillTypeActions } from "../actions/bill-type.action";
import { BaseReducer } from "./base.reducer";

export class BillTypeReducers extends BaseReducer<BillType>{
    public static readonly reducers:BillTypeReducers = new BillTypeReducers();
    constructor(){
        super(BillTypeActions.actions);
    }
}