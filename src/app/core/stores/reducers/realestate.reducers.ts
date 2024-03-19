import { Realestate } from "src/app/core/models/realestates";
import { RealestateActions } from "../actions/realestate.actions";
import { BaseReducer } from "./base.reducer";

export class RealestateReducers extends BaseReducer<Realestate>{
    public static readonly reducers:RealestateReducers = new RealestateReducers();
    constructor(){
        super(RealestateActions.actions);
    }
}