import { SelectedCountryModel, CountriesModel } from "../store.model.ts/countries.store.model";
import { BaseSelector } from "./base.selector";

export class CountrySelectors extends BaseSelector<CountriesModel, SelectedCountryModel>{
    public static readonly selectors:CountrySelectors = new CountrySelectors();

    constructor(){
        super("countries", "selectedCountry", "selectedCountryList");
    }
}