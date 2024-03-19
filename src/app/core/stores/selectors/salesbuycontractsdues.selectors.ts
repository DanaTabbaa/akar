import { SalesBuyContractsDuesModel, SelectedSalesBuyContractsDuesModel } from "../store.model.ts/salesbuycontractsdues.store.model";
import { BaseSelector } from "./base.selector";

export class SalesBuyContractsDuesSelectors extends BaseSelector<SalesBuyContractsDuesModel, SelectedSalesBuyContractsDuesModel>{
    public static readonly selectors:SalesBuyContractsDuesSelectors = new SalesBuyContractsDuesSelectors();

    constructor(){
        super("salesbuycontractsdues", "selectedSalesBuyContractsDues", "selectedSalesBuyContractsDuesList");
    }
}