import { RentContractGround } from "src/app/core/models/rent-contract-grounds";
import { BaseAction } from "./base.action";

export class RentContractGroundActions extends BaseAction<RentContractGround>{

    public static readonly actions:RentContractGroundActions = new RentContractGroundActions();
    constructor(){
        super("[RentContractGroundActions]");
    }
}