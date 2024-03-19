import { Area } from "src/app/core/models/area";
import { AreaActions } from "../actions/area.actions";
import { BaseReducer } from "./base.reducer";

export class AreaReducers extends BaseReducer<Area>{
    public static readonly reducers:AreaReducers = new AreaReducers();
    constructor(){
        super(AreaActions.actions);
    }
}