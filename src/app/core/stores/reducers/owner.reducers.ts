
import { Owner } from "../../models/owners";
import { OwnerActions } from "../actions/owner.actions";
import { BaseReducer } from "./base.reducer";

export class OwnerReducers extends BaseReducer<Owner>{
    public static readonly reducers:OwnerReducers = new OwnerReducers();
    constructor(){
        super(OwnerActions.actions);
    }
}