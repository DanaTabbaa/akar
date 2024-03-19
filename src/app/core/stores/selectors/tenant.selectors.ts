import { SelectedTenantModel, TenantModel } from "../store.model.ts/tenants.store.model";
import { BaseSelector } from "./base.selector";

export class TenantsSelectors extends BaseSelector<TenantModel, SelectedTenantModel>{
    public static readonly selectors:TenantsSelectors = new TenantsSelectors();

    constructor(){
        super("tenants", "selectedTenant", "selectedTenantList");
    }
}