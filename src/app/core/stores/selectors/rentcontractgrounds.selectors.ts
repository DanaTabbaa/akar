import { SelectedRentContractGroundsModel, RentContractGroundsModel } from "../store.model.ts/rentcontractgrounds.store.model";
import { BaseSelector } from "./base.selector";

export class RentContractGroundsSelectors extends BaseSelector<RentContractGroundsModel, SelectedRentContractGroundsModel>{
    public static readonly selectors:RentContractGroundsSelectors = new RentContractGroundsSelectors();

    constructor(){
        super("rentcontractgrounds", "selectedRentContractGrounds", "selectedRentContractGroundsList");
    }
}