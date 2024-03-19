import { Products } from "../../models/products"

export interface ProductsModel{
    list:Products[]
}

export interface SelectedProductsModel{
    selected?:Products
}