import { Unit } from "src/app/core/models/units";
import { UnitVM } from "../../view-models/unit-vm";

export interface UnitsModel{
    list:UnitVM[]
}

export interface SelectedUnitModel{
    selected?:UnitVM
}