import { PurchasersUsers } from "src/app/core/models/purchasers-users";
import { PurchaserUserActions } from "../actions/purchaseruser.actions";
import { BaseReducer } from "./base.reducer";

export class PurchaserUserReducers extends BaseReducer<PurchasersUsers>{
    public static readonly reducers:PurchaserUserReducers = new PurchaserUserReducers();
    constructor(){
        super(PurchaserUserActions.actions);
    }
}