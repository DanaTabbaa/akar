import { SelectedPartnerUserModel, PartnersUsersModel } from "../store.model.ts/partnersusers.store.model";
import { BaseSelector } from "./base.selector";

export class PartnerUserSelectors extends BaseSelector<PartnersUsersModel, SelectedPartnerUserModel>{
    public static readonly selectors:PartnerUserSelectors = new PartnerUserSelectors();

    constructor(){
        super("partnersusers", "selectedPartnerUser", "selectedPartnerUserList");
    }
}