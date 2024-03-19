import { ElectricityMetersUsers } from "src/app/core/models/electricity-meters-users";

export interface ElectricMetersUsersModel{
    list:ElectricityMetersUsers[]
}

export interface SelectedElectricMetersUsersModel{
    selected?:ElectricityMetersUsers
}