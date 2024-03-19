import { PartnerUserActions } from "../actions/partneruser.actions";
import { BaseReducer } from "./base.reducer";
import { PartnerUser } from "src/app/core/models/partners-users";

export class PartnerUserReducers extends BaseReducer<PartnerUser>{
    public static readonly reducers:PartnerUserReducers = new PartnerUserReducers();
    constructor(){
        super(PartnerUserActions.actions);
    }
}