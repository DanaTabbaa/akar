import { SelectedCountryUserModel, CountriesUsersModel } from "../store.model.ts/countriesusers.store.model";
import { BaseSelector } from "./base.selector";

export class CountryUserSelectors extends BaseSelector<CountriesUsersModel, SelectedCountryUserModel>{
    public static readonly selectors:CountryUserSelectors = new CountryUserSelectors();

    constructor(){
        super("countriesusers", "selectedCountryUser", "selectedCountryUserList");
    }
}