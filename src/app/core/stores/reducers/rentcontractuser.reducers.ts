import { RentContractUser } from "src/app/core/models/rent-contract-users";
import { RentContractUserActions } from "../actions/rentcontractusers.actions";
import { BaseReducer } from "./base.reducer";

export class RentContractUserReducers extends BaseReducer<RentContractUser>{
    public static readonly reducers:RentContractUserReducers = new RentContractUserReducers();
    constructor(){
        super(RentContractUserActions.actions);
    }
}