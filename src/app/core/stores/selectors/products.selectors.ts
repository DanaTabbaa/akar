import { ProductsModel, SelectedProductsModel } from "../store.model.ts/products.store.model";
import { BaseSelector } from "./base.selector";

export class ProductsSelectors extends BaseSelector<ProductsModel, SelectedProductsModel>{
    public static readonly selectors:ProductsSelectors = new ProductsSelectors();

    constructor(){
        super("products", "selectedProducts", "selectedProductsList");
    }
}