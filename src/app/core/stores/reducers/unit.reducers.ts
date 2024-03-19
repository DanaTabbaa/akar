import { Unit } from "src/app/core/models/units";
import { UnitActions } from "../actions/unit.actions";
import { BaseReducer } from "./base.reducer";

export class UnitReducers extends BaseReducer<Unit>{
    public static readonly reducers:UnitReducers = new UnitReducers();
    constructor(){
        super(UnitActions.actions);
    }
}