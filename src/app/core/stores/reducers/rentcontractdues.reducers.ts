import { RentContractDueVM } from "../../models/ViewModel/rent-contract-due-vm";
import { RentContractDuesActions } from "../actions/rentcontractdues.actions";
import { BaseReducer } from "./base.reducer";

export class RentContractDuesReducers extends BaseReducer<RentContractDueVM>{
    public static readonly reducers:RentContractDuesReducers = new RentContractDuesReducers();
    constructor(){
        super(RentContractDuesActions.actions);
    }
}