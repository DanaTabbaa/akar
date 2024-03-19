import { RentContractUnit } from "src/app/core/models/rent-contract-units";
import { RentContratcUnitsActions } from "../actions/rentcontractunits.actions";
import { BaseReducer } from "./base.reducer";

export class RentContractUnitReducers extends BaseReducer<RentContractUnit>{
    public static readonly reducers:RentContractUnitReducers = new RentContractUnitReducers();
    constructor(){
        super(RentContratcUnitsActions.actions);
    }
}