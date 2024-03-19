import { PartnerActions } from "../actions/partner.actions";
import { BaseReducer } from "./base.reducer";
import { Partners } from "src/app/core/models/partners";

export class PartnerReducers extends BaseReducer<Partners>{
    public static readonly reducers:PartnerReducers = new PartnerReducers();
    constructor(){
        super(PartnerActions.actions);
    }
}