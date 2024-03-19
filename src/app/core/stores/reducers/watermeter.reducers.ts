import { WaterMeters } from "src/app/core/models/water-meters";
import { WaterMeterActions } from "../actions/watermeter.actions";
import { BaseReducer } from "./base.reducer";

export class WaterMeterReducers extends BaseReducer<WaterMeters>{
    public static readonly reducers:WaterMeterReducers = new WaterMeterReducers();
    constructor(){
        super(WaterMeterActions.actions);
    }
}