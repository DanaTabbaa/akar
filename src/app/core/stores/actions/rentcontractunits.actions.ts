import { RentContractUnit } from "src/app/core/models/rent-contract-units";
import { BaseAction } from "./base.action";

export class RentContratcUnitsActions extends BaseAction<RentContractUnit>{

    public static readonly actions:RentContratcUnitsActions = new RentContratcUnitsActions();
    constructor(){
        super("[RentContratcUnitsActions]");
    }
}