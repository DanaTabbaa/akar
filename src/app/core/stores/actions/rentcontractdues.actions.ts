import { RentContractDueVM } from "../../models/ViewModel/rent-contract-due-vm";
import { BaseAction } from "./base.action";

export class RentContractDuesActions extends BaseAction<RentContractDueVM>{

    public static readonly actions:RentContractDuesActions = new RentContractDuesActions();
    constructor(){
        super("[RentContractDuesActions]");
    }
}