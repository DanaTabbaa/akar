import { RentContractSettlement } from "src/app/core/models/rent-contract-settlement";
import { RentContractSettlementActions } from "../actions/rentcontractsettlement.actions";
import { BaseReducer } from "./base.reducer";

export class RentContractSettlementReducers extends BaseReducer<RentContractSettlement>{
    public static readonly reducers:RentContractSettlementReducers = new RentContractSettlementReducers();
    constructor(){
        super(RentContractSettlementActions.actions);
    }
}