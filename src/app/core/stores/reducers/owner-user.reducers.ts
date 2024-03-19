
import { OwnerUser } from "src/app/core/models/owners-users";
import { OwnerUserActions } from "../actions/owners-users.actions";
import { BaseReducer } from "./base.reducer";
export class OwnerUserReducers extends BaseReducer<OwnerUser>{
    public static readonly reducers:OwnerUserReducers = new OwnerUserReducers();
    constructor(){
        super(OwnerUserActions.actions);
    }
}