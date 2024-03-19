import { Region } from "src/app/core/models/regions";

export interface RegionsModel{
    list:Region[]
}

export interface SelectedRegionModel{
    selected?:Region
}