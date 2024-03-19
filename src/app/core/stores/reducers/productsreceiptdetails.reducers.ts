import { ProductsReceiptDetails } from "../../models/products-receipt-details";
import { ProductsReceiptDetailsActions } from "../actions/productsreceiptdetails.actions";
import { BaseReducer } from "./base.reducer";

export class ProductsReceiptDetailsReducers extends BaseReducer<ProductsReceiptDetails>{
    public static readonly reducers:ProductsReceiptDetailsReducers = new ProductsReceiptDetailsReducers();
    constructor(){
        super(ProductsReceiptDetailsActions.actions);
    }
}