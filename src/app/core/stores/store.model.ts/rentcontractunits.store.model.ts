import { RentContractUnit } from "src/app/core/models/rent-contract-units";

export interface RentContractUnitsModel{
    list:RentContractUnit[]
}

export interface SelectedRentContractUnitModel{
    selected?:RentContractUnit
}