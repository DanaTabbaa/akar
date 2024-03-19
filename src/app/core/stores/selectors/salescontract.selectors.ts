import { SelectedSalesContractModel, SalesContractModel } from "../store.model.ts/salescontract.store.model";
import { BaseSelector } from "./base.selector";

export class SalesContractSelectors extends BaseSelector<SalesContractModel, SelectedSalesContractModel>{
    public static readonly selectors:SalesContractSelectors = new SalesContractSelectors();

    constructor(){
        super("salescontracts", "selectedSalesContract", "selectedSalesContractList");
    }
}