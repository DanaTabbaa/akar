import { BillModel, SelectedBillModel } from "../store.model.ts/bills.store.model";
import { BaseSelector } from "./base.selector";

export class BillSelectors extends BaseSelector<BillModel, SelectedBillModel>{
    public static readonly selectors:BillSelectors = new BillSelectors();

    constructor(){
        super("bills", "selectedBill", "selectedBillList");
    }
}