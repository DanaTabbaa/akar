import { Realestate } from "src/app/core/models/realestates";

export interface RealestatesModel{
    list:Realestate[]
}

export interface SelectedRealestateModel{
    selected?:Realestate
}