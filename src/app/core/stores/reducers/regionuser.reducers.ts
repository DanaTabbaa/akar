import { RegionsUser } from "src/app/core/models/regions-users";
import { RegionsUserActions } from "../actions/regionuser.actions";
import { BaseReducer } from "./base.reducer";

export class RegionsUsersReducers extends BaseReducer<RegionsUser>{
    public static readonly reducers:RegionsUsersReducers = new RegionsUsersReducers();
    constructor(){
        super(RegionsUserActions.actions);
    }
}