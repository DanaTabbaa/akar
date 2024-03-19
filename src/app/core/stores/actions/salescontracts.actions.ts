import { SalesBuyContracts } from "src/app/core/models/sales-buy-contracts";
import { BaseAction } from "./base.action";

export class SalesContractActions extends BaseAction<SalesBuyContracts>{

    public static readonly actions:SalesContractActions = new SalesContractActions();
    constructor(){
        super("[SalesContractActions]");
    }
}