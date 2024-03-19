import { SelectedTenantsUserModel, TenantsUsersModel } from "../store.model.ts/tenantusers.store.model";
import { BaseSelector } from "./base.selector";

export class TenantUserSelectors extends BaseSelector<TenantsUsersModel, SelectedTenantsUserModel>{
    public static readonly selectors:TenantUserSelectors = new TenantUserSelectors();

    constructor(){
        super("tenantsusers", "selectedTenantUser", "selectedTenantUserList");
    }
}