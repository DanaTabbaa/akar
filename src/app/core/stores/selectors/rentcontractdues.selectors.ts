import { SelectedRentContractDuesModel, RentContratDuesModel } from "../store.model.ts/rentcontractdues.store.model";
import { BaseSelector } from "./base.selector";

export class RentContractDuesSelectors extends BaseSelector<RentContratDuesModel, SelectedRentContractDuesModel>{
    public static readonly selectors:RentContractDuesSelectors = new RentContractDuesSelectors();

    constructor(){
        super("rentcontractdues", "selectedRentContractDues", "selectedRentContractDuesList");
    }
}