import { WaterMeter } from "src/app/core/models/water-meter";

export interface WaterMetersModel{
    list:WaterMeter[]
}

export interface SelectedWaterMeterModel{
    selected?:WaterMeter
}