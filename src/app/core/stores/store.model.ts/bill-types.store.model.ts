import { BillType } from "src/app/core/models/bill-type";

export interface BillTypeModel{
    list:BillType[]
}

export interface SelectedBillTypeModel{
    selected?:BillType
}