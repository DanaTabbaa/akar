import { ProductCategoriesModel, SelectedProductCategoriesModel } from "../store.model.ts/productcategories.store.model";
import { BaseSelector } from "./base.selector";

export class ProductsCategoriesSelectors extends BaseSelector<ProductCategoriesModel, SelectedProductCategoriesModel>{
    public static readonly selectors:ProductsCategoriesSelectors = new ProductsCategoriesSelectors();

    constructor(){
        super("productsCategories", "selectedProductsCategories", "selectedProductsCategoriesList");
    }
}