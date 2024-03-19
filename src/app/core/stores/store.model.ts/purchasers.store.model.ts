import { Purchasers } from "src/app/core/models/purchasers";

export interface PurchaserModel{
    list:Purchasers[]
}

export interface SelectedPurchaserModel{
    selected?:Purchasers
}