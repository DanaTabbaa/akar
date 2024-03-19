import { CountriesUsers } from "src/app/core/models/countries-users";
import { CountryUserActions } from "../actions/countryuser.actions";
import { BaseReducer } from "./base.reducer";

export class CountryUserReducers extends BaseReducer<CountriesUsers>{
    public static readonly reducers:CountryUserReducers = new CountryUserReducers();
    constructor(){
        super(CountryUserActions.actions);
    }
}