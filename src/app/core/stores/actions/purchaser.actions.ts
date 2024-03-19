import { Purchasers } from "../../models/purchasers";
import { BaseAction } from "./base.action";
export class PurchaserActions extends BaseAction<Purchasers>{

    public static readonly actions:PurchaserActions = new PurchaserActions();
    constructor(){
        super("[PurchaserActions]");
    }
}