import { Vendors } from "src/app/core/models/vendors";

export interface VendorsModel{
    list:Vendors[]
}

export interface SelectedVendorModel{
    selected?:Vendors
}