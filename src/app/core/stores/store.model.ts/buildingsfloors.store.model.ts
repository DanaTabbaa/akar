import { BuildingFloor } from "src/app/core/models/buildings-floors";

export interface BuildingsFloorsModel{
    list:BuildingFloor[]
}

export interface SelectedBuildingFloorModel{
    selected?:BuildingFloor
}