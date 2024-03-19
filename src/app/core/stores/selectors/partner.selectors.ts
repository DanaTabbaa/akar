import { SelectedPartnerModel, PartnerModel } from "../store.model.ts/partners.store.model";
import { BaseSelector } from "./base.selector";

export class PartnerSelectors extends BaseSelector<PartnerModel, SelectedPartnerModel>{
    public static readonly selectors:PartnerSelectors = new PartnerSelectors();

    constructor(){
        super("partners", "selectedPartner", "selectedPartnerList");
    }
}