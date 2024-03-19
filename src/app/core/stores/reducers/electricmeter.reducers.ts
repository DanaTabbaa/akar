import { ElectricityMeters } from "src/app/core/models/electricity-meters";
import { ElectricMeterActions } from "../actions/electricmeter.actions";
import { BaseReducer } from "./base.reducer";

export class ElectricMeterReducers extends BaseReducer<ElectricityMeters>{
    public static readonly reducers:ElectricMeterReducers = new ElectricMeterReducers();
    constructor(){
        super(ElectricMeterActions.actions);
    }
}