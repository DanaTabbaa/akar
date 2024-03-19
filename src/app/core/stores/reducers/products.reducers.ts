import { Products } from "../../models/products";
import { ProductsActions } from "../actions/products.actions";
import { BaseReducer } from "./base.reducer";

export class ProductsReducers extends BaseReducer<Products>{
    public static readonly reducers:ProductsReducers = new ProductsReducers();
    constructor(){
        super(ProductsActions.actions);
    }
}