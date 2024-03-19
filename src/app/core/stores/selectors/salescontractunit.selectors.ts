import { SelectedSalesContractUnitModel, SalesContractUnitModel } from "../store.model.ts/salescontractunit.store.model";
import { BaseSelector } from "./base.selector";

export class SalesContractUnitSelectors extends BaseSelector<SalesContractUnitModel, SelectedSalesContractUnitModel>{
    public static readonly selectors:SalesContractUnitSelectors = new SalesContractUnitSelectors();

    constructor(){
        super("salescontractsunits", "selectedSalesContractUnit", "selectedSalesContractUnitList");
    }
}