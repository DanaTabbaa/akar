import { RentContractDueVM } from "../../models/ViewModel/rent-contract-due-vm";


export interface RentContratDuesModel{
    list:RentContractDueVM[]
}

export interface SelectedRentContractDuesModel{
    selected?:RentContractDueVM
}