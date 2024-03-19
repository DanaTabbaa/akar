import { RentContract } from "src/app/core/models/rent-contracts";

export interface RentContractsModel{
    list:RentContract[]
}

export interface SelectedRentContractsModel{
    selected?:RentContract
}