import { Tenants } from "src/app/core/models/tenants";

export interface TenantModel{
    list:Tenants[]
}

export interface SelectedTenantModel{
    selected?:Tenants
}