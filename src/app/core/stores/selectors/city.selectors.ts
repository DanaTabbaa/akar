import { SelectedCityModel, CitiesModel } from "../store.model.ts/cities.store.model";
import { BaseSelector } from "./base.selector";

export class CitySelectors extends BaseSelector<CitiesModel, SelectedCityModel>{
    public static readonly selectors:CitySelectors = new CitySelectors();

    constructor(){
        super("cities", "selectedCity", "selectedCityList");
    }
}