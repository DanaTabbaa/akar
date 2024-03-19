import { PurchasersUsers } from "src/app/core/models/purchasers-users";

export interface PurchasersUsersModel{
    list:PurchasersUsers[]
}

export interface SelectedPurchaserUserModel{
    selected?:PurchasersUsers
}