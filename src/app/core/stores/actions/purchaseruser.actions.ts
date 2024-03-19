import { PurchasersUsers } from "src/app/core/models/purchasers-users";
import { BaseAction } from "./base.action";

export class PurchaserUserActions extends BaseAction<PurchasersUsers>{

    public static readonly actions:PurchaserUserActions = new PurchaserUserActions();
    constructor(){
        super("[PurchaserUserActions]");
    }
}