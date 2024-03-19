import { SelectedVendorModel, VendorsModel } from "../store.model.ts/vendors.store.model";
import { BaseSelector } from "./base.selector";

export class VendorSelectors extends BaseSelector<VendorsModel, SelectedVendorModel>{
    public static readonly selectors:VendorSelectors = new VendorSelectors();

    constructor(){
        super("vendors", "selectedVendor", "selectedVendorList");
    }
}