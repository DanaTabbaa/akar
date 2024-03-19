import { Area } from "src/app/core/models/area";

export interface AreasModel{
    list:Area[]
}

export interface SelectedAreaModel{
    selected?:Area
}