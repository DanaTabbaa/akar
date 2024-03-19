
import { Purchasers } from "../../models/purchasers";
import { PurchaserActions } from "../actions/purchaser.actions";
import { BaseReducer } from "./base.reducer";

export class PurchaserReducers extends BaseReducer<Purchasers>{
    public static readonly reducers:PurchaserReducers = new PurchaserReducers();
    constructor(){
        super(PurchaserActions.actions);
    }
}