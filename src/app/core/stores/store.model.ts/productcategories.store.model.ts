import { ProductCategory } from "../../models/Product-category"

export interface ProductCategoriesModel{
    list:ProductCategory[]
}

export interface SelectedProductCategoriesModel{
    selected?:ProductCategory
}