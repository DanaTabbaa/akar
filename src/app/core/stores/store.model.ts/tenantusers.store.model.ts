import { TenantsUser } from "src/app/core/models/tenants-users";

export interface TenantsUsersModel{
    list:TenantsUser[]
}

export interface SelectedTenantsUserModel{
    selected?:TenantsUser
}