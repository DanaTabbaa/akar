import { Building } from "src/app/core/models/buildings";

export interface BuildingsModel{
    list:Building[]
}

export interface SelectedBuildingModel{
    selected?:Building
}