import { RentContractSettlement } from "src/app/core/models/rent-contract-settlement";

export interface RentContractSettlementModel{
    list:RentContractSettlement[]
}

export interface SelectedRentContractSettlementModel{
    selected?:RentContractSettlement
}