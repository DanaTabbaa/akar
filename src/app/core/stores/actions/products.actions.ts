import { Products } from "../../models/products";
import { BaseAction } from "./base.action";

export class ProductsActions extends BaseAction<Products>{

    public static readonly actions:ProductsActions = new ProductsActions();
    constructor(){
        super("[ProductsActions]");
    }
}