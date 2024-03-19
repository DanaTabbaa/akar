import { VendorsUser } from "src/app/core/models/vendors-users";
import { VendorsUserActions } from "../actions/vendoruser.actions";
import { BaseReducer } from "./base.reducer";

export class VendorsUserReducers extends BaseReducer<VendorsUser>{
    public static readonly reducers:VendorsUserReducers = new VendorsUserReducers();
    constructor(){
        super(VendorsUserActions.actions);
    }
}