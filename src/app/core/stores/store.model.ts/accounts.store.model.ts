import { Accounts } from "../../models/accounts"

export interface AccountsModel{
    list:Accounts[]
}

export interface SelectedAccountsModel{
    selected?:Accounts
}