import { SelectedRentContractsModel, RentContractsModel } from "../store.model.ts/rentcontracts.store.model";
import { BaseSelector } from "./base.selector";

export class RentContractSelectors extends BaseSelector<RentContractsModel, SelectedRentContractsModel>{
    public static readonly selectors:RentContractSelectors = new RentContractSelectors();

    constructor(){
        super("rentcontracts", "selectedRentContract", "selectedRentContractList");
    }
}