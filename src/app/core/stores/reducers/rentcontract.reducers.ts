import { RentContract } from "src/app/core/models/rent-contracts";
import { RentContractActions } from "../actions/rentcontract.actions";
import { BaseReducer } from "./base.reducer";

export class RentContractReducers extends BaseReducer<RentContract>{
    public static readonly reducers:RentContractReducers = new RentContractReducers();
    constructor(){
        super(RentContractActions.actions);
    }
}