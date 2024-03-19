import { RentContractSettlement } from "src/app/core/models/rent-contract-settlement";
import { BaseAction } from "./base.action";

export class RentContractSettlementActions extends BaseAction<RentContractSettlement>{

    public static readonly actions:RentContractSettlementActions = new RentContractSettlementActions();
    constructor(){
        super("[RentContractSettlementActions]");
    }
}