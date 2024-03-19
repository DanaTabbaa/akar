import { ProductCategory } from "../../models/Product-category";
import { BaseAction } from "./base.action";

export class ProductsCategoriesActions extends BaseAction<ProductCategory>{

    public static readonly actions:ProductsCategoriesActions = new ProductsCategoriesActions();
    constructor(){
        super("[ProductsCategoriesActions]");
    }
}