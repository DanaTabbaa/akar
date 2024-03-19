import { SelectedSaleContractGroundModel, SaleContractGroundModel } from "../store.model.ts/salescontractground.store.model";
import { BaseSelector } from "./base.selector";

export class SalesContractGroundSelectors extends BaseSelector<SaleContractGroundModel, SelectedSaleContractGroundModel>{
    public static readonly selectors:SalesContractGroundSelectors = new SalesContractGroundSelectors();

    constructor(){
        super("salescontractsgrounds", "selectedSaleContractGround", "selectedSaleContractGroundList");
    }
}