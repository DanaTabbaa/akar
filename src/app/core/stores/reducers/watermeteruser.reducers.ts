import { WaterMetersUsers } from "src/app/core/models/water-meters-users";
import { WaterMetersUserActions } from "../actions/watermeteruser.actions";
import { BaseReducer } from "./base.reducer";

export class WaterMeterUserReducers extends BaseReducer<WaterMetersUsers>{
    public static readonly reducers:WaterMeterUserReducers = new WaterMeterUserReducers();
    constructor(){
        super(WaterMetersUserActions.actions);
    }
}