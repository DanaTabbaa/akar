import { SelectedRentContractSettlementModel, RentContractSettlementModel } from "../store.model.ts/rentcontractsettlement.store.model";
import { BaseSelector } from "./base.selector";

export class RentContractSettlementSelectors extends BaseSelector<RentContractSettlementModel, SelectedRentContractSettlementModel>{
    public static readonly selectors:RentContractSettlementSelectors = new RentContractSettlementSelectors();

    constructor(){
        super("rentcontractsettlements", "selectedRentContractSettlement", "selectedRentContractSettlementList");
    }
}