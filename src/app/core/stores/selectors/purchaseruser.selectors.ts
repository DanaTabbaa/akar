import { SelectedPurchaserUserModel, PurchasersUsersModel } from "../store.model.ts/purchasersusers.store.model";
import { BaseSelector } from "./base.selector";

export class PurchaserUserSelectors extends BaseSelector<PurchasersUsersModel, SelectedPurchaserUserModel>{
    public static readonly selectors:PurchaserUserSelectors = new PurchaserUserSelectors();

    constructor(){
        super("purchasersusers", "selectedPurchaserUser", "selectedPurchaserUserList");
    }
}