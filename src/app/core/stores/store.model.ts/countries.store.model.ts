import { Countries } from "src/app/core/models/countries";

export interface CountriesModel{
    list:Countries[]
}

export interface SelectedCountryModel{
    selected?:Countries
}