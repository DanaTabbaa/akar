import { WaterMetersUser } from "src/app/core/models/water-meters-users";

export interface WaterMetersUsersModel{
    list:WaterMetersUser[]
}

export interface SelectedWaterMeterUserModel{
    selected?:WaterMetersUser
}