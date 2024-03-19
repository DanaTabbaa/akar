import { Cities } from "src/app/core/models/cities";
import { CityActions } from "../actions/city.actions";
import { BaseReducer } from "./base.reducer";

export class CityReducers extends BaseReducer<Cities>{
    public static readonly reducers:CityReducers = new CityReducers();
    constructor(){
        super(CityActions.actions);
    }
}