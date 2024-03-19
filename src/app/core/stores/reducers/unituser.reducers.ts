import { UnitsUsers } from "src/app/core/models/units-users";
import { UnitUserActions } from "../actions/unituser.actions";
import { BaseReducer } from "./base.reducer";

export class UnitUserReducers extends BaseReducer<UnitsUsers>{
    public static readonly reducers:UnitUserReducers = new UnitUserReducers();
    constructor(){
        super(UnitUserActions.actions);
    }
}