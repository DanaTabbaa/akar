import { SalesContractGround } from "src/app/core/models/sales-contract-ground";
import { BaseAction } from "./base.action";

export class SalesContractGroundActions extends BaseAction<SalesContractGround>{

    public static readonly actions:SalesContractGroundActions = new SalesContractGroundActions();
    constructor(){
        super("[SalesContractGroundActions]");
    }
}