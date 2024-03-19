import { RentContractUser } from "src/app/core/models/rent-contract-users";
import { BaseAction } from "./base.action";

export class RentContractUserActions extends BaseAction<RentContractUser>{

    public static readonly actions:RentContractUserActions = new RentContractUserActions();
    constructor(){
        super("[RentContractUserActions]");
    }
}