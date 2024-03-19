import { SalesContractUnit } from "src/app/core/models/sales-contract-unit";

export interface SalesContractUnitModel{
    list:SalesContractUnit[]
}

export interface SelectedSalesContractUnitModel{
    selected?:SalesContractUnit
}