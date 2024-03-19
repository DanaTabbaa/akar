import { ProductsReceiptDetails } from "../../models/products-receipt-details";

export interface ProductsReceiptDetailsModel{
    list:ProductsReceiptDetails[]
}

export interface SelectedProductsReceiptDetailsModel{
    selected?:ProductsReceiptDetails
}