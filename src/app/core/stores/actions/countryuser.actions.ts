import { CountriesUsers } from "src/app/core/models/countries-users";
import { BaseAction } from "./base.action";

export class CountryUserActions extends BaseAction<CountriesUsers>{

    public static readonly actions:CountryUserActions = new CountryUserActions();
    constructor(){
        super("[CountryUserActions]");
    }
}