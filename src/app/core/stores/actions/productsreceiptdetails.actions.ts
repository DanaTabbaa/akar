import { ProductsReceiptDetails } from "../../models/products-receipt-details";
import { BaseAction } from "./base.action";

export class ProductsReceiptDetailsActions extends BaseAction<ProductsReceiptDetails>{

    public static readonly actions:ProductsReceiptDetailsActions = new ProductsReceiptDetailsActions();
    constructor(){
        super("[ProductsReceiptDetailsActions]");
    }
}