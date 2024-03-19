import { CitiesUsers } from "src/app/core/models/cities-users";
import { CityUserActions } from "../actions/cityuser.actions";
import { BaseReducer } from "./base.reducer";

export class CityUserReducers extends BaseReducer<CitiesUsers>{
    public static readonly reducers:CityUserReducers = new CityUserReducers();
    constructor(){
        super(CityUserActions.actions);
    }
}