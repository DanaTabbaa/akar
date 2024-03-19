import { Suppliers } from "../../models/suppliers"

export interface SuppliersModel{
    list:Suppliers[]
}

export interface SelectedSuppliersModel{
    selected?:Suppliers
}