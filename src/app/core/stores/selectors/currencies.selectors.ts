import { SelectedCountryModel, CountriesModel } from "../store.model.ts/countries.store.model";
import { BaseSelector } from "./base.selector";

export class CurrencySelectors extends BaseSelector<CountriesModel, SelectedCountryModel>{
    public static readonly selectors:CurrencySelectors = new CurrencySelectors();

    constructor(){
        super("currency", "selectedCurrency", "selectedCurrencyList");
    }
}
