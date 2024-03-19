import { ElectricityMeters } from "src/app/core/models/electricity-meters";

export interface ElectricMetersModel{
    list:ElectricityMeters[]
}

export interface SelectedElectricMetersModel{
    selected?:ElectricityMeters
}