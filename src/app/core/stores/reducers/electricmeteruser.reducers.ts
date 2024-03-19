import { ElectricityMetersUsers } from "src/app/core/models/electricity-meters-users";
import { ElectricMeterUserActions } from "../actions/electricmeteruser.actions";
import { BaseReducer } from "./base.reducer";

export class ElectricMeterUserReducers extends BaseReducer<ElectricityMetersUsers>{
    public static readonly reducers:ElectricMeterUserReducers = new ElectricMeterUserReducers();
    constructor(){
        super(ElectricMeterUserActions.actions);
    }
}