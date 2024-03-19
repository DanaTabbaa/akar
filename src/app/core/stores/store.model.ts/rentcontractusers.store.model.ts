import { RentContractUser } from "src/app/core/models/rent-contract-users";

export interface RentContractUsersModel{
    list:RentContractUser[]
}

export interface SelectedRentContractUsersModel{
    selected?:RentContractUser
}