import { Bills } from "../../models/bills";
import { BaseAction } from "./base.action";

export class BillActions extends BaseAction<Bills>{

    public static readonly actions:BillActions = new BillActions();
    constructor(){
        super("[BillActions]");
    }
}