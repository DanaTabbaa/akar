import { SalesContractsUser } from "src/app/core/models/sales-contracts-users";

export interface SalesContractsUsersModel{
    list:SalesContractsUser[]
}

export interface SelectedSalesContractsUsersModel{
    selected?:SalesContractsUser
}