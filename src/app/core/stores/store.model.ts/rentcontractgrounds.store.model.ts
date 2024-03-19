import { RentContractGround } from "src/app/core/models/rent-contract-grounds";

export interface RentContractGroundsModel{
    list:RentContractGround[]
}

export interface SelectedRentContractGroundsModel{
    selected?:RentContractGround
}