import { SelectedSuppliersModel, SuppliersModel } from "../store.model.ts/suppliers.store.model";
import { BaseSelector } from "./base.selector";

export class SuppliersSelectors extends BaseSelector<SuppliersModel, SelectedSuppliersModel>{
    public static readonly selectors:SuppliersSelectors = new SuppliersSelectors();

    constructor(){
        super("suppliers", "selectedSuppliers", "selectedSuppliersList");
    }
}