import { SelectedRentContractUnitModel, RentContractUnitsModel } from "../store.model.ts/rentcontractunits.store.model";
import { BaseSelector } from "./base.selector";

export class RentContractUnitsSelectors extends BaseSelector<RentContractUnitsModel, SelectedRentContractUnitModel>{
    public static readonly selectors:RentContractUnitsSelectors = new RentContractUnitsSelectors();

    constructor(){
        super("rentcontractunits", "selectedRentContractUnits", "selectedRentContractUnitsList");
    }
}