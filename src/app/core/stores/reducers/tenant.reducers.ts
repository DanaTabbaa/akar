
import { Tenants } from "../../models/tenants";
import { TenantActions } from "../actions/tenant.actions";
import { BaseReducer } from "./base.reducer";

export class TenantReducers extends BaseReducer<Tenants>{
    public static readonly reducers:TenantReducers = new TenantReducers();
    constructor(){
        super(TenantActions.actions);
    }
}