import { SelectedPurchaserModel, PurchaserModel } from "../store.model.ts/purchasers.store.model";
import { BaseSelector } from "./base.selector";

export class PurchaserSelectors extends BaseSelector<PurchaserModel, SelectedPurchaserModel>{
    public static readonly selectors:PurchaserSelectors = new PurchaserSelectors();

    constructor(){
        super("purchasers", "selectedPurchaser", "selectedPurchaserList");
    }
}