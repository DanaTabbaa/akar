import { Vendors } from "../../models/vendors";
import { VendorActions } from "../actions/vendor.actions";
import { BaseReducer } from "./base.reducer";

export class VendorReducers extends BaseReducer<Vendors>{
    public static readonly reducers:VendorReducers = new VendorReducers();
    constructor(){
        super(VendorActions.actions);
    }
}