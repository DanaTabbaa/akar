import { Area } from "src/app/core/models/area";
import { AreaActions } from "../actions/area.actions";
import { BaseReducer } from "./base.reducer";

import { GroundUsersActions } from '../actions/ground-users.actions';
import { GroundUsers } from "../../models/ground-users";

export class GroundUsersReducers extends BaseReducer<GroundUsers>{
    public static readonly reducers:GroundUsersReducers = new GroundUsersReducers();
    constructor(){
        super(GroundUsersActions.actions);
    }
}