import { VendorsUser } from "src/app/core/models/vendors-users";

export interface VendorsUsersModel{
    list:VendorsUser[]
}

export interface SelectedVendorsUserModel{
    selected?:VendorsUser
}