import { SalesContractUser } from "src/app/core/models/sales-contract-users";
import { BaseAction } from "./base.action";

export class SalesContractUserActions extends BaseAction<SalesContractUser>{

    public static readonly actions:SalesContractUserActions = new SalesContractUserActions();
    constructor(){
        super("[SalesContractUserActions]");
    }
}