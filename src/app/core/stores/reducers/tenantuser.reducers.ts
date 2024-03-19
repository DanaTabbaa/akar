import { TenantsUser } from "src/app/core/models/tenants-users";
import { TenantsUserActions } from "../actions/tenantuser.actions";
import { BaseReducer } from "./base.reducer";

export class TenantsUserReducers extends BaseReducer<TenantsUser>{
    public static readonly reducers:TenantsUserReducers = new TenantsUserReducers();
    constructor(){
        super(TenantsUserActions.actions);
    }
}