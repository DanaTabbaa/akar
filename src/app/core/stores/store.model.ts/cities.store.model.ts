import { Cities } from "src/app/core/models/cities";

export interface CitiesModel{
    list:Cities[]
}

export interface SelectedCityModel{
    selected?:Cities
}