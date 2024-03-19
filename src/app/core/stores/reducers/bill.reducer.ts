import { Bills } from "../../models/bills";
import { BillActions } from "../actions/bill.action";
import { BaseReducer } from "./base.reducer";

export class BillReducers extends BaseReducer<Bills>{
    public static readonly reducers:BillReducers = new BillReducers();
    constructor(){
        super(BillActions.actions);
    }
}