import { BuildingUser } from "src/app/core/models/buildings-users";

export interface BuildingsUsersModel{
    list:BuildingUser[]
}

export interface SelectedBuildingUserModel{
    selected?:BuildingUser
}