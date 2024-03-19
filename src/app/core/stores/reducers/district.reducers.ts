import { District } from "src/app/core/models/district";
import { DistrictActions } from "../actions/district.actions";
import { BaseReducer } from "./base.reducer";

export class DistrictReducers extends BaseReducer<District>{
    public static readonly reducers:DistrictReducers = new DistrictReducers();
    constructor(){
        super(DistrictActions.actions);
    }
}