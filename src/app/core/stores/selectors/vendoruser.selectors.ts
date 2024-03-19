import { SelectedVendorsUserModel, VendorsUsersModel } from "../store.model.ts/vendorsusers.store.model";
import { BaseSelector } from "./base.selector";

export class VendorUserSelectors extends BaseSelector<VendorsUsersModel, SelectedVendorsUserModel>{
    public static readonly selectors:VendorUserSelectors = new VendorUserSelectors();

    constructor(){
        super("vendorsusers", "selectedVendorUser", "selectedVendorUserList");
    }
}