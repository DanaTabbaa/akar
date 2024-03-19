import { BuildingFloorUser } from "src/app/core/models/buildings-floors-users";

export interface BuildingsFloorsUsersModel{
    list:BuildingFloorUser[]
}

export interface SelectedBuildingFloorUserModel{
    selected?:BuildingFloorUser
}