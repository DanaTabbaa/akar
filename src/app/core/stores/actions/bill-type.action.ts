import { BillType } from "src/app/core/models/bill-type";
import { BaseAction } from "./base.action";

export class BillTypeActions extends BaseAction<BillType>{

    public static readonly actions:BillTypeActions = new BillTypeActions();
    constructor(){
        super("[BillTypeActions]");
    }
}