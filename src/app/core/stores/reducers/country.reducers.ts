import { Countries } from "src/app/core/models/countries";
import { CountryActions } from "../actions/country.actions";
import { BaseReducer } from "./base.reducer";

export class CountryReducers extends BaseReducer<Countries>{
    public static readonly reducers:CountryReducers = new CountryReducers();
    constructor(){
        super(CountryActions.actions);
    }
}