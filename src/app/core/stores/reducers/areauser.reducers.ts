import { AreaUsers } from "src/app/core/models/area-users";
import { AreaUserActions } from "../actions/areauser.actions";
import { BaseReducer } from "./base.reducer";

export class AreaUserReducers extends BaseReducer<AreaUsers>{
    public static readonly reducers:AreaUserReducers = new AreaUserReducers();
    constructor(){
        super(AreaUserActions.actions);
    }
}