import { Region } from "src/app/core/models/regions";
import { RegionActions } from "../actions/region.actions";
import { BaseReducer } from "./base.reducer";

export class RegionReducers extends BaseReducer<Region>{
    public static readonly reducers:RegionReducers = new RegionReducers();
    constructor(){
        super(RegionActions.actions);
    }
}