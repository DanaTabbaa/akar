import { Countries } from "src/app/core/models/countries";
import { Currencies } from "../../models/currencies";

export interface CurrenciesModel{
    list:Currencies[]
}

export interface SelectedCurrencyModel{
    selected?:Currencies
}
