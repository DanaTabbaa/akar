import { SalesContractUnit } from "src/app/core/models/sales-contract-unit";
import { BaseAction } from "./base.action";

export class SalesContractUnitActions extends BaseAction<SalesContractUnit>{

    public static readonly actions:SalesContractUnitActions = new SalesContractUnitActions();
    constructor(){
        super("[SalesContractUnitActions]");
    }
}