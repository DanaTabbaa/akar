import { RentContract } from "src/app/core/models/rent-contracts";
import { BaseAction } from "./base.action";

export class RentContractActions extends BaseAction<RentContract>{

    public static readonly actions:RentContractActions = new RentContractActions();
    constructor(){
        super("[RentContractActions]");
    }
}