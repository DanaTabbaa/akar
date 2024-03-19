import { SalesContract } from "src/app/core/models/sales-contracts";

export interface SalesContractModel{
    list:SalesContract[]
}

export interface SelectedSalesContractModel{
    selected?:SalesContract
}