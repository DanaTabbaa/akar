import { Bills } from "../../models/bills"

export interface BillModel{
    list:Bills[]
}

export interface SelectedBillModel{
    selected?:Bills
}