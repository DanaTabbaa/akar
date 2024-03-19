import { SelectedBillTypeModel, BillTypeModel } from "../store.model.ts/bill-types.store.model";
import { BaseSelector } from "./base.selector";

export class BillTypeSelectors extends BaseSelector<BillTypeModel, SelectedBillTypeModel>{
    public static readonly selectors:BillTypeSelectors = new BillTypeSelectors();

    constructor(){
        super("billTypes", "selectedBillType", "selectedBillTypeList");
    }
}