import { RentContractGround } from "src/app/core/models/rent-contract-grounds";
import { RentContractGroundActions } from "../actions/rentcontractground.actions";
import { BaseReducer } from "./base.reducer";

export class RentContractGroundReducers extends BaseReducer<RentContractGround>{
    public static readonly reducers:RentContractGroundReducers = new RentContractGroundReducers();
    constructor(){
        super(RentContractGroundActions.actions);
    }
}