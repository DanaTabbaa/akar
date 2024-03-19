import { RentContractsUser } from "src/app/core/models/rent-contracts-users";

export interface RentContractsUsersModel{
    list:RentContractsUser[]
}

export interface SelectedRentContractsUsersModel{
    selected?:RentContractsUser
}