import { ProductsReceiptDetailsModel, SelectedProductsReceiptDetailsModel } from "../store.model.ts/productsreceiptdetails.store.model";
import { BaseSelector } from "./base.selector";

export class ProductsReceiptDetailsSelectors extends BaseSelector<ProductsReceiptDetailsModel, SelectedProductsReceiptDetailsModel>{
    public static readonly selectors:ProductsReceiptDetailsSelectors = new ProductsReceiptDetailsSelectors();

    constructor(){
        super("productsReceiptDetails", "selectedProductsReceiptDetails", "selectedProductsReceiptDetailsList");
    }
}