import { Area } from "src/app/core/models/area";
import { AreaActions } from "../actions/area.actions";
import { BaseReducer } from "./base.reducer";
import { FloorsUsersActions } from '../actions/floors-users.actions';

export class FloorsUsersReducers extends BaseReducer<Area>{
    public static readonly reducers:FloorsUsersReducers = new FloorsUsersReducers();
    constructor(){
        super(FloorsUsersActions.actions);
    }
}