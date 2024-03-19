import { SelectedCityUserModel, CitiesUsersModel } from "../store.model.ts/citiesusers.store.model";
import { BaseSelector } from "./base.selector";

export class CityUserSelectors extends BaseSelector<CitiesUsersModel, SelectedCityUserModel>{
    public static readonly selectors:CityUserSelectors = new CityUserSelectors();

    constructor(){
        super("citiesusers", "selectedCityUser", "selectedCityUserList");
    }
}