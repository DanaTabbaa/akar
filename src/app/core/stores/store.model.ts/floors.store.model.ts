import { Floor } from "src/app/core/models/floors"


export interface FloorsModel{
    list:Floor[]
}

export interface SelectedFloorModel{
    selected?:Floor
}