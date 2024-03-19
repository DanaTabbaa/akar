import { ProductCategory } from "../../models/Product-category";
import { ProductsCategoriesActions } from "../actions/productscategories.actions";
import { BaseReducer } from "./base.reducer";

export class ProductsCategoriesReducers extends BaseReducer<ProductCategory>{
    public static readonly reducers:ProductsCategoriesReducers = new ProductsCategoriesReducers();
    constructor(){
        super(ProductsCategoriesActions.actions);
    }
}